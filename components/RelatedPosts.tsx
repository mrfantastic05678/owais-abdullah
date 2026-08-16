"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

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
  const relatedQuery = `*[_type == "post" && slug.current != $slug && count((categories[]->title)[@ in $categories]) > 0] | order(_createdAt desc)[0...$limit]{
    _id,
    title,
    slug,
    mainImage,
    summary
  }`;
  const related = await client.fetch(relatedQuery, { slug: currentSlug, categories, limit });
  if (related.length) return related;

  const fallbackQuery = `*[_type == "post" && slug.current != $slug] | order(_createdAt desc)[0...$limit]{
    _id,
    title,
    slug,
    mainImage,
    summary
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
    <>
      <h2 className="text-xl lg:text-3xl text-center font-semibold mb-4 text-foreground">
        Related Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 md:px-8 lg:px-10">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug.current}`}
            className="block border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-background"
          >
            <div className="relative aspect-[16/9] w-full h-40 overflow-hidden">
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-base mb-2 text-foreground line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default RelatedPosts;