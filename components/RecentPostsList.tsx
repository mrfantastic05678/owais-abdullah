import Image from "next/image";
import Link from "next/link";
import { Calendar, Activity } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

export interface RecentPost {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: {
    _type: string;
    asset: { _ref: string; _type: string };
  };
  _createdAt: string;
}

export default function RecentPostsList({
  posts,
  variant = "standard",
}: {
  posts: RecentPost[];
  variant?: "standard" | "sidebar";
}) {
  if (!posts || !posts.length) return null;

  if (variant === "sidebar") {
    return (
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-2 pb-2 border-b border-border/80">
          <Activity className="w-3.5 h-3.5 text-accent" />
          <span>Recent Posts</span>
        </div>
        <div className="flex flex-col divide-y divide-border/60">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="group py-2.5 first:pt-1 last:pb-1 transition-transform duration-200"
            >
              <div className="font-mono text-[10px] text-accent font-semibold tracking-wider uppercase mb-1">
                {new Date(post._createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <h4 className="text-xs font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug group-hover:translate-x-0.5">
                {post.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-5 md:p-6">
        <p className="text-xs font-mono tracking-widest uppercase text-accent mb-4">Recent Posts</p>
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post._id}>
              <Link
                href={`/blog/${post.slug.current}`}
                className="group flex items-center gap-3"
              >
                <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
                  <Image
                    src={urlFor(post.mainImage).width(160).height(120).url()}
                    alt={post.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h4>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar size={11} />
                    {new Date(post._createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}