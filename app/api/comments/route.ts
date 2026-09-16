import { db } from "@/lib/db";
import * as schema from "@/schema/directory";
import { eq, and, desc, asc, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET: Fetch approved comments for a post
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ comments: [] });
    }

    // Fetch all approved comments for this slug
    const all = await db
      .select()
      .from(schema.blogComments)
      .where(
        and(
          eq(schema.blogComments.postSlug, slug),
          eq(schema.blogComments.status, "approved")
        )
      )
      .orderBy(asc(schema.blogComments.createdAt));

    // Structure into parents and nested replies
    const parentComments = all.filter((c) => !c.parentId);
    const replies = all.filter((c) => c.parentId);

    const commentsWithReplies = parentComments.map((parent) => ({
      ...parent,
      replies: replies.filter((r) => r.parentId === parent.id),
    }));

    return NextResponse.json({
      comments: commentsWithReplies,
      totalCount: all.length,
    });
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch comments" }, { status: 500 });
  }
}

// POST: Public submission of a new comment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postSlug, parentId, authorName, authorEmail, authorWebsite, content, _honeypot } = body;

    // Bot honeypot
    if (_honeypot) {
      return NextResponse.json({ success: true, message: "Comment received." });
    }

    if (!postSlug || !authorName?.trim() || !authorEmail?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Please provide your Name, Email, and Comment." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    const [newComment] = await db
      .insert(schema.blogComments)
      .values({
        postSlug: postSlug.trim(),
        parentId: parentId ? Number(parentId) : null,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        authorWebsite: authorWebsite?.trim() || null,
        content: content.trim(),
        isAdmin: false,
        status: "approved", // Auto-approved by default, with admin hide/reject controls
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Your comment has been posted!",
      comment: newComment,
    });
  } catch (error: any) {
    console.error("Error saving comment:", error);
    return NextResponse.json({ error: error.message || "Failed to post comment" }, { status: 500 });
  }
}
