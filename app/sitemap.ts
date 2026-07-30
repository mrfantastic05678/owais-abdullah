import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { allToolSlugsQuery } from "@/lib/sanity/queries";

export const revalidate = 60;

type Post = {
  slug: {
    current: string;
  };
  _updatedAt: string;
};

type Tool = {
  slug: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://owaisabdullah.dev";
  const currentDate = new Date().toISOString();

  // Fetch blog posts
  const postsQuery = `*[_type == "post"]{
    "slug": slug.current,
    _updatedAt
  }`;
  const posts: Post[] = await client.fetch(postsQuery);

  // Fetch stack tools
  const toolSlugs: string[] = await client.fetch(allToolSlugsQuery);

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt).toISOString(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const toolUrls: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${baseUrl}/stack/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stack`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
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
    ...toolUrls,
  ];
}
