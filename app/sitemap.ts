import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { services } from "@/data/services";

// Dynamically revalidate sitemap every 60 seconds
export const revalidate = 60;

type SanityItem = {
  slug: string;
  _updatedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://owaisabdullah.dev";
  const currentDate = new Date().toISOString();

  // 1. Fetch all blog posts dynamically from Sanity
  let posts: SanityItem[] = [];
  try {
    posts = await client.fetch(
      `*[_type == "post" && defined(slug.current)]{
        "slug": slug.current,
        _updatedAt
      }`
    );
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
  }

  // 2. Fetch all stack tools dynamically from Sanity
  let tools: SanityItem[] = [];
  try {
    tools = await client.fetch(
      `*[_type == "toolReview" && defined(slug.current)]{
        "slug": slug.current,
        _updatedAt
      }`
    );
  } catch (error) {
    console.error("Error fetching stack tools for sitemap:", error);
  }

  // Dynamic Blog URLs (Updated Daily)
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post._updatedAt ? new Date(post._updatedAt).toISOString() : currentDate,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Dynamic Stack Tool URLs
  const toolUrls: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/stack/${tool.slug}`,
    lastModified: tool._updatedAt ? new Date(tool._updatedAt).toISOString() : currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic Services URLs
  const serviceUrls: MetadataRoute.Sitemap = Object.values(services).map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stack`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
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
    ...serviceUrls,
  ];
}
