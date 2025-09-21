import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

type Post = {
  slug: {
    current: string;
  };
  _updatedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://owaisabdullah.dev";
  const currentDate = new Date().toISOString();

  const postsQuery = `*[_type == "post"]{
    "slug": slug.current,
    _updatedAt
  }`;
  const posts: Post[] = await client.fetch(postsQuery);

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt).toISOString(),
    changeFrequency: "weekly" as "weekly",
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...postUrls,
  ];
}
