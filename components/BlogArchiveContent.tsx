"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Calendar, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { urlFor } from "@/sanity/lib/image";
import type { PostCard } from "@/types/blogtypes";
import BlogCards from "@/components/ui/BlogCards";
import CharRevealHeading from "@/components/CharRevealHeading";
import CharShuffleText from "@/components/ui/CharShuffleText";
import BlogAuthorCard from "@/components/BlogAuthorCard";

const POSTS_PER_PAGE = 9;
const ALL_TAB = "All";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BlogArchiveContent({ posts }: { posts: PostCard[] }) {
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({});

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.categories?.forEach((c) => set.add(c.title)));
    return [ALL_TAB, ...Array.from(set)];
  }, [posts]);

  const featured = posts[0];
  const rest = posts.slice(1);

  const postsByTab = useMemo(() => {
    const map: Record<string, PostCard[]> = {};
    categories.forEach((cat) => {
      map[cat] = cat === ALL_TAB ? rest : rest.filter((p) => p.categories?.some((c) => c.title === cat));
    });
    return map;
  }, [categories, rest]);

  const handleLoadMore = (tab: string) => {
    const total = postsByTab[tab]?.length ?? 0;
    setVisibleCount((prev) => ({
      ...prev,
      [tab]: Math.min((prev[tab] || POSTS_PER_PAGE) + POSTS_PER_PAGE, total),
    }));
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-5 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">No Posts Yet</h2>
        <p className="text-lg text-muted-foreground max-w-xl">New articles are on the way. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-base text-accent font-medium sm:text-lg">From the Blog</p>
        <CharRevealHeading
          as="h2"
          className="text-4xl text-foreground font-semibold sm:text-5xl"
          highlightWords={["Archive"]}
        >
          The Full Archive
        </CharRevealHeading>
      </motion.div>

      {/* Featured / latest post + author sidebar */}
      {featured && (
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-6 mb-16 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-accent font-mono text-xs tracking-widest uppercase mb-4 block">Latest</span>
            <Link
              href={`/blog/${featured.slug.current}`}
              className="group grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-3 md:pl-4 md:pr-0 items-center border border-border rounded-xl overflow-hidden bg-card hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 h-full"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={urlFor(featured.mainImage).width(900).url()}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 md:pr-10 md:pl-6 md:py-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(featured.categories?.length ? featured.categories : [{ title: "Uncategorized" }]).slice(0, 2).map((c, i) => (
                    <span key={i} className="bg-accent/15 text-foreground text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full border border-accent/20">
                      {c.title}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold text-2xl md:text-3xl leading-snug text-foreground group-hover:text-accent transition-colors duration-200">
                  {featured.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent mt-4 group-hover:gap-2 transition-all duration-200">
                  Read article
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-accent font-mono text-xs tracking-widest uppercase mb-4 block mt-6 lg:mt-0">Author</span>
            <BlogAuthorCard author={featured.author} />
          </motion.div>
        </div>
      )}

      {/* Category filters + grid */}
      {rest.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-3 p-2 bg-transparent mb-10">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="px-4 py-2 rounded-lg bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {cat}
                <span className="ml-2 text-xs opacity-70">({postsByTab[cat]?.length ?? 0})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => {
            const catPosts = postsByTab[cat] ?? [];
            const visible = catPosts.slice(0, visibleCount[cat] || POSTS_PER_PAGE);
            const hasMore = catPosts.length > (visibleCount[cat] || POSTS_PER_PAGE);

            return (
              <TabsContent key={cat} value={cat}>
                {catPosts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">No posts in this category yet.</p>
                ) : (
                  <>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      <AnimatePresence mode="popLayout">
                        {visible.map((post) => (
                          <motion.div key={post.slug.current} variants={itemVariants} exit={{ opacity: 0, scale: 0.8 }} className="h-full">
                            <BlogCards post={post} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {hasMore && (
                      <div className="flex justify-center mt-10">
                        <motion.button
                          onClick={() => handleLoadMore(cat)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="group relative inline-flex items-center gap-2 px-8 py-3 text-foreground bg-card border-2 border-border rounded-md font-medium shadow-lg overflow-hidden"
                        >
                          <span className="absolute inset-0 w-full h-full bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                          <span className="relative z-10 flex items-center gap-2 group-hover:text-accent-foreground transition-colors duration-300">
                            <CharShuffleText text="Load More Articles" />
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                          </span>
                        </motion.button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
