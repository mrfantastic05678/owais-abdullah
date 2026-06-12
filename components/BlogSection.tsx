import React from "react";
import { BlogSectionProps } from "@/types/blogtypes";
import { getBlogPosts } from "@/lib/blogs";
import BlogSectionContent from "@/components/BlogSectionContent";

// Server component: posts are fetched at build/revalidate time so they're in
// the prerendered HTML (crawlable), not loaded client-side behind skeletons.
const BlogSection = async ({ limit, excludeLatest, showViewAll = false }: BlogSectionProps) => {
  const fetchedBlogs = await getBlogPosts();

  let displayedBlogs = limit ? fetchedBlogs.slice(0, limit) : fetchedBlogs;
  if (excludeLatest) {
    displayedBlogs = displayedBlogs.slice(1);
  }

  return <BlogSectionContent blogs={displayedBlogs} showViewAll={showViewAll} />;
};

export default BlogSection;
