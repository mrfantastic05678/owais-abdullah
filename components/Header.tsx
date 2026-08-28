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

  useEffect(() => {
    setMounted(true);
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

  function getMenuClassNames() {
    let menuClasses = [];

    if (isoOpen) {
      menuClasses = [
        "flex",
        "absolute",
        "w-full",
        "mt-2",
        "p-6",
        "gap-2",
        "flex-col",
        "left-0",
        "top-[70px]",
        "rounded-xl",
        "bg-card",
        "border",
        "border-border",
        "shadow-2xl",
        "z-50",
      ];
    } else {
      menuClasses = [
        "hidden",
        "md:flex",
        "md:ml-auto",
        "items-center",
        "justify-center",
        "gap-2",
        "flex-nowrap",
      ];
    }
    return menuClasses.join(" ");
  }

  const textColorClass = "text-foreground";
  const hoverColorClass = "hover:text-accent";

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-lg border border-border bg-card/80 backdrop-blur-md shadow-xl transition-all duration-300">
      <div className="mx-auto flex items-center justify-between font-medium py-2 px-4 md:px-6 lg:px-8 z-10 gap-2">
        <Link href={"/"} className="flex items-center gap-2 z-10 relative shrink-0">
          {/* Blue gradient blob behind logo */}
          <div className="absolute -inset-4 bg-gradient-to-br from-[#3D7BFF]/30 via-[#6B9AFF]/20 to-[#3D7BFF]/10 rounded-full blur-lg pointer-events-none" />
          {/* Dark logo for Light Theme */}
          <Image
            src="/assets/Owais_logo_dark.png"
            width={60}
            height={30}
            alt="Owais Abdullah logo"
            className="relative z-10 md:w-[100px] md:h-[50px] dark:hidden block"
            unoptimized
          />
          {/* Light logo for Dark Theme */}
          <Image
            src="/assets/owais_logo.png"
            width={60}
            height={30}
            alt="Owais Abdullah logo"
            className="relative z-10 md:w-[100px] md:h-[50px] hidden dark:block"
            unoptimized
          />
        </Link>

        <nav className={getMenuClassNames()}>
          <Link
            href={"/"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm md:text-base ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors`}
          >
            HOME
          </Link>
          <Link
            href={"/about"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm md:text-base ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors`}
          >
            ABOUT
          </Link>
          <Link
            href={"/projects"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm md:text-base ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors`}
          >
            PROJECTS
          </Link>
          <Link
            href={"/stack"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm md:text-base ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors`}
          >
            STACK
          </Link>
          <Link
            href={"/blog"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm md:text-base ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors`}
          >
            BLOG
          </Link>
          <Link
            href={"/skills"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm md:text-base ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors`}
          >
            SKILLS
          </Link>
          <Link
            href={"/services"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm md:text-base ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors`}
          >
            SERVICES
          </Link>
          <Link
            href={"/stores"}
            onClick={handleLinkClick}
            className={`${textColorClass} text-sm md:text-base ${hoverColorClass} hover:bg-accent/10 px-3 py-2 rounded-md transition-colors`}
          >
            STORES
          </Link>

          {/* Blog, Stack & Store theme toggle */}
          {isThemeToggleAllowed && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative text-foreground hover:text-accent hover:bg-accent/10 px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 text-sm"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="hidden md:inline">
                {mounted ? (theme === "dark" ? "Light" : "Dark") : "Theme"}
              </span>
            </button>
          )}

          {/* hire button — scan-line sweep on hover */}
          <Link
            href={"/contact"}
            onClick={handleLinkClick}
            className="btn-scan-sweep hidden lg:inline-flex items-center text-center font-bold bg-accent hover:bg-accent-hover text-accent-foreground py-2 px-4 focus:outline-none transition-colors duration-300 rounded-md text-sm whitespace-nowrap"
          >
            HIRE ME
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {/* Mobile theme toggle */}
          {isThemeToggleAllowed && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative md:hidden text-foreground hover:text-accent p-2 rounded-md transition-colors flex items-center justify-center w-9 h-9"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute inset-0 m-auto h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
          )}
          <button
            className="md:hidden flex items-center justify-end text-3xl text-foreground hover:text-accent z-20 p-2"
            onClick={() => {
              setisoOpen(!isoOpen);
            }}
          >
            {isoOpen ? <CgClose /> : <CgMenuRight />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
