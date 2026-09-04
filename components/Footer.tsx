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
import GooglePreferredSourceButton from "./GooglePreferredSourceButton";

const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Tech Stack", href: "/stack" },
  { label: "Skills", href: "/skills" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const DIRECTORY = [
  { label: "Browse Stores", href: "/stores" },
  { label: "Submit a Store", href: "/stores/submit" },
  { label: "Claim Store Listing", href: "/stores/claim" },
];

const SERVICES = [
  { label: "Digital FTEs (AI Employees)", href: "/services/digital-fte" },
  { label: "AI Agent Systems", href: "/services/ai-agents" },
  { label: "SaaS Development", href: "/services/saas-development" },
  { label: "Workflow Automation", href: "/services" },
  { label: "AI Chatbots", href: "/services" },
];

const SOCIALS = [
  { Icon: FaSquareXTwitter, href: "https://www.twitter.com/MrOwaisAbdullah", label: "Follow me on X (Twitter)" },
  { Icon: FaLinkedin, href: "https://www.linkedin.com/in/mrowaisabdullah/", label: "Connect with me on LinkedIn" },
  { Icon: FaGithubSquare, href: "https://github.com/MrOwaisAbdullah", label: "View my repositories on GitHub" },
  { Icon: FaInstagramSquare, href: "https://www.instagram.com/mrowaisabdullah/", label: "Follow me on Instagram" },
  { Icon: FaFacebookSquare, href: "https://www.facebook.com/mrowaisabdullah", label: "Follow me on Facebook" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-slate-100/80 dark:bg-background text-muted-foreground relative overflow-hidden">
      {/* token-derived corner glow */}
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 dark:opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 70%)" }}
      ></div>

      <div className="max-w-7xl mx-auto px-5 pt-14 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Owais Abdullah home" className="inline-flex relative">
              <div className="absolute -inset-5 bg-gradient-to-br from-[#3D7BFF]/30 via-[#6B9AFF]/20 to-[#3D7BFF]/10 rounded-full blur-lg pointer-events-none" />
              {/* Dark logo for Light Theme */}
              <Image
                src="/assets/Owais_logo_dark.png"
                width={80}
                height={40}
                alt="Owais Abdullah logo"
                className="relative z-10 dark:hidden block"
                unoptimized
              />
              {/* Light logo for Dark Theme */}
              <Image
                src="/assets/owais_logo.png"
                width={80}
                height={40}
                alt="Owais Abdullah logo"
                className="relative z-10 hidden dark:block"
                unoptimized
              />
            </Link>
            <p className="mt-4 text-sm max-w-[36ch] leading-relaxed">
              Digital FTEs, AI agents, and SaaS products — spec first, then shipped. Karachi, working worldwide.
            </p>
            <a
              href="mailto:mrowaisabdullah@gmail.com"
              className="inline-block mt-4 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              mrowaisabdullah@gmail.com
            </a>
            <div className="flex gap-3 mt-5">
              {SOCIALS.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  aria-label={label}
                  className="text-xl text-muted-foreground hover:text-accent transition-colors"
                >
                  <Icon aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <GooglePreferredSourceButton variant="pill" placement="footer" />
            </div>
          </div>

          {/* Explore / Main Navigation */}
          <nav aria-label="Explore navigation">
            <span className="font-mono text-[0.65rem] tracking-widest uppercase text-foreground block mb-4">Explore</span>
            <ul className="space-y-2.5">
              {EXPLORE.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} prefetch={false} className="text-sm hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Store Directory */}
          <nav aria-label="Store Directory">
            <span className="font-mono text-[0.65rem] tracking-widest uppercase text-foreground block mb-4">Directory</span>
            <ul className="space-y-2.5">
              {DIRECTORY.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} prefetch={false} className="text-sm hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <span className="font-mono text-[0.65rem] tracking-widest uppercase text-foreground block mb-4">Services</span>
            <ul className="space-y-2.5">
              {SERVICES.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} prefetch={false} className="text-sm hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span>
            © {new Date().getFullYear()} Owais Abdullah —{" "}
            <Link href="https://www.linkedin.com/in/mrowaisabdullah/" className="hover:text-accent" target="_blank">
              @MrOwaisAbdullah
            </Link>
          </span>
          <span className="font-mono tracking-wide text-muted-foreground/70">
            Karachi, Pakistan — working worldwide
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
