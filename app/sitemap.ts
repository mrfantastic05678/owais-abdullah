import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { services } from "@/data/services";
import { getCategories, getCities, getAllStoreSlugs } from "@/lib/directory/queries";
import { getAllShowcaseSlugs } from "@/data/showcaseProjects";

export const revalidate = 86400;

type SanityItem = {
  slug: string;
  _updatedAt: string;
};

// Next.js Multi-Sitemap Partitioner: /sitemap/0.xml, /sitemap/1.xml, /sitemap/2.xml, /sitemap/3.xml
export async function generateSitemaps() {
  return [
    { id: "pages" },
    { id: "blogs" },
    { id: "stores" },
    { id: "stack" },
  ];
}

export default async function sitemap(props: { id: Promise<string> | string }): Promise<MetadataRoute.Sitemap> {
  const resolvedId = typeof props?.id === "object" && "then" in props.id ? await props.id : props?.id;
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

  // 3. Fetch directory categories, cities, and store slugs
  let directoryCategoryUrls: MetadataRoute.Sitemap = [];
  let directoryCityUrls: MetadataRoute.Sitemap = [];
  let directoryStoreUrls: MetadataRoute.Sitemap = [];

  try {
    const [categories, cities, storeSlugs] = await Promise.all([
      getCategories(),
      getCities(),
      getAllStoreSlugs(),
    ]);

    directoryCategoryUrls = categories.map((cat) => ({
      url: `${baseUrl}/stores/category/${cat.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    directoryCityUrls = cities.map((city) => ({
      url: `${baseUrl}/stores/city/${city.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    directoryStoreUrls = storeSlugs.map((slug) => ({
      url: `${baseUrl}/stores/${slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    }));
  } catch (error) {
    console.error("Error generating directory sitemap urls:", error);
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

  // Dynamic Project Showcase URLs
  const showcaseUrls: MetadataRoute.Sitemap = getAllShowcaseSlugs().map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Partition: BLOGS
  if (resolvedId === "blogs") {
    return [
      {
        url: `${baseUrl}/blog`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.9,
      },
      ...postUrls,
    ];
  }

  // Partition: STORES
  if (resolvedId === "stores") {
    return [
      {
        url: `${baseUrl}/stores`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/stores/submit`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${baseUrl}/stores/claim`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      ...directoryCategoryUrls,
      ...directoryCityUrls,
      ...directoryStoreUrls,
    ];
  }

  // Partition: STACK
  if (resolvedId === "stack") {
    return [
      {
        url: `${baseUrl}/stack`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      ...toolUrls,
    ];
  }

  // Partition: PAGES (Core static pages, services, projects showcase)
  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: "weekly",
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
    ...showcaseUrls,
    ...serviceUrls,
  ];
}
