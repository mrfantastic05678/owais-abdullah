
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { NextRequest, NextResponse } from "next/server";

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(req: NextRequest) {
  const { slug, action } = await req.json();

  if (!slug || !action) {
    return NextResponse.json({ error: "Missing slug or action" }, { status: 400 });
  }

  try {
    const post = await writeClient.fetch(
      `*[_type == "post" && slug.current == $slug][0]{"id":_id, "likes":likes, "dislikes":dislikes}`,
      { slug }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const incValue = action.startsWith("un") ? -1 : 1;
    let field;
    if (action === 'like' || action === 'unlike') {
      field = 'likes';
    } else {
      field = 'dislikes';
    }

    const updatedPost = await writeClient
      .patch(post.id)
      .setIfMissing({ likes: 0, dislikes: 0 })
      .inc({ [field]: incValue })
      .commit();

    return NextResponse.json({
      likes: updatedPost.likes,
      dislikes: updatedPost.dislikes,
      action,
      field,
    });
  } catch (error) {
    console.error("Error updating likes/dislikes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
