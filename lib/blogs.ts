import { client } from "@/sanity/lib/client";
import { PostCard } from "@/types/blogtypes";

// Server-side blog fetch shared by the homepage and blog page so posts are
// part of the prerendered HTML (crawlable by search engines and AI models).
export async function getBlogPosts(): Promise<PostCard[]> {
  try {
    const query = `*[_type == "post"] | order(_createdAt desc){
      title,
      slug,
      mainImage,
      summary,
      _createdAt,
      author->{name, image, "bio": pt::text(bio)},
      categories[]->{title}
    }`;

    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}
