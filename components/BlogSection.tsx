"use client";
import React, { useState, useEffect } from "react";
import BlogCards from "@/components/ui/BlogCards";
import { PostCard, BlogSectionProps } from "@/types/blogtypes";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const BlogCardSkeleton = () => (
  <div className="border border-border rounded-lg overflow-hidden shadow-lg bg-card">
    <Skeleton className="w-full h-48" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Client component that fetches data on mount
const BlogSection = ({ limit, excludeLatest }: BlogSectionProps) => {
  const [blogs, setBlogs] = useState<PostCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) throw new Error('Failed to fetch blogs');

        const fetchedBlogs = await response.json();
        let displayedBlogs = limit ? fetchedBlogs.slice(0, limit) : fetchedBlogs;

        if (excludeLatest) {
          displayedBlogs = displayedBlogs.slice(1);
        }

        setBlogs(displayedBlogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [limit, excludeLatest]);

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h3 className="text-base text-accent font-semibold sm:text-lg">
          Latest News
        </h3>
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-3xl text-foreground font-semibold sm:text-4xl">
            Our Blog Posts
          </h2>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-5 sm:px-10 gap-6">
          {[...Array(6)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <h3 className="text-2xl font-bold text-red-500 mb-2">No Blog Posts Found</h3>
          <p className="text-lg text-gray-400 text-center max-w-xl">Sorry, there are currently no blog posts available. Please check back later.</p>
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-5 sm:px-10 gap-6"
          >
            {blogs.map((blog: PostCard, index: number) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="scroll-smooth border border-border rounded-lg overflow-hidden transition duration-300 shadow-lg bg-card"
              >
                <BlogCards key={index} post={blog} />
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <Link href="/blog">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 text-foreground bg-card hover:bg-accent hover:text-accent-foreground border-2 border-border hover:border-accent rounded-full font-medium transition-all duration-300 shadow-lg"
              >
                View All Posts
                <FaArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </>
      )}
    </section>
  );
};

export default BlogSection;
