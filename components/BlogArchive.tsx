import { getBlogPosts } from "@/lib/blogs";
import BlogArchiveContent from "@/components/BlogArchiveContent";

// Server component: posts are fetched at build/revalidate time so the full
// archive is part of the prerendered HTML (crawlable), matching the pattern
// already used for the homepage teaser (see components/BlogSection.tsx).
export default async function BlogArchive() {
  const posts = await getBlogPosts();
  return <BlogArchiveContent posts={posts} />;
}
