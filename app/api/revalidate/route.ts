import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

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
      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    // Default: revalidate core static routes
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/stores");
    return NextResponse.json({ revalidated: true, defaultPaths: ["/", "/blog", "/stores"], now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating", error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
