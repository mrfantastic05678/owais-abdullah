import Image from "next/image";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { PostCard } from "@/types/blogtypes";

const BlogCards = ({ post }: { post: PostCard }) => {
  return (
    <div className="flex flex-col gap-4 p-2 hover:scale-[1.03] duration-300 ease-in-out shadow-lg border border-border rounded-lg bg-card">
      <Link href={`/blog/${post.slug.current}`}>
        <Image
          className="rounded-lg w-full h-36 lg:h-44 object-cover"
          src={urlFor(post.mainImage).url() as string}
          alt={post.title}
          width={300}
          height={150}
        />{" "}
      </Link>
      {/* Displaying the categories, title, summary, and date */}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-wrap gap-2 mb-3">
          {!post.categories || post.categories.length === 0 ? (
            <span className="bg-gray-500/70 text-white text-xs px-2 py-1 rounded-full">
              Uncategorized
            </span>
          ) : (
            post.categories.map(
              (
                category: { title: string },
                i: React.Key | null | undefined
              ) => (
                <span
                  key={i}
                  className="bg-[#db4a4a]/70 text-white text-xs px-2 py-1 rounded-full"
                >
                  {category.title}
                </span>
              )
            )
          )}
        </div>{" "}
        <Link href={`/blog/${post.slug.current}`}>
          <h2 className="font-semibold text-sm xl:text-base 2xl:text-xl text-foreground line-clamp-2">
            {post.title}
          </h2>
        </Link>
        {/* Displaying the summary of the post */}
        <p className="text-foreground opacity-80 line-clamp-2 text-sm">
          {post.summary}
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-5 mt-2 justify-between items-center">
          <div className="flex flex-wrap max-sm:text-xs text-sm xl:text-base 2xl:text-lg">
              <p className="text-foreground opacity-50">
                {/* Formatting the date */}
                {new Date(post._createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
          </div>
          {/* Dynamically adding the slug in Read More Button */}
          <Link href={`/blog/${post.slug.current}`}>
            <button className="group border-border border-2 rounded-lg py-1 px-2 flex gap-2 lg:gap-3 sm:mt-0 mt-2">
              Read More{" "}
              <ArrowRight className="text-primary group-hover:-rotate-45 duration-200 " />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCards;