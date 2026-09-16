import { db } from "@/lib/db";
import * as schema from "@/schema/directory";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { slug, action } = await req.json();

    if (!slug || !action) {
      return NextResponse.json({ error: "Missing slug or action" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ likes: 0, dislikes: 0, error: "Database not connected" });
    }

    // 1. Fetch or initialize post metrics
    const [existing] = await db
      .select()
      .from(schema.blogPostMetrics)
      .where(eq(schema.blogPostMetrics.slug, slug))
      .limit(1);

    let likes = existing ? existing.likes : 0;
    let dislikes = existing ? existing.dislikes : 0;

    if (action === "like") {
      likes += 1;
    } else if (action === "unlike") {
      likes = Math.max(0, likes - 1);
    } else if (action === "dislike") {
      dislikes += 1;
    } else if (action === "undislike") {
      dislikes = Math.max(0, dislikes - 1);
    }

    if (existing) {
      await db
        .update(schema.blogPostMetrics)
        .set({
          likes,
          dislikes,
          updatedAt: new Date(),
        })
        .where(eq(schema.blogPostMetrics.slug, slug));
    } else {
      await db.insert(schema.blogPostMetrics).values({
        slug,
        views: 1,
        likes,
        dislikes,
      });
    }

    return NextResponse.json({
      success: true,
      likes,
      dislikes,
      action,
      source: "neon",
    });
  } catch (error) {
    console.error("Error updating likes/dislikes in Neon:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Fetch current counts from Neon
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ likes: 0, dislikes: 0, views: 0 });
    }

    const [existing] = await db
      .select()
      .from(schema.blogPostMetrics)
      .where(eq(schema.blogPostMetrics.slug, slug))
      .limit(1);

    return NextResponse.json({
      likes: existing ? existing.likes : 0,
      dislikes: existing ? existing.dislikes : 0,
      views: existing ? existing.views : 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
