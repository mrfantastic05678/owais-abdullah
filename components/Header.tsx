"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";

import { CgClose, CgMenuRight } from "react-icons/cg";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isoOpen, setisoOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on a blog detail page
  const isBlogDetailPage = pathname?.startsWith("/blog/") && pathname !== "/blog";
  
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
        "p-8",
        "gap-4",
        "flex-col",
        "left-0",
        "top-[70px]",
        "rounded-3xl",
        "bg-card/95", // Theme-aware background with blur
        "backdrop-blur-xl",
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
  
  // Determine text color classes based on page and theme
  // Keep existing logic for desktop (isBlogDetailPage makes text white)
  const textColorClass = isBlogDetailPage ? "text-foreground md:text-card-foreground" : "text-foreground";
  const hoverColorClass = isBlogDetailPage ? "hover:text-card-foreground" : "hover:text-accent";
  
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-lg border border-border bg-card/80 backdrop-blur-md shadow-xl transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-full z-[-1] pointer-events-none rounded-lg overflow-hidden" />

      <div className="mx-auto flex items-center justify-between font-medium py-2 px-4 md:px-6 lg:px-8 z-10 gap-2">
        {/* Natural gradient blob coming from above with larger size */}
        <div className="absolute -top-20 -left-14 w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-2xl opacity-60 dark:opacity-40 -z-10 pointer-events-none"></div>
        <Link href={"/"} className="flex items-center gap-2 z-10 relative shrink-0">
          <Image src="/assets/owais_logo.png" width={60} height={30} alt={"Owais Abdullah logo"} className="relative z-10 md:w-[100px] md:h-[50px]" unoptimized />
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

          {/* hire button — scan-line sweep on hover */}
          <Link
            href={"/contact"}
            onClick={handleLinkClick}
            className="btn-scan-sweep hidden lg:inline-flex items-center text-center font-bold bg-accent hover:bg-accent-hover text-accent-foreground py-2 px-4 focus:outline-none transition-colors duration-300 rounded-md text-sm whitespace-nowrap"
          >
            HIRE ME
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button
            className={`md:hidden flex items-center justify-end text-3xl text-foreground hover:text-accent z-20`}
            onClick={() => {
              setisoOpen(!isoOpen);
            }}
          >
            {/* For mobile on blog detail pages, use theme-aware text colors */}
            {isoOpen ? 
              <CgClose className={isBlogDetailPage ? "text-foreground" : ""} /> : 
              <CgMenuRight className={isBlogDetailPage ? "text-foreground" : ""} />
            }
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;