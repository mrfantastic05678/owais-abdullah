import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, User } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

export interface AuthorInfo {
  name?: string;
  image?: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  bio?: string;
}

const FALLBACK_BIO =
  "Spec-driven developer and AI engineer. Founder of Octively, building Next.js SaaS platforms, autonomous Digital FTEs (AI employees), and production-ready intelligent workflows.";

export default function BlogAuthorCard({
  author,
  variant = "detailed",
}: {
  author?: AuthorInfo | null;
  variant?: "compact" | "detailed";
}) {
  const name = author?.name || "Owais Abdullah";
  const bio = author?.bio?.trim() || FALLBACK_BIO;
  const avatar = author?.image ? urlFor(author.image).width(200).height(200).url() : "/assets/owais-abdullah.webp";

  // COMPACT VARIANT (Used on main /blog archive page next to featured article)
  if (variant === "compact") {
    return (
      <div className="flex flex-col justify-between rounded-xl border border-border bg-card overflow-hidden h-full shadow-sm hover:border-accent/40 transition-colors duration-300">
        <div className="p-5 flex flex-col justify-between h-full gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent/40 bg-muted shrink-0 shadow-inner">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={name}
                  fill
                  sizes="48px"
                  className="object-cover object-top"
                  unoptimized={avatar.startsWith("/assets")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent/10 text-accent">
                  <User size={18} />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold">
                  Written by
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 bg-signal-500/10 text-signal-500 rounded border border-signal-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-500 animate-pulse" />
                  Founder
                </span>
              </div>
              <h3 className="font-semibold text-sm text-foreground leading-tight">{name}</h3>
              <p className="text-[11px] text-muted-foreground">Web & AI Engineer · Founder @ Octively</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-3 border-t border-border mt-auto">
            <Link
              href={"/about"}
              className="group inline-flex items-center justify-between px-3 py-2 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors duration-200 text-xs font-medium"
            >
              About Owais
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 opacity-70" />
            </Link>
            <Link
              href={"/contact"}
              className="group inline-flex items-center justify-between px-3 py-2 rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors duration-200 text-xs font-medium shadow-sm"
            >
              Work Together
              <Sparkles size={12} className="group-hover:rotate-12 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // DETAILED VARIANT (Used on /blog/[slug] blog detail page)
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden h-full shadow-sm hover:border-accent/40 transition-colors duration-300">
      <div className="p-5 md:p-6 flex flex-col gap-4 h-full">
        {/* Author Header */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/40 bg-muted shrink-0 shadow-inner">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                fill
                sizes="56px"
                className="object-cover object-top"
                unoptimized={avatar.startsWith("/assets")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent/10 text-accent">
                <User size={20} />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold">
                Written by
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 bg-signal-500/10 text-signal-500 rounded border border-signal-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-signal-500 animate-pulse" />
                Founder
              </span>
            </div>
            <h3 className="font-semibold text-base text-foreground leading-tight">{name}</h3>
            <p className="text-xs text-muted-foreground">Web & AI Engineer · Founder @ Octively</p>
          </div>
        </div>

        {/* Author Bio */}
        <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
          {bio}
        </p>

        {/* CTA Links */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3 border-t border-border">
          <Link
            href={"/about"}
            className="group flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors duration-200 text-xs font-medium"
          >
            About Owais
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 opacity-70" />
          </Link>
          <Link
            href={"/contact"}
            className="group flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors duration-200 text-xs font-medium shadow-sm"
          >
            Work Together
            <Sparkles size={13} className="group-hover:rotate-12 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
}