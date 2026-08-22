import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const query = `*[_type == "promoBanner" && isActive == true][0]{
      _id,
      isActive,
      mode,
      scrollTriggerPercent,
      delaySeconds,
      dismissalCooldown,
      position,
      variantA{
        badgeText,
        headline,
        description,
        featureTags,
        bannerImage,
        ctaText,
        ctaUrl
      },
      variantB{
        badgeText,
        founderName,
        founderTitle,
        founderAvatar,
        note,
        bulletPoints,
        ctaText,
        ctaUrl
      }
    }`;

    const config = await client.fetch(query);

    return NextResponse.json(config || null, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error fetching promo banner config:", error);
    return NextResponse.json(null, { status: 500 });
  }
}
