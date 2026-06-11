import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaLinkedin,
  FaFacebookSquare,
  FaInstagramSquare,
  FaGithubSquare,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto text-muted-foreground body-font relative">
      {/* Natural gradient blob coming from below with larger size */}
      <div className="absolute bottom-5 md:-bottom-20 left-10 md:-left-20 w-64 h-64 bg-gradient-to-tl from-accent to-black/50 rounded-full blur-2xl opacity-70 md:opacity-50 dark:opacity-30 -z-10"></div>

      <div className="px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <Link href={"/"} className="flex mb-4 md:mb-0 relative" aria-label="Owais Abdullah home">
          <Image src="/assets/owais_logo.png" width={80} height={40} alt={"Owais Abdullah logo"} className="relative z-10" unoptimized />
        </Link>
        <p className="text-sm text-muted-foreground sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-border sm:py-2 sm:mt-0 mt-4">
          © {new Date().getFullYear()} Owais Abdullah —
          <Link
            href="https://www.linkedin.com/in/mrowaisabdullah/"
            className="ml-1 hover:text-accent"
            target="_blank"
          >
            @MrOwaisAbdullah
          </Link>
        </p>
        <span className="inline-flex gap-3 sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <Link
            href="/services"
            className="text-muted-foreground text-base font-semibold hover:text-accent mr-2"
            prefetch={false}
          >
            Services
          </Link>
          <Link
            href="/blog"
            className="text-muted-foreground text-base font-semibold hover:text-accent mr-2"
            prefetch={false}
          >
            Blog
          </Link>
          <Link
            href={"https://www.twitter.com/MrOwaisAbdullah"}
            className="text-muted-foreground text-2xl hover:text-foreground"
            target="_blank"
            aria-label="Follow me on X (Twitter)"
          >
            <FaSquareXTwitter aria-hidden="true" />
          </Link>
          <Link
            href={"https://www.linkedin.com/in/mrowaisabdullah/"}
            className="text-muted-foreground text-2xl hover:text-[#0077B5]"
            target="_blank"
            aria-label="Connect with me on LinkedIn"
          >
            <FaLinkedin aria-hidden="true" />
          </Link>
          <Link
            href={"https://www.instagram.com/mrowaisabdullah/"}
            className="text-muted-foreground text-2xl hover:text-[#d62976]"
            target="_blank"
            aria-label="Follow me on Instagram"
          >
            <FaInstagramSquare aria-hidden="true" />
          </Link>
          <Link
            href={"https://github.com/MrOwaisAbdullah"}
            className="text-muted-foreground text-2xl hover:text-foreground"
            target="_blank"
            aria-label="View my repositories on GitHub"
          >
            <FaGithubSquare aria-hidden="true" />
          </Link>
          <Link
            href={"https://www.facebook.com/mrowaisabdullah"}
            className="text-muted-foreground text-2xl hover:text-[#5890FF]"
            target="_blank"
            aria-label="Follow me on Facebook"
          >
            <FaFacebookSquare aria-hidden="true" />
          </Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
