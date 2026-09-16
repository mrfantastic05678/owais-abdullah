import { db } from "@/lib/db";
import * as schema from "@/schema/directory";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest, bodyPassword?: string): boolean {
  const serverPassword =
    process.env.ANALYTICS_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    "owais-vault-2026";

  const authHeader = req.headers.get("authorization")?.replace("Bearer ", "");
  const password = bodyPassword || authHeader;
  return Boolean(password && password === serverPassword);
}

// GET: Fetch all comments with status and metadata
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")?.replace("Bearer ", "");
    const urlPassword = req.nextUrl.searchParams.get("token") || "";

    if (!checkAuth(req, urlPassword || authHeader)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!db) {
      return NextResponse.json({ comments: [], stats: { total: 0, pending: 0, approved: 0, hidden: 0 } });
    }

    const allComments = await db
      .select()
      .from(schema.blogComments)
      .orderBy(desc(schema.blogComments.createdAt));

    const stats = {
      total: allComments.length,
      pending: allComments.filter((c) => c.status === "pending").length,
      approved: allComments.filter((c) => c.status === "approved").length,
      hidden: allComments.filter((c) => c.status === "hidden").length,
    };

    return NextResponse.json({ comments: allComments, stats });
  } catch (error: any) {
    console.error("Admin comments fetch error:", error);
    return NextResponse.json({ error: error.message || "Failed to load comments" }, { status: 500 });
  }
}

// POST: Admin Moderation Actions (approve, hide, reject/delete, edit, reply)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, action } = body;

    if (!checkAuth(req, password)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    switch (action) {
      case "update-status": {
        const { commentId, status } = body;
        if (!commentId || !status) {
          return NextResponse.json({ error: "Missing commentId or status" }, { status: 400 });
        }

        await db
          .update(schema.blogComments)
          .set({ status, updatedAt: new Date() })
          .where(eq(schema.blogComments.id, Number(commentId)));

        return NextResponse.json({ success: true, message: `Comment status updated to ${status}.` });
      }

      case "edit-content": {
        const { commentId, content } = body;
        if (!commentId || !content?.trim()) {
          return NextResponse.json({ error: "Missing commentId or content" }, { status: 400 });
        }

        await db
          .update(schema.blogComments)
          .set({ content: content.trim(), updatedAt: new Date() })
          .where(eq(schema.blogComments.id, Number(commentId)));

        return NextResponse.json({ success: true, message: "Comment updated successfully." });
      }

      case "admin-reply": {
        const { parentId, postSlug, replyContent } = body;
        if (!parentId || !postSlug || !replyContent?.trim()) {
          return NextResponse.json({ error: "Missing required reply parameters" }, { status: 400 });
        }

        const [reply] = await db
          .insert(schema.blogComments)
          .values({
            postSlug: postSlug.trim(),
            parentId: Number(parentId),
            authorName: "Owais Abdullah",
            authorEmail: "owais@owaisabdullah.dev",
            authorWebsite: "https://owaisabdullah.dev",
            content: replyContent.trim(),
            isAdmin: true,
            status: "approved",
          })
          .returning();

        return NextResponse.json({ success: true, message: "Reply published!", reply });
      }

      case "delete": {
        const { commentId } = body;
        if (!commentId) {
          return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
        }

        // Delete any child replies first
        await db
          .delete(schema.blogComments)
          .where(eq(schema.blogComments.parentId, Number(commentId)));

        // Delete the comment
        await db
          .delete(schema.blogComments)
          .where(eq(schema.blogComments.id, Number(commentId)));

        return NextResponse.json({ success: true, message: "Comment deleted permanently." });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin comment action failed:", error);
    return NextResponse.json({ error: error.message || "Failed to execute comment action" }, { status: 500 });
  }
}
