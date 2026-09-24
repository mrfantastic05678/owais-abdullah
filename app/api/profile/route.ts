import { NextResponse } from "next/server";
import { profile } from "@/data/profile";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export const dynamic = "force-dynamic";

const profileStackQuery = groq`
  *[_type == "toolReview"] | order(myRating desc, dateAdded desc) {
    _id,
    name,
    "slug": slug.current,
    category,
    tagline,
    myRating,
    stackLayer,
    useCase,
    clientFit,
    websiteUrl,
    githubUrl,
    docsUrl,
    "logoUrl": logo.asset->url,
    featured,
    projectsUsingIt,
    dateAdded
  }
`;

// Single source of truth endpoint for profile data.
// Consumed by the chatbot, external AI agents/crawlers, and developers.
// Now dynamically enriched with the curated live stack from /stack and Sanity.
export async function GET() {
  try {
    const liveTools = await client.fetch(
      profileStackQuery,
      {},
      { next: { revalidate: 3600 } }
    );

    if (Array.isArray(liveTools) && liveTools.length > 0) {
      const formattedTools = liveTools.map((tool: any) => ({
        ...tool,
        reviewUrl: tool.slug ? `https://owaisabdullah.dev/stack/${tool.slug}` : undefined,
      }));

      const toolsByCategory = formattedTools.reduce((acc: Record<string, any[]>, tool: any) => {
        const cat = tool.category || "other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(tool);
        return acc;
      }, {});

      const essentialTools = formattedTools.filter(
        (t: any) => t.featured || t.myRating === 5
      );

      const enrichedProfile = {
        ...profile,
        stack: {
          ...profile.stack,
          totalTools: formattedTools.length,
          essentialTools: essentialTools,
          tools: formattedTools,
          byCategory: toolsByCategory,
        },
      };

      return NextResponse.json(enrichedProfile, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }
  } catch (error) {
    console.error("Error fetching live stack reviews for /api/profile:", error);
  }

  // Graceful fallback to static profile
  return NextResponse.json(profile, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
