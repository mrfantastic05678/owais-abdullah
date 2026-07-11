"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DEFAULT_PX_STEPS = [2, 5, 6, 8, 100];

type PixelImageProps = {
  children: React.ReactNode;
  pxSteps?: number[];
  triggerStart?: string;
  speed?: number;
  initialDelay?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function PixelImage({
  children,
  pxSteps = DEFAULT_PX_STEPS,
  triggerStart = "top+=20% bottom",
  speed = 80,
  initialDelay = 300,
  className = "",
  style = {},
}: PixelImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        // Static fallback: show the child image directly
        const container = containerRef.current;
        if (!container) return;
        gsap.set(container, { opacity: 1 });
        const hiddenImg = container.querySelector<HTMLImageElement>("img[data-pixel-src]");
        if (hiddenImg) {
          hiddenImg.style.position = "";
          hiddenImg.style.opacity = "1";
          hiddenImg.style.pointerEvents = "";
        }
        return;
      }

      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const hiddenImg = container.querySelector<HTMLImageElement>("img[data-pixel-src]");
      if (!hiddenImg) return;

      const state = { pxIndex: 0, imgRatio: 1 };
      const timeouts: ReturnType<typeof setTimeout>[] = [];

      const img = new Image();
      img.crossOrigin = "anonymous";
      // data-pixel-src carries the raw src prop (set below), so no URL parsing needed
      img.src = hiddenImg.getAttribute("data-pixel-src") || hiddenImg.src;

      function render() {
        if (!container || !canvas || !ctx) return;
        const cw = container.offsetWidth;
        const ch = container.offsetHeight;
        if (cw === 0 || ch === 0) return;
        canvas.width = cw;
        canvas.height = ch;

        const w = cw * 1.05;
        const h = ch * 1.05;
        let newWidth = w;
        let newHeight = h;
        let newX = 0;
        const newY = 0;

        if (w / h > state.imgRatio) {
          newHeight = Math.round(w / state.imgRatio);
        } else {
          newWidth = Math.round(h * state.imgRatio);
          newX = (w - newWidth) / 2;
        }

        const size = pxSteps[state.pxIndex] * 0.01;
        ctx.imageSmoothingEnabled = size === 1;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, w * size, h * size);
        ctx.drawImage(canvas, 0, 0, w * size, h * size, newX, newY, newWidth, newHeight);
      }

      function animatePixels() {
        if (state.pxIndex < pxSteps.length) {
          const id = setTimeout(() => {
            render();
            state.pxIndex++;
            animatePixels();
          }, state.pxIndex === 0 ? initialDelay : speed);
          timeouts.push(id);
        }
      }

      function resetPixels() {
        timeouts.forEach(clearTimeout);
        timeouts.length = 0;
        state.pxIndex = 0;
        render();
      }

      let trigger: ScrollTrigger | undefined;
      const onResize = () => render();

      img.onload = () => {
        state.imgRatio = img.width / img.height;
        render();
        window.addEventListener("resize", onResize);

        // Replays: pixelates back on leave, re-reveals on re-enter
        trigger = ScrollTrigger.create({
          trigger: container,
          start: triggerStart,
          onEnter: animatePixels,
          onLeave: resetPixels,
          onEnterBack: animatePixels,
          onLeaveBack: resetPixels,
        });

        gsap.set(container, { opacity: 1 });
      };

      return () => {
        timeouts.forEach(clearTimeout);
        window.removeEventListener("resize", onResize);
        trigger?.kill();
      };
    },
    { scope: containerRef, dependencies: [reduced, pxSteps, triggerStart, speed, initialDelay] }
  );

  const wrappedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return null;
    type ImageChildProps = { src?: string; style?: React.CSSProperties; [key: string]: unknown };
    const el = child as React.ReactElement<ImageChildProps>;
    if (el.props.src) {
      return cloneElement(el, {
        "data-pixel-src": el.props.src,
        style: {
          ...el.props.style,
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        },
      } as Partial<ImageChildProps>);
    }
    return child;
  });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden opacity-0 ${className}`}
      style={style}
    >
      {wrappedChildren}
      {!reduced && (
        <canvas ref={canvasRef} className="absolute inset-0 size-full pointer-events-none" />
      )}
    </div>
  );
}
