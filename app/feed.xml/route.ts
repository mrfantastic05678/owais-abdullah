import { client } from "@/sanity/lib/client";

export const revalidate = 3600;

interface SanityPost {
  title: string;
  slug: { current: string };
  summary?: string;
  publishedAt: string;
}

export async function GET() {
  const posts: SanityPost[] = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0...50]{
      title,
      slug,
      summary,
      publishedAt
    }`
  );

  const baseUrl = "https://owaisabdullah.dev";

  const items = posts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug.current}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug.current}</guid>
      <description><![CDATA[${post.summary || ""}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Owais Abdullah - Blog</title>
    <link>${baseUrl}</link>
    <description>Articles on AI agents, Next.js SaaS, Digital FTEs, and modern web development by Owais Abdullah.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
