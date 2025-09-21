"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { CustomComponent } from "@/components/CustomComponent";
import { TableOfContents } from "@/components/TableOfContents";
import RelatedPosts from "@/components/RelatedPosts";
import { Calendar, User } from "lucide-react";
import { Post } from "@/types/post";
import FaqSection from "@/components/Faq";
import { JsonLdFaq } from "@/components/JsonLdFaq";
import JsonLdBlog from "@/components/JsonLdBlog";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function BlogPageClient({
  blog,
  slug,
}: {
  blog: Post;
  slug: string;
}) {
  if (!blog) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative -top-[90px] flex flex-col min-h-[60vh] items-center justify-center mb-20"
      >
        <div className="flex flex-col items-center justify-center gap-4 p-10">
          <h1 className="text-3xl lg:text-5xl font-bold text-center text-red-500">
            Blog Post Not Found
          </h1>
          <p className="text-lg text-center text-gray-400 max-w-xl">
            Sorry, the blog post you are looking for does not exist or has been
            removed.
          </p>
        </div>
      </motion.article>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: blog.title, href: `/blog/${slug}` },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative -top-[120px] flex flex-col min-h-screen mb-20"
    >
      <JsonLdBlog blog={blog} slug={slug} />
      {blog.faqs && blog.faqs.length > 0 && <JsonLdFaq faqs={blog.faqs} />}
      {/* Hero Image Section */}
      <motion.div
        className="relative border-b-4 border-border"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/90 from-20% via-black/50 to-transparent" />
        <Image
          className="flex h-[450px] 2xl:h-[750px] w-screen object-cover items-center justify-center"
          src={urlFor(blog.mainImage).url() as string}
          alt={blog.title}
          width={1000}
          height={800}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </motion.div>

      {/* Content Section */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-2xl px-2 py-4 sm:p-4 md:p-8 lg:p-12"
        >
          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <div className="flex flex-wrap gap-2 mb-4 items-center justify-center">
              {!blog.categories || blog.categories.length === 0 ? (
                <span className="bg-gray-500/70 text-white text-xs px-2 py-1 rounded-full">
                  Uncategorized
                </span>
              ) : (
                blog.categories.map(
                  (category: { title: string }, i: React.Key) => (
                    <span
                      key={i}
                      className="bg-[#db4a4a]/70 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {category.title}
                    </span>
                  )
                )
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-heading mb-4">
              {blog.title}
            </h1>
            <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{blog.author?.name || "Admin"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(blog._createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
            {/* Table of Contents (Mobile) */}
            <aside className="lg:hidden mb-8">
              <TableOfContents content={blog.content} />
            </aside>

            {/* Table of Contents (Desktop - Sticky) */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-24">
                <TableOfContents content={blog.content} />
              </div>
            </aside>

            {/* Article Body */}
            <div className="lg:col-span-8">
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-l-primary">
                <PortableText
                  value={blog.content}
                  components={CustomComponent}
                />
              </div>
            </div>
          </div>
          {/* FAQ Section */}
          {blog.faqs && blog.faqs.length > 0 && (
            <motion.div
              className="mt-12 lg:mt-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <FaqSection faqs={blog.faqs} />
            </motion.div>
          )}
        </motion.div>
      </div>
      {/* Related Posts Section */}
      <motion.div
        className="max-w-6xl mx-auto mt-14 px-4 sm:px-6 lg:px-8 w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
      >
        <RelatedPosts currentSlug={slug} limit={3} />
      </motion.div>
    </motion.article>
  );
}
