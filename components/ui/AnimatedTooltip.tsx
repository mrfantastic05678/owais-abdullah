"use client";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

interface AnimatedTooltipProps {
  tooltipTitle: string;
  tooltipDescription?: string;
  children: React.ReactNode;
}

export const AnimatedTooltip = ({
  tooltipTitle,
  tooltipDescription,
  children,
}: AnimatedTooltipProps) => {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 5 };

  // Only use x to drive the rotation effect.
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );

  const handleMouseMove = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    const halfWidth = target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence mode="popLayout">
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 260, damping: 10 },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              x: "-50%",
              rotate: rotate,
              whiteSpace: "nowrap",
            }}
            className=" absolute -top-16 left-1/2 flex flex-col items-center justify-center rounded-md bg-gray-950 z-50 shadow-xl px-4 py-2 text-xs"
          >
            <div className="font-bold text-white relative z-30 text-base">
              {tooltipTitle}
            </div>
            {tooltipDescription && (
              <div className="text-white text-xs">{tooltipDescription}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};
