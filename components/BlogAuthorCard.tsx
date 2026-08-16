import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, User } from "lucide-react";
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
  "Spec-driven developer and AI engineer building production-ready web apps, SaaS products, and AI-powered tools.";

export default function BlogAuthorCard({ author }: { author?: AuthorInfo | null }) {
  const name = author?.name || "Owais Abdullah";
  const bio = author?.bio?.trim() || FALLBACK_BIO;
  const avatar = author?.image ? urlFor(author.image).width(200).height(200).url() : null;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden h-full">
      <div className="p-5 md:p-6 flex flex-col gap-4 h-full">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/40 bg-muted shrink-0">
            {avatar ? (
              <Image src={avatar} alt={name} fill sizes="56px" className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent/10 text-accent">
                <User size={20} />
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-accent mb-0.5">Written by</p>
            <h3 className="font-semibold text-sm text-foreground leading-tight">{name}</h3>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-border">
          <Link
            href={"/about"}
            className="group inline-flex items-center justify-between px-3 py-2 rounded-md bg-foreground/5 hover:bg-accent hover:text-accent-foreground transition-colors duration-200 text-xs font-medium text-foreground"
          >
            More about me
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Link>
          <Link
            href={"/contact"}
            className="group inline-flex items-center justify-between px-3 py-2 rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors duration-200 text-xs font-medium"
          >
            Get in touch
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
}