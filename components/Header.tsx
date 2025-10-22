"use client";

import Image from "next/image";
import React, { useState } from "react";
import Logo from "../public/assets/owais_logo.png";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { CgClose, CgMenuRight } from "react-icons/cg";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isoOpen, setisoOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on a blog detail page
  const isBlogDetailPage = pathname?.startsWith("/blog/") && pathname !== "/blog";
  
  console.log("isoOpen state:", isoOpen);

  function handleLinkClick() {
    setisoOpen(false);
    console.log("Link clicked, isoOpen set to false");
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
        "gap-10",
        "flex-col",
        "left-0",
        "top-[60px]",
        "bg-card", // Theme-aware background
        "z-50",
      ];
    } else {
      menuClasses = [
        "hidden",
        "md:flex",
        "md:ml-auto",
        "flex-wrap",
        "items-center",
        "justify-center",
        "gap-4",
      ];
    }
    return menuClasses.join(" ");
  }
  
  // Determine text color classes based on page and theme
  // Keep existing logic for desktop (isBlogDetailPage makes text white)
  const textColorClass = isBlogDetailPage ? "text-foreground md:text-white" : "text-foreground";
  const hoverColorClass = isBlogDetailPage ? "hover:text-white" : "hover:text-accent";
  
  return (
    <header className="max-w-[1400px] mx-auto relative z-50 bg-transparent">
      <div className="absolute top-0 left-0 w-full h-full z-[-1] pointer-events-none" />

      <div className="mx-auto flex flex-wrap justify-between font-medium p-5 flex-row z-10">
        {/* Natural gradient blob coming from above with larger size */}
        <div className="absolute -top-20 -left-14 w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-accent to-black/60 rounded-full blur-2xl opacity-80 md:opacity-50 dark:opacity-30 -z-10"></div>
        <Link href={"/"} className="flex mb-4 md:mb-0 z-10 relative">
          <Image src={Logo} width={80} height={40} alt={"logo"} className="relative z-10" />
        </Link>

        <nav className={getMenuClassNames()}>
          <Link
            href={"/"}
            onClick={handleLinkClick}
            className={`mr-5 ${textColorClass} text-base ${hoverColorClass}`}
          >
            HOME
          </Link>
          <Link
            href={"/about"}
            onClick={handleLinkClick}
            className={`mr-5 ${textColorClass} text-base ${hoverColorClass}`}
          >
            ABOUT
          </Link>
          <Link
            href={"/projects"}
            onClick={handleLinkClick}
            className={`mr-5 ${textColorClass} text-base ${hoverColorClass}`}
          >
            PROJECTS
          </Link>
          <Link
            href={"/blog"}
            onClick={handleLinkClick}
            className={`mr-5 ${textColorClass} text-base ${hoverColorClass}`}
          >
            BLOG
          </Link>
          <Link
            href={"/skills"}
            onClick={handleLinkClick}
            className={`mr-5 ${textColorClass} text-base ${hoverColorClass}`}
          >
            SKILLS
          </Link>
          <Link
            href={"/contact"}
            onClick={handleLinkClick}
            className={`mr-5 ${textColorClass} text-base ${hoverColorClass}`}
          >
            CONTACT
          </Link>

          {/* hire button */}
            <button className="group inline-flex items-center text-center font-bold bg-gradient-to-br from-blue-900 via-accent to-blue-700 hover:from-blue-950 hover:bg-blue-500 hover:bg-gradient-to-tr text-white border-0 py-4 lg:py-2 px-6 focus:outline-none duration-500 rounded-full text-base mt-4 md:mt-0">
              <Link href={"/contact"} onClick={handleLinkClick}>
                HIRE ME
              </Link>
              <FaArrowRight className="pl-3 text-2xl" />
            </button>
        </nav>
        <div className="flex items-center gap-4">
          <div>
            <ThemeToggle />
          </div>
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