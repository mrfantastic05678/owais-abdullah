"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { CustomComponent } from "@/components/CustomComponent";
import { TableOfContents } from "@/components/TableOfContents";
import RelatedPosts from "@/components/RelatedPosts";
import { useEffect, useState } from "react";
import LikeDislikeButtons from "@/components/ui/LikeDislikeButtons";
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
  const [likes, setLikes] = useState(blog?.likes || 0);
  const [dislikes, setDislikes] = useState(blog?.dislikes || 0);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [showAnimation, setShowAnimation] = useState<"like" | "dislike" | null>(
    null
  );

  useEffect(() => {
    const vote = localStorage.getItem(`vote_${slug}`);
    if (vote) {
      setUserVote(vote as "like" | "dislike");
    }
  }, [slug]);

  const handleVote = async (action: "like" | "dislike") => {
    const newAction = userVote === action ? `un${action}` : action;

    setUserVote(userVote === action ? null : action);
    if (userVote === action) {
      localStorage.removeItem(`vote_${slug}`);
    } else {
      localStorage.setItem(`vote_${slug}`, action);
    }
    if (userVote !== action) {
      setShowAnimation(action);
      setTimeout(() => setShowAnimation(null), 1000);
    }

    const newLikes = newAction === "like" ? likes + 1 : newAction === "unlike" ? likes - 1 : likes;
    const newDislikes = newAction === "dislike" ? dislikes + 1 : newAction === "undislike" ? dislikes - 1 : dislikes;

    setLikes(newLikes);
    setDislikes(newDislikes);

    try {
      const response = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, action: newAction }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
      } else {
        // Revert optimistic update on failure
        setUserVote(null);
        localStorage.removeItem(`vote_${slug}`);
        setLikes(action === "like" ? likes : likes);
        setDislikes(action === "dislike" ? dislikes : dislikes);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      // Revert optimistic update on failure
      setUserVote(null);
      localStorage.removeItem(`vote_${slug}`);
      setLikes(action === "like" ? likes : likes);
      setDislikes(action === "dislike" ? dislikes : dislikes);
    }
  };
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
        <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-black/90 to-transparent" />
        <Image
          className="flex h-[450px] 2xl:h-[750px] w-screen object-cover items-center justify-center"
          src={urlFor(blog.mainImage).url() as string}
          alt={blog.title}
          width={1000}
          height={800}
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-black/40 to-transparent" />
      </motion.div>

      {/* Content Section */}
      <div className="max-w-[1480px] 2xl:max-w-[1360px] xl:max-w-[1160px] mx-auto px-4 sm:px-6 -mt-32 sm:-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-blog backdrop-blur-sm rounded-2xl shadow-2xl px-2 py-4 sm:p-4 md:p-8 lg:p-10"
        >
          {/* Header */}
          <header className="mb-8">
            <div className="flex justify-center items-center mb-4 lg:mb-8">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <div className="flex flex-wrap gap-2 mb-4 items-center justify-center">
              {!blog.categories || blog.categories.length === 0 ? (
                <span className="bg-gray-500/70 text-white text-xs px-2 py-1 rounded-md">
                  Uncategorized
                </span>
              ) : (
                blog.categories.map(
                  (category: { title: string }, i: React.Key) => (
                    <span
                      key={i}
                      className="bg-[#db4a4a]/70 text-white text-xs px-2 py-1 rounded-md"
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
            <LikeDislikeButtons
              handleVote={handleVote}
              userVote={userVote}
              showAnimation={showAnimation}
            />
          </header>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
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
            <div className="lg:col-span-8 px-2">
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-l-primary">
                <PortableText
                  value={blog.content}
                  components={CustomComponent}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-10 lg:mt-16">
          <LikeDislikeButtons
            handleVote={handleVote}
            userVote={userVote}
            showAnimation={showAnimation}
            ctaText="Did you find this article helpful?"
          />
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
        className="max-w-7xl mx-auto mt-14 px-4 sm:px-6 lg:px-8 w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
      >
        <RelatedPosts currentSlug={slug} limit={3} />
      </motion.div>
    </motion.article>
  );
}
