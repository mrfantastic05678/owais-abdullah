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
          "flex max-w-[95%] xss:max-w-fit fixed top-7 mx-auto border border-white/[0.2] rounded-full bg-gradient-to-br to-[#1c1f22] from-[#16161f] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center inset-x-0 space-x-4 xs:space-x-8 xss:space-x-10 md:space-x-14",
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
                "relative text-neutral-50 items-center flex space-x-1 hover:text-accent"
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
            className="bg-background text-white hover:text-accent flex items-center space-x-2"
          >
            <span>Hire Me</span>
          </HoverBorderGradient>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};
