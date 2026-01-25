import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  try {
    const query = `*[_type == "post"] | order(_createdAt desc){
      title,
      slug,
      mainImage,
      summary,
      _createdAt,
      author->{name},
      categories[]->{title}
    }`;

    const blogs = await client.fetch(query);

    return NextResponse.json(blogs, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json([], { status: 500 });
  }
}
