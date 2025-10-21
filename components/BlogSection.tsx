import { client } from "@/sanity/lib/client";
import React from "react";
import BlogCards from "@/components/ui/BlogCards";
import { PostCard, BlogSectionProps } from "@/types/blogtypes";


const BlogSection = async ({ limit, excludeLatest }: BlogSectionProps) => {
  // Query to fetch posts for BlogSection
  const query = `*[_type == "post"] | order(_createdAt desc){
      title,
      slug,
      mainImage,
      summary,
      _createdAt,
      author->{name},
      categories[]->{title}
    }`;

  const blogs = await client.fetch(query, {}, { next: { revalidate: 30 } });

  let displayedBlogs = limit ? blogs.slice(0, limit) : blogs;

  // Exclude the latest post if required
  if (excludeLatest) {
    displayedBlogs = displayedBlogs.slice(1);
  }
  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <h3 className="text-base text-accent font-semibold sm:text-lg">
          Latest News
        </h3>
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-3xl text-foreground font-semibold sm:text-4xl">
            Our Blog Posts
          </h2>
        </div>
      </div>
      {displayedBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <h3 className="text-2xl font-bold text-red-500 mb-2">No Blog Posts Found</h3>
          <p className="text-lg text-gray-400 text-center max-w-xl">Sorry, there are currently no blog posts available. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-5 sm:px-10 gap-6">
          {/* Displaying the blog cards */}
          {displayedBlogs.map((blog: PostCard, index: number) => (
            <div
              key={index}
              className="entrance scroll-smooth border border-border rounded-lg overflow-hidden hover:scale-105 transition duration-300 shadow-lg bg-card"
            >
              <BlogCards key={index} post={blog} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogSection;