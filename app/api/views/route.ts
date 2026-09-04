import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { NextRequest, NextResponse } from "next/server";
import { parseTelemetry } from "@/lib/analytics-parser";
import { recordAnalyticsEvent } from "@/lib/analytics-recorder";

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const post = await writeClient.fetch(
      `*[_type == "post" && slug.current == $slug][0]{"id": _id, "views": views}`,
      { slug }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const telemetry = parseTelemetry(req, body);

    // Update post view count & record telemetry in parallel
    const [updatedPost] = await Promise.all([
      writeClient
        .patch(post.id)
        .setIfMissing({ views: 0 })
        .inc({ views: 1 })
        .commit(),
      recordAnalyticsEvent("page_view", `/blog/${slug}`, telemetry),
    ]);

    return NextResponse.json({
      success: true,
      slug,
      views: updatedPost.views,
      telemetry: {
        country: telemetry.country,
        city: telemetry.city,
        device: telemetry.device,
        browser: telemetry.browser,
      },
    });
  } catch (error) {
    console.error("Error incrementing post views:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
