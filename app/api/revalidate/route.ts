import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");
  const tag = searchParams.get("tag");

  const validSecret = process.env.REVALIDATE_SECRET || "owais-revalidate-2026";
  if (secret !== validSecret) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    if (tag) {
      revalidateTag(tag, "default");
      return NextResponse.json({ revalidated: true, tag, now: Date.now() });
    }

    if (path) {
      revalidatePath(path);
      pingIndexNow([path]).catch(() => {});
      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    // Default: revalidate core static routes
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/stores");
    revalidatePath("/sitemap.xml");
    const defaultPaths = ["/", "/blog", "/stores", "/sitemap.xml"];
    pingIndexNow(defaultPaths).catch(() => {});
    return NextResponse.json({
      revalidated: true,
      defaultPaths,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating", error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const urlSecret = searchParams.get("secret");
    const headerSecret = request.headers.get("x-webhook-secret");
    const validSecret = process.env.REVALIDATE_SECRET || "owais-revalidate-2026";

    // Allow validation via URL ?secret= or Header x-webhook-secret
    if (urlSecret !== validSecret && headerSecret !== validSecret) {
      // Check if body contains secret
      let body: any = null;
      try {
        body = await request.json();
      } catch {}

      if (!body || body.secret !== validSecret) {
        return NextResponse.json({ message: "Invalid token or secret" }, { status: 401 });
      }

      return handleRevalidation(body);
    }

    let body: any = null;
    try {
      body = await request.json();
    } catch {}

    return handleRevalidation(body);
  } catch (err) {
    return NextResponse.json({ message: "Error in revalidation webhook", error: String(err) }, { status: 500 });
  }
}

function handleRevalidation(body: any) {
  const revalidated: string[] = [];

  // 1. If Sanity Webhook passes document info
  if (body) {
    const type = body._type || body.type;
    const slug = body.slug?.current || body.slug;

    if (type === "post") {
      revalidatePath("/");
      revalidatePath("/blog");
      revalidatePath("/sitemap.xml");
      revalidated.push("/", "/blog", "/sitemap.xml");

      if (slug) {
        revalidatePath(`/blog/${slug}`);
        revalidated.push(`/blog/${slug}`);
      }
    } else if (type === "toolReview") {
      revalidatePath("/stack");
      revalidatePath("/api/profile");
      revalidateTag("profile-stack", "default");
      revalidateTag("toolReview", "default");
      revalidatePath("/sitemap.xml");
      revalidated.push("/stack", "/api/profile", "profile-stack", "toolReview", "/sitemap.xml");

      if (slug) {
        revalidatePath(`/stack/${slug}`);
        revalidated.push(`/stack/${slug}`);
      }
    } else if (body.path) {
      revalidatePath(body.path);
      revalidated.push(body.path);
    }
  }

  // If no specific paths were revalidated yet, revalidate default core pages
  if (revalidated.length === 0) {
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/stores");
    revalidatePath("/stack");
    revalidatePath("/api/profile");
    revalidateTag("profile-stack", "default");
    revalidatePath("/sitemap.xml");
    revalidated.push("/", "/blog", "/stores", "/stack", "/api/profile", "profile-stack", "/sitemap.xml");
  }

  // Instant notification to Bing, Yandex, and IndexNow crawlers
  pingIndexNow(revalidated).catch(() => {});

  return NextResponse.json({
    revalidated: true,
    paths: revalidated,
    now: Date.now(),
  });
}

const INDEXNOW_KEY = "4ecdaee7d3534b4c80cecb7fa8cf55aa";
const BASE_URL = "https://owaisabdullah.dev";

async function pingIndexNow(paths: string[]) {
  try {
    const urls = paths
      .filter((p) => typeof p === "string" && !p.startsWith("profile-") && !p.startsWith("toolReview"))
      .map((p) => (p.startsWith("http") ? p : `${BASE_URL}${p.startsWith("/") ? "" : "/"}${p}`))
      .filter((u) => !u.includes("/api/") && !u.includes("/private"));

    if (urls.length === 0) return;

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: "owaisabdullah.dev",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch (err) {
    console.error("IndexNow ping non-fatal notice:", err);
  }
}
