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

      {/* Featured / latest post */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <span className="text-accent font-mono text-xs tracking-widest uppercase mb-4 block">Latest</span>
          <Link
            href={`/blog/${featured.slug.current}`}
            className="group grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center border border-border rounded-xl overflow-hidden bg-card hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
          >
            <div className="relative aspect-video md:aspect-auto md:h-full overflow-hidden">
              <Image
                src={urlFor(featured.mainImage).width(900).height(600).url()}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:pr-10 md:py-10">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(featured.categories?.length ? featured.categories : [{ title: "Uncategorized" }]).slice(0, 2).map((c, i) => (
                  <span key={i} className="bg-accent/90 text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-md">
                    {c.title}
                  </span>
                ))}
              </div>
              <h3 className="font-semibold text-2xl md:text-3xl leading-snug text-foreground group-hover:text-accent transition-colors duration-200 mb-3">
                {featured.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-5">{featured.summary}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {featured.author?.name && (
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {featured.author.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(featured._createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all duration-200">
                  Read
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
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
