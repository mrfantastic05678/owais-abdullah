"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { CgClose, CgMenuRight } from "react-icons/cg";
import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const Header = () => {
  const [isoOpen, setisoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we're on blog, stack, or stores pages
  const isThemeToggleAllowed =
    pathname === "/blog" ||
    pathname?.startsWith("/blog/") ||
    pathname === "/stack" ||
    pathname?.startsWith("/stack/") ||
    pathname === "/stores" ||
    pathname?.startsWith("/stores/");

  function handleLinkClick() {
    setisoOpen(false);
  }

  const textColorClass = "text-foreground";
  const hoverColorClass = "hover:text-accent";

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? "top-3 w-[92%] max-w-5xl rounded-xl border border-border bg-white/85 dark:bg-[#11151C]/85 backdrop-blur-md shadow-2xl py-1.5 px-2 sm:px-3"
          : "top-0 w-full max-w-7xl border-b border-transparent bg-transparent py-4 px-4 sm:px-6 md:px-8"
      }`}
    >
      <div className="mx-auto flex items-center justify-between font-medium z-10 gap-2">
        {/* Left: Logo */}
        <Link href={"/"} className="flex items-center gap-2 z-10 relative shrink-0">
          {/* Blue gradient blob behind logo */}
          <div className="absolute -inset-4 bg-gradient-to-br from-[#3D7BFF]/30 via-[#6B9AFF]/20 to-[#3D7BFF]/10 rounded-full blur-lg pointer-events-none" />
          {/* Dark logo for Light Theme */}
          <Image
            src="/assets/Owais_logo_dark.png"
            width={52}
            height={26}
            alt="Owais Abdullah logo"
            className="relative z-10 w-[52px] h-[26px] md:w-[78px] md:h-[39px] dark:hidden block"
            unoptimized
          />
          {/* Light logo for Dark Theme */}
          <Image
            src="/assets/owais_logo.png"
            width={52}
            height={26}
            alt="Owais Abdullah logo"
            className="relative z-10 w-[52px] h-[26px] md:w-[78px] md:h-[39px] hidden dark:block"
            unoptimized
          />
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-0.5 lg:gap-1.5 flex-1 mx-2">
          <Link
            href={"/"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-xs lg:text-sm ${hoverColorClass} hover:bg-accent/10 px-2.5 py-1.5 rounded-md transition-colors font-semibold`}
          >
            HOME
          </Link>
          <Link
            href={"/about"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-xs lg:text-sm ${hoverColorClass} hover:bg-accent/10 px-2.5 py-1.5 rounded-md transition-colors font-semibold`}
          >
            ABOUT
          </Link>
          <Link
            href={"/services"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-xs lg:text-sm ${hoverColorClass} hover:bg-accent/10 px-2.5 py-1.5 rounded-md transition-colors font-semibold`}
          >
            SERVICES
          </Link>
          <Link
            href={"/projects"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-xs lg:text-sm ${hoverColorClass} hover:bg-accent/10 px-2.5 py-1.5 rounded-md transition-colors font-semibold`}
          >
            PROJECTS
          </Link>
          <Link
            href={"/stack"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm lg:text-sm ${hoverColorClass} hover:bg-accent/10 px-2.5 py-1.5 rounded-md transition-colors font-semibold`}
          >
            STACK
          </Link>
          <Link
            href={"/blog"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-xs lg:text-sm ${hoverColorClass} hover:bg-accent/10 px-2.5 py-1.5 rounded-md transition-colors font-semibold`}
          >
            BLOG
          </Link>
          <Link
            href={"/stores"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-xs lg:text-sm ${hoverColorClass} hover:bg-accent/10 px-2.5 py-1.5 rounded-md transition-colors font-semibold`}
          >
            STORES
          </Link>
        </nav>

        {/* Right: Actions (Theme Toggle, Hire Me, Mobile Menu) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Blog, Stack & Store theme toggle */}
          {isThemeToggleAllowed && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative text-foreground hover:text-accent hover:bg-accent/10 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="hidden lg:inline">
                {mounted ? (theme === "dark" ? "Light" : "Dark") : "Theme"}
              </span>
            </button>
          )}

          {/* Hire Button — on the far right */}
          <Link
            href={"/contact"}
            onClick={handleLinkClick}
            className="btn-scan-sweep hidden sm:inline-flex items-center text-center font-bold bg-accent hover:bg-accent-hover text-accent-foreground py-1.5 px-3.5 focus:outline-none transition-colors duration-300 rounded-md text-xs whitespace-nowrap shadow-xs"
          >
            HIRE ME
          </Link>

          {/* Mobile Hamburger toggle */}
          <button
            className="md:hidden flex items-center justify-center text-2xl text-foreground hover:text-accent p-1.5 rounded-md"
            onClick={() => setisoOpen(!isoOpen)}
            aria-label="Toggle mobile navigation menu"
          >
            {isoOpen ? <CgClose /> : <CgMenuRight />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isoOpen && (
        <div className="md:hidden absolute top-[calc(100%+8px)] left-0 w-full rounded-xl bg-white dark:bg-[#11151C] border border-border shadow-2xl p-5 flex flex-col gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href={"/"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors font-semibold`}
          >
            HOME
          </Link>
          <Link
            href={"/about"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors font-semibold`}
          >
            ABOUT
          </Link>
          <Link
            href={"/services"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors font-semibold`}
          >
            SERVICES
          </Link>
          <Link
            href={"/projects"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors font-semibold`}
          >
            PROJECTS
          </Link>
          <Link
            href={"/stack"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors font-semibold`}
          >
            STACK
          </Link>
          <Link
            href={"/blog"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors font-semibold`}
          >
            BLOG
          </Link>
          <Link
            href={"/stores"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors font-semibold`}
          >
            STORES
          </Link>
          <div className="pt-2 border-t border-border mt-1">
            <Link
              href={"/contact"}
              onClick={handleLinkClick}
              className="btn-scan-sweep w-full flex items-center justify-center text-center font-bold bg-accent hover:bg-accent-hover text-accent-foreground py-2.5 px-4 focus:outline-none transition-colors duration-300 rounded-md text-sm whitespace-nowrap shadow-xs"
            >
              HIRE ME
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
