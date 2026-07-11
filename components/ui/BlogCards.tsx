import Image from "next/image";
import React from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar, User } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { PostCard } from "@/types/blogtypes";

const BlogCards = ({ post }: { post: PostCard }) => {
  const formattedDate = new Date(post._createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video">
        <Image
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={urlFor(post.mainImage).width(640).height(360).url()}
          alt={post.title}
          width={640}
          height={360}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badges overlaid on image bottom-left */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {!post.categories || post.categories.length === 0 ? (
            <span className="bg-muted/80 backdrop-blur-sm text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-md">
              Uncategorized
            </span>
          ) : (
            post.categories.slice(0, 2).map((category, i) => (
              <span
                key={i}
                className="bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-md"
              >
                {category.title}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h2 className="font-semibold text-base leading-snug text-foreground line-clamp-2 group-hover:text-accent transition-colors duration-200">
          {post.title}
        </h2>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
          {post.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {post.author?.name && (
              <span className="flex items-center gap-1">
                <User size={12} />
                {post.author.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all duration-200">
            Read
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCards;
