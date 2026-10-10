"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import BlogImageWithSkeleton from "@/components/BlogImageWithSkeleton";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Calendar } from "lucide-react";

interface RelatedPost {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: {
    _type: string;
    asset: { _ref: string; _type: string };
    alt?: string;
  };
  summary: string;
  _createdAt?: string;
}

interface RelatedPostsProps {
  currentSlug: string;
  categories: string[];
  limit?: number;
}

async function fetchRelatedPosts(
  currentSlug: string,
  categories: string[],
  limit = 3
): Promise<RelatedPost[]> {
  const relatedQuery = `*[_type == "post" && slug.current != $slug && defined(mainImage.asset) && count((categories[]->title)[@ in $categories]) > 0] | order(_createdAt desc)[0...$limit]{
    _id,
    title,
    slug,
    mainImage,
    summary,
    _createdAt
  }`;
  const related = await client.fetch(relatedQuery, { slug: currentSlug, categories, limit });
  if (related.length) return related;

  const fallbackQuery = `*[_type == "post" && slug.current != $slug && defined(mainImage.asset)] | order(_createdAt desc)[0...$limit]{
    _id,
    title,
    slug,
    mainImage,
    summary,
    _createdAt
  }`;
  return await client.fetch(fallbackQuery, { slug: currentSlug, limit });
}

const RelatedPosts = ({ currentSlug, categories, limit = 3 }: RelatedPostsProps) => {
  const [posts, setPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    fetchRelatedPosts(currentSlug, categories, limit).then(setPosts);
  }, [currentSlug, categories, limit]);

  if (!posts.length) return null;

  return (
    <div className="w-full">
      <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-foreground tracking-tight">
        Related Engineering Articles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug.current}`}
            className="group flex flex-col h-full bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden transition-colors duration-200 hover:border-accent/70"
          >
            <div className="relative overflow-hidden aspect-video bg-muted/20">
              {post.mainImage?.asset ? (
                <BlogImageWithSkeleton
                  src={urlFor(post.mainImage).width(640).height(360).url()}
                  alt={post.mainImage.alt || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs font-mono">
                  ARTICLE
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1 p-5 gap-2.5">
              <span className="font-mono text-[10px] sm:text-[11px] text-accent font-bold uppercase tracking-wider">
                {categories[0] || "ENGINEERING"}
              </span>
              <h4 className="font-semibold text-sm sm:text-base leading-snug text-foreground line-clamp-2 group-hover:text-accent transition-colors duration-200">
                {post.title}
              </h4>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2 flex-1">
                {post.summary}
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="text-accent/80 font-medium">Read Article →</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 opacity-70" />
                  {post._createdAt
                    ? new Date(post._createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "ARTICLE"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;