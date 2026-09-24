import { NextResponse } from "next/server";
import { profile } from "@/data/profile";
import { formatCuratedStack, CuratedToolItem } from "@/data/curated-stack";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Incremental Static Regeneration: 1 hour (3600 seconds)
export const revalidate = 3600;

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

// In-memory warm cache:
// Caches the formatted profile with live stack tools for rapid zero-latency responses.
// If Sanity has transient network blips, the cached version is continuously served.
let warmMemoryProfileCache: {
  data: any;
  timestamp: number;
} | null = null;

const IN_MEMORY_TTL_MS = 60 * 60 * 1000; // 1 hour

// Single source of truth endpoint for profile data.
// Consumed by the chatbot, external AI agents/crawlers, and developers.
// Employs Next.js ISR route caching, tagged data revalidation, and in-memory warm fallback.
export async function GET() {
  const now = Date.now();

  // If we have a warm cache within TTL, return it immediately
  if (warmMemoryProfileCache && now - warmMemoryProfileCache.timestamp < IN_MEMORY_TTL_MS) {
    return NextResponse.json(warmMemoryProfileCache.data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Profile-Source": "memory-cache-hit",
      },
    });
  }

  try {
    // next-sanity hooks directly into Next.js Data Cache with tags and revalidate
    const liveTools: CuratedToolItem[] = await client.fetch(
      profileStackQuery,
      {},
      {
        next: {
          revalidate: 3600,
          tags: ["profile-stack", "toolReview"],
        },
      }
    );

    if (Array.isArray(liveTools) && liveTools.length > 0) {
      const enrichedStack = formatCuratedStack(liveTools);

      const enrichedProfile = {
        ...profile,
        stack: enrichedStack,
      };

      warmMemoryProfileCache = {
        data: enrichedProfile,
        timestamp: now,
      };

      return NextResponse.json(enrichedProfile, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "X-Profile-Source": "cache-live",
        },
      });
    }
  } catch (error) {
    console.error("Error retrieving cached stack reviews for /api/profile:", error);
  }

  // If live fetch fails, serve the warm in-memory cache if available (stale-while-revalidate)
  if (warmMemoryProfileCache) {
    return NextResponse.json(warmMemoryProfileCache.data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Profile-Source": "warm-cache-stale",
      },
    });
  }

  // Baseline fallback (which already contains initialCuratedStack with all 20 tools)
  return NextResponse.json(profile, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Profile-Source": "initial-curated-stack",
    },
  });
}
