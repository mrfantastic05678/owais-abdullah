"use client";
import React from "react";
import BlogCards from "@/components/ui/BlogCards";
import { PostCard } from "@/types/blogtypes";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

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

const BlogSectionContent = ({ blogs, showViewAll = false }: { blogs: PostCard[]; showViewAll?: boolean }) => {
  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <p className="text-base text-accent font-semibold sm:text-lg">
          From the Blog
        </p>
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-4xl text-foreground font-semibold sm:text-5xl">
            Latest Articles
          </h2>
        </div>
      </motion.div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <h3 className="text-2xl font-bold text-foreground mb-2">No Posts Yet</h3>
          <p className="text-lg text-muted-foreground text-center max-w-xl">
            New articles are on the way. Check back soon.
          </p>
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
                key={blog.slug?.current || index}
                variants={itemVariants}
                className="h-full"
              >
                <BlogCards post={blog} />
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button — only shown when explicitly requested (homepage) */}
          {showViewAll && <motion.div
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
          </motion.div>}
        </>
      )}
    </section>
  );
};

export default BlogSectionContent;
