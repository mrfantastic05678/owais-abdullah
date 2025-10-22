"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HoverBorderGradient } from "./HoverBorderGradient";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-[95%] xss:max-w-fit fixed top-7 mx-auto border border-border rounded-full bg-popover shadow-lg z-[4000] pr-2 pl-8 py-2 items-center justify-center inset-x-0 space-x-4 xs:space-x-8 xss:space-x-10 md:space-x-14",
          className
        )}
      >
        {navItems.map(
          (
            navItem: {
              name: string;
              link: string;
              icon?: JSX.Element;
            },
            idx: number
          ) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative text-foreground items-center flex space-x-1 hover:text-accent"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </Link>
          )
        )}
        <Link href="/contact">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="bg-card text-foreground hover:text-accent flex items-center space-x-2"
          >
            <span>Hire Me</span>
          </HoverBorderGradient>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};
