"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  ArrowUp, 
  Copy, 
  Check, 
  Mail, 
  Phone
} from "lucide-react";
import { 
  FaLinkedin, 
  FaGithub, 
  FaWhatsapp, 
  FaInstagram, 
  FaFacebook 
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { profile } from "@/data/profile";
import { services } from "@/data/services";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.contact.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const servicesList = Object.values(services);

  return (
    <footer className="relative overflow-hidden mt-24 border-t border-teal-900/60 bg-gradient-to-b from-[#03181C] via-[#021114] to-[#010A0C] text-slate-400">
      
      {/* Top Accent Brand Teal Gradient Separator */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-teal-400 to-transparent" />

      {/* Micro-Dot Matrix Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(13, 148, 136, 0.45) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Ambient Glow Orbs */}
      <div 
        className="absolute -top-32 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0D9488 0%, transparent 70%)" }}
      />
      <div 
        className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #059669 0%, transparent 70%)" }}
      />

      {/* Top CTA Banner */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-12 relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl border border-teal-500/30 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-teal-700/85 via-teal-800/90 to-teal-950/95 backdrop-blur-xl">
          
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>AVAILABLE FOR PRODUCTION BUILDS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to build something autonomous?
            </h3>
            <p className="text-teal-100/90 text-sm max-w-xl leading-relaxed">
              From spec to production — Digital FTEs, multi-agent workflows, and high-performance Next.js SaaS platforms.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            <Link 
              href="#contact" 
              className="group px-6 py-3.5 rounded-xl text-sm font-bold text-teal-950 bg-white hover:bg-teal-50 shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <SplitFlapLabel primary="Start a Project" secondary="Let's Build It" />
              <ArrowRight className="w-4 h-4 text-teal-700 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link 
              href="https://wa.me/923363385472" 
              target="_blank" 
              className="group px-5 py-3.5 rounded-xl text-sm font-semibold text-white border border-white/30 hover:border-white/60 hover:bg-white/10 backdrop-blur-xs transition-all flex items-center gap-2"
            >
              <FaWhatsapp className="w-4 h-4" />
              <SplitFlapLabel primary="WhatsApp" secondary="Direct Chat" />
            </Link>
          </div>

        </div>
      </div>

      {/* Main Navigation Grid */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-14 pb-12 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 sm:gap-12 pb-12 border-b border-teal-950/80">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex relative items-center group">
              <div className="absolute -inset-2 bg-teal-500/20 rounded-2xl blur-lg pointer-events-none group-hover:bg-teal-500/30 transition-all" />
              <Image
                src="/assets/owais_logo.png"
                alt="Owais Abdullah"
                width={90}
                height={40}
                className="relative z-10 h-10 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                unoptimized
              />
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">
                  {profile.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-900/60 text-teal-300 border border-teal-700/60">
                  AI AGENT ARCHITECT
                </span>
              </div>
              <p className="text-xs text-teal-400/80 font-mono mt-0.5">
                Spec-Driven Development · Next.js &amp; Digital FTEs
              </p>
            </div>

            <p className="text-xs leading-relaxed text-slate-300 max-w-[34ch]">
              Digital FTEs, multi-agent orchestration, and production SaaS platforms — architected spec-first, then deployed globally.
            </p>

            {/* Copyable Email Card */}
            <button 
              onClick={handleCopyEmail}
              className="w-full sm:w-auto p-2.5 rounded-xl bg-teal-950/50 border border-teal-800/60 hover:border-teal-400 shadow-sm transition-all flex items-center justify-between gap-3 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-mono font-medium text-slate-200">
                  {profile.contact.email}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-900/80 px-2 py-0.5 rounded border border-teal-700/60 group-hover:bg-teal-800 transition-colors flex items-center gap-1">
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </span>
            </button>

            {/* Social Matrix */}
            <div className="flex items-center gap-2 pt-1">
              <Link 
                href={profile.linkedInUrl} 
                target="_blank" 
                className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-slate-300 hover:text-teal-300 hover:border-teal-400 shadow-sm transition-all" 
                title="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
              </Link>
              <Link 
                href={profile.githubUrl} 
                target="_blank" 
                className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-slate-300 hover:text-teal-300 hover:border-teal-400 shadow-sm transition-all" 
                title="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </Link>
              <Link 
                href="https://twitter.com/MrOwaisAbdullah" 
                target="_blank" 
                className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-slate-300 hover:text-teal-300 hover:border-teal-400 shadow-sm transition-all" 
                title="X / Twitter"
              >
                <FaSquareXTwitter className="w-4 h-4" />
              </Link>
              <Link 
                href="https://wa.me/923363385472" 
                target="_blank" 
                className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-slate-300 hover:text-teal-300 hover:border-teal-400 shadow-sm transition-all" 
                title="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </Link>
              <Link 
                href="https://instagram.com/mrowaisabdullah" 
                target="_blank" 
                className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-slate-300 hover:text-teal-300 hover:border-teal-400 shadow-sm transition-all" 
                title="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </Link>
              <Link 
                href="https://facebook.com/mrowaisabdullah" 
                target="_blank" 
                className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-slate-300 hover:text-teal-300 hover:border-teal-400 shadow-sm transition-all" 
                title="Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Explore */}
          <nav className="space-y-3.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.15em] uppercase text-teal-400 block">
              Explore
            </span>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link href="/#about" className="hover:text-teal-300 transition-colors">Engineering Philosophy</Link></li>
              <li><Link href="/services" className="hover:text-teal-300 transition-colors">Autonomous Services</Link></li>
              <li><Link href="/projects" className="hover:text-teal-300 transition-colors">Featured Builds</Link></li>
              <li><Link href="/stack" className="hover:text-teal-300 transition-colors">Full Tech Stack</Link></li>
              <li><Link href="/#experience" className="hover:text-teal-300 transition-colors">Career Timeline</Link></li>
              <li><Link href="/blog" className="hover:text-teal-300 transition-colors">Articles</Link></li>
              <li><Link href="/#faq" className="hover:text-teal-300 transition-colors">Engagement FAQ</Link></li>
            </ul>
          </nav>

          {/* Column 3: Capabilities */}
          <nav className="space-y-3.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.15em] uppercase text-teal-400 block">
              Capabilities
            </span>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {servicesList.map((svc) => (
                <li key={svc.slug}>
                  <Link 
                    href={`/services/${svc.slug}`} 
                    className="hover:text-teal-300 transition-colors flex items-center justify-between group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">{svc.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Directory & API */}
          <nav className="space-y-3.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.15em] uppercase text-teal-400 block">
              Directory &amp; API
            </span>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link href="/stores" className="hover:text-teal-300 transition-colors">Browse Shipped Stores</Link></li>
              <li><Link href="/stores/submit" className="hover:text-teal-300 transition-colors">Submit Store for Audit</Link></li>
              <li><Link href="/stores/claim" className="hover:text-teal-300 transition-colors">Claim Listing</Link></li>
              <li>
                <Link 
                  href="/api/profile" 
                  target="_blank" 
                  className="hover:text-teal-300 transition-colors font-mono flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">/api/profile</span>
                  <span className="text-[9px] bg-teal-900/60 text-teal-300 px-1.5 py-0.2 rounded font-bold border border-teal-700/60">
                    JSON 200
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#contact" 
                  className="group hover:text-teal-300 transition-colors flex items-center gap-1 text-teal-400 font-semibold mt-2"
                >
                  <SplitFlapLabel primary="Request Project Spec" secondary="Start Architecture" />
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
            </ul>
          </nav>

        </div>

        {/* Bottom Telemetry Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 {profile.name} ·{" "}
            <Link 
              href={profile.linkedInUrl} 
              target="_blank" 
              className="text-teal-400 hover:text-teal-300 font-semibold transition-colors"
            >
              @MrOwaisAbdullah
            </Link>
            . All rights reserved.
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Shipping worldwide</span>
          </div>

          <button 
            onClick={scrollToTop} 
            className="group px-3 py-1.5 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 border border-teal-800/60 text-slate-300 hover:text-teal-300 transition-all font-mono text-[11px] flex items-center gap-1.5 cursor-pointer"
          >
            <SplitFlapLabel primary="Back to top" secondary="Scroll Up" />
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>

    </footer>
  );
}
