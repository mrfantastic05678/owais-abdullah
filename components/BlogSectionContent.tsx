"use client";
import React from "react";
import { PostCard } from "@/types/blogtypes";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import OverlappingSlider from "./OverlappingSlider";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";



const BlogSectionContent = ({ blogs, showViewAll = false }: { blogs: PostCard[]; showViewAll?: boolean }) => {
  return (
    <section className="max-w-[1600px] mx-auto py-20 px-4 sm:px-6 lg:px-8">
      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <h3 className="text-2xl font-bold text-foreground mb-2">No Posts Yet</h3>
          <p className="text-lg text-muted-foreground text-center max-w-xl">
            New articles are on the way. Check back soon.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block w-full relative px-10 md:px-16 overflow-hidden">
            <OverlappingSlider 
              posts={blogs} 
              cardWidth="25vw"
              cardHeight="32vw"
            />
          </div>
          
          <div className="block md:hidden">
             <OverlappingSlider 
              posts={blogs} 
              cardWidth="80vw"
              cardHeight="110vw"
              gap={0.05}
            />
          </div>

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
                className="group inline-flex items-center gap-2 px-8 py-3 text-foreground bg-card border-2 border-border hover:border-signal-500 rounded-md font-medium transition-colors duration-300 shadow-lg"
              >
                <SplitFlapLabel primary="View All Posts" secondary="See every article" className="min-w-[9.5rem]" />
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
