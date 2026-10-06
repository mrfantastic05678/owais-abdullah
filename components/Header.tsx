"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bot, 
  Layers, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  ExternalLink,
  Sun,
  Moon,
  Search,
  Zap,
  Rocket,
  ShoppingCart,
  Lightbulb,
  Cpu,
  type LucideIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import { allProjects, profile } from "@/data/profile";
import { services, type Service } from "@/data/services";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

const serviceIcons: Record<string, LucideIcon> = {
  Bot,
  Zap,
  Rocket,
  ShoppingCart,
  Lightbulb,
  Cpu,
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);
  const servicesTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const projectsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    if (projectsTimeoutRef.current) clearTimeout(projectsTimeoutRef.current);
    setProjectsMenuOpen(false);
    setServicesMenuOpen(true);
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesMenuOpen(false);
    }, 280);
  };

  const handleProjectsEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    if (projectsTimeoutRef.current) clearTimeout(projectsTimeoutRef.current);
    setServicesMenuOpen(false);
    setProjectsMenuOpen(true);
  };

  const handleProjectsLeave = () => {
    projectsTimeoutRef.current = setTimeout(() => {
      setProjectsMenuOpen(false);
    }, 280);
  };

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
      if (projectsTimeoutRef.current) clearTimeout(projectsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page route change
  useEffect(() => {
    setIsOpen(false);
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    if (projectsTimeoutRef.current) clearTimeout(projectsTimeoutRef.current);
    setServicesMenuOpen(false);
    setProjectsMenuOpen(false);
  }, [pathname]);

  // Featured projects for mega menu
  const featuredProjects = allProjects.slice(0, 3);
  const servicesList: Service[] = Object.values(services).slice(0, 4);

  return (
    <div 
      className={`fixed left-0 right-0 z-50 pointer-events-none transition-all duration-300 ${
        scrolled 
          ? "top-3 px-3 sm:px-6" 
          : "top-0 px-0"
      }`}
    >
      <header
        className={`pointer-events-auto transition-all duration-300 relative w-full ${
          scrolled
            ? "max-w-6xl mx-auto rounded-xl border border-slate-300/80 dark:border-teal-500/30 bg-white/95 dark:bg-[#031518]/95 backdrop-blur-2xl shadow-xl shadow-black/10 dark:shadow-black/60 py-2 px-3 sm:px-4"
            : "w-full border-b border-slate-200/90 dark:border-teal-900/50 bg-white/95 dark:bg-[#041417]/95 backdrop-blur-md py-3.5 px-4 sm:px-8 shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Brand / Signature Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3.5 group shrink-0 pl-1"
            aria-label="Owais Abdullah - Home"
          >
            <div className="relative flex items-center">
              {/* Soft ambient teal aura behind signature logo */}
              <div className="absolute -inset-2 bg-teal-500/15 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              {/* Dark Logo (Light Theme) */}
              <Image
                src="/assets/Owais_logo_dark.png"
                alt="Owais Abdullah"
                width={100}
                height={42}
                className="relative z-10 h-8 md:h-9 w-auto object-contain dark:hidden block transition-transform group-hover:scale-105"
                priority
                unoptimized
              />
              {/* Light Logo (Dark Theme) */}
              <Image
                src="/assets/owais_logo.png"
                alt="Owais Abdullah"
                width={100}
                height={42}
                className="relative z-10 h-8 md:h-9 w-auto object-contain hidden dark:block transition-transform group-hover:scale-105"
                priority
                unoptimized
              />
            </div>

            {/* Editorial hairline divider + understated status descriptor (no redundant name) */}
            {!scrolled && (
              <div className="hidden sm:flex items-center gap-2.5 pl-1">
                <span className="h-3.5 w-px bg-slate-300/80 dark:bg-teal-900/60" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[11px] font-semibold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                    AI Agent Architect
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-muted-foreground">
            
            <Link 
              href="/about" 
              className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              About
            </Link>

            {/* SERVICES MEGA MENU */}
            <div 
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button 
                type="button"
                className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors inline-flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-400 cursor-pointer whitespace-nowrap"
                onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
                aria-expanded={servicesMenuOpen}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Services</span>
                <span className="hidden xl:inline-block text-[10px] bg-teal-500/15 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                  6 Shipped
                </span>
                <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-200 ${servicesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesMenuOpen && (
                <div 
                  onMouseEnter={handleServicesEnter}
                  onMouseLeave={handleServicesLeave}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[100] w-[680px] before:absolute before:-top-3 before:left-0 before:right-0 before:h-5 before:content-['']"
                >
                  <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-teal-900/60 bg-white dark:bg-[#041417] shadow-2xl shadow-black/40 grid grid-cols-12 gap-5 animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* Left Spotlight: Digital FTE */}
                    <div className="col-span-5 p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 dark:bg-[#071F22] flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          CORE INNOVATION
                        </span>
                        <h4 className="text-sm font-extrabold text-foreground">
                          Digital FTEs (AI Employees)
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Autonomous AI employees running business workflows 24/7 without supervision.
                        </p>
                      </div>
                      <Link 
                        href="/services/digital-fte" 
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline pt-3"
                      >
                        <span>Learn about Digital FTEs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Right Service Grid */}
                    <div className="col-span-7 grid grid-cols-1 gap-2">
                      {servicesList.map((svc) => {
                        const SvcIcon = serviceIcons[svc.icon] || Bot;
                        return (
                          <Link 
                            key={svc.slug}
                            href={`/services/${svc.slug}`}
                            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#071F22]/70 border border-transparent hover:border-teal-500/20 transition-all flex items-start gap-2.5 group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                              <SvcIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 flex items-center justify-between">
                                <span>{svc.title}</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {svc.tagline}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* PROJECTS MEGA MENU */}
            <div 
              onMouseEnter={handleProjectsEnter}
              onMouseLeave={handleProjectsLeave}
            >
              <button 
                type="button"
                className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors inline-flex items-center gap-1.5 font-semibold cursor-pointer whitespace-nowrap"
                onClick={() => setProjectsMenuOpen(!projectsMenuOpen)}
                aria-expanded={projectsMenuOpen}
              >
                <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>Projects</span>
                <span className="hidden xl:inline-block text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                  {allProjects.length}+
                </span>
                <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-200 ${projectsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {projectsMenuOpen && (
                <div 
                  onMouseEnter={handleProjectsEnter}
                  onMouseLeave={handleProjectsLeave}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[100] w-[720px] before:absolute before:-top-3 before:left-0 before:right-0 before:h-5 before:content-['']"
                >
                  <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-teal-900/60 bg-white dark:bg-[#041417] shadow-2xl shadow-black/40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="grid grid-cols-3 gap-3">
                      {featuredProjects.map((p) => (
                        <Link 
                          key={p.title}
                          href={p.link}
                          target="_blank"
                          className="rounded-xl border border-slate-200 dark:border-teal-900/60 hover:border-teal-500/70 transition-all overflow-hidden bg-white dark:bg-[#071F22] shadow-xs group flex flex-col justify-between"
                        >
                          <div className="h-24 overflow-hidden relative bg-slate-100 dark:bg-slate-900 border-b border-slate-200/60 dark:border-teal-900/40">
                            {p.image ? (
                              <Image 
                                src={p.image} 
                                alt={p.title} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-muted-foreground">
                                {p.title}
                              </div>
                            )}
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/95 text-teal-900 border border-teal-300/80 shadow-xs dark:bg-[#031518]/95 dark:text-teal-200 dark:border-teal-700/60 backdrop-blur-xs">
                              {p.category.toUpperCase()}
                            </span>
                          </div>
                          <div className="p-2.5 space-y-0.5">
                            <div className="font-bold text-xs text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 flex items-center justify-between">
                              <span>{p.title}</span>
                              <ExternalLink className="w-3 h-3 opacity-50" />
                            </div>
                            <p className="text-[10px] text-muted-foreground line-clamp-2">
                              {p.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl border border-slate-200/60 dark:border-teal-900/40 bg-slate-50 dark:bg-[#031518]/60 flex items-center justify-between text-xs">
                      <span className="font-mono text-muted-foreground font-semibold text-[11px]">
                        Over {allProjects.length} web apps, AI tools &amp; stores shipped
                      </span>
                      <Link 
                        href="/projects" 
                        className="group font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1.5"
                      >
                        <SplitFlapLabel primary="View All Projects" secondary="Explore 65+ Builds" className="min-w-[8.5rem]" />
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/stack" 
              className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Stack
            </Link>

            <Link 
              href="/journey" 
              className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Journey
            </Link>

            <Link 
              href="/blog" 
              className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors hidden xl:block"
            >
              Blog
            </Link>

            <Link 
              href="/stores" 
              className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors hidden xl:block"
            >
              Stores
            </Link>

          </nav>

          {/* Right Action Button & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 pr-1">
            
            {/* Availability Pill (Desktop) */}
            <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Projects</span>
            </div>

            {/* Search Button */}
            <Link
              href="/search"
              className="w-9 h-9 rounded-xl border border-border bg-card/90 hover:bg-muted flex items-center justify-center text-foreground transition-all cursor-pointer shadow-xs shrink-0"
              aria-label="Search portfolio & articles"
              title="Search (Ctrl + K)"
            >
              <Search className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Link>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-xl border border-border bg-card/90 hover:bg-muted flex items-center justify-center text-foreground transition-all cursor-pointer shadow-xs shrink-0"
              aria-label="Toggle theme"
              title={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-teal-700" />
                )
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

            {/* Book Spec Call CTA Button */}
            <Link
              href="#contact"
              className="group px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:opacity-95 shadow-sm hover:shadow-teal-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <SplitFlapLabel primary="Book Spec Call" secondary="Schedule 30m" className="min-w-[7.2rem]" />
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-9 h-9 rounded-xl border border-border/80 flex items-center justify-center bg-card text-foreground hover:border-teal-500 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-border/70 mt-3 pt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1 text-sm font-semibold text-foreground">
              <Link 
                href="/about" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-muted/50 flex items-center justify-between"
              >
                <span>About</span>
                <span className="text-[10px] font-mono text-muted-foreground">Spec-Driven</span>
              </Link>

              <Link 
                href="/services" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-muted/50 flex items-center justify-between"
              >
                <span>Services &amp; Capabilities</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold">
                  6 Shipped
                </span>
              </Link>

              <Link 
                href="/projects" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-muted/50 flex items-center justify-between"
              >
                <span>Projects &amp; Case Studies</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                  {allProjects.length}+ Repos
                </span>
              </Link>

              <Link 
                href="/stack" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-muted/50 flex items-center justify-between"
              >
                <span>Tech Stack</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold">
                  Full Stack
                </span>
              </Link>

              <Link 
                href="/journey" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-muted/50 flex items-center justify-between"
              >
                <span>Career Journey</span>
                <span className="text-[10px] font-mono text-muted-foreground">2018 — 2026</span>
              </Link>

              <Link 
                href="/blog" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-muted/50 flex items-center justify-between"
              >
                <span>Articles &amp; Deep-Dives</span>
                <span className="text-[10px] font-mono text-muted-foreground">Blog</span>
              </Link>

              <Link 
                href="/stores" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-muted/50 flex items-center justify-between"
              >
                <span>Shipped Stores Directory</span>
                <span className="text-[10px] font-mono text-muted-foreground">Shopify</span>
              </Link>

              <Link 
                href="#contact" 
                onClick={() => setIsOpen(false)}
                className="mt-2 px-3.5 py-2.5 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 font-bold flex items-center justify-between"
              >
                <span>Book an Architecture Spec Call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </nav>

            <div className="pt-2 border-t border-border/70 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
              </span>
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="px-2.5 py-1 rounded-lg border border-border bg-card text-foreground flex items-center gap-1.5 cursor-pointer text-xs font-sans font-medium"
              >
                {resolvedTheme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-teal-700" />}
                <span>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </div>
        )}

      </header>
    </div>
  );
}
