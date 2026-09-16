import { db } from "@/lib/db";
import * as schema from "@/schema/directory";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { parseTelemetry } from "@/lib/analytics-parser";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const telemetry = parseTelemetry(req, body);

    // If Neon DB is available, perform atomic update in Neon
    if (db) {
      // 1. Get or create post metrics in Neon
      const [existing] = await db
        .select()
        .from(schema.blogPostMetrics)
        .where(eq(schema.blogPostMetrics.slug, slug))
        .limit(1);

      let currentViews = 1;
      if (existing) {
        currentViews = existing.views + 1;
        await db
          .update(schema.blogPostMetrics)
          .set({
            views: currentViews,
            updatedAt: new Date(),
          })
          .where(eq(schema.blogPostMetrics.slug, slug));
      } else {
        await db.insert(schema.blogPostMetrics).values({
          slug,
          views: 1,
          likes: 0,
          dislikes: 0,
        });
      }

      // 2. Insert high-speed telemetry event into Neon
      await db.insert(schema.siteAnalyticsEvents).values({
        eventType: "page_view",
        path: `/blog/${slug}`,
        country: telemetry.country || "Unknown",
        countryCode: telemetry.countryCode || "GL",
        city: telemetry.city || "Unknown",
        device: telemetry.device || "Desktop",
        browser: telemetry.browser || "Unknown",
        os: telemetry.os || "Unknown",
        referrerDomain: telemetry.referrerDomain || "Direct",
      });

      return NextResponse.json({
        success: true,
        slug,
        views: currentViews,
        source: "neon",
        telemetry: {
          country: telemetry.country,
          city: telemetry.city,
          device: telemetry.device,
          browser: telemetry.browser,
        },
      });
    }

    return NextResponse.json({ success: true, slug, views: 1, source: "fallback" });
  } catch (error) {
    console.error("Error logging post view in Neon:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
