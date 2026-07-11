"use client";

import { useRef, useEffect, useState } from "react";
import Core from "smooothy";
import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/types/blogtypes";
import { urlFor } from "@/sanity/lib/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CharRevealHeading from "./CharRevealHeading";

interface OverlappingSliderProps {
  posts: PostCard[];
  className?: string;
  cardWidth?: string;
  cardHeight?: string;
  gap?: number;
  lerpFactor?: number;
  speedDecay?: number;
  momentumMultiplier?: number;
}

export default function OverlappingSlider({
  posts,
  className = "",
  cardWidth = "30vw",
  cardHeight = "40vw",
  gap = 0.02,
  lerpFactor = 0.02,
  speedDecay = 0.97,
  momentumMultiplier = 10,
}: OverlappingSliderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<InstanceType<typeof Core> | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const wrapper = wrapperRef.current;
    if (!wrapper || posts.length === 0) return;

    const slideEls = [...wrapper.children] as HTMLElement[];

    const preventSelect = (e: Event) => e.preventDefault();
    wrapper.addEventListener("selectstart", preventSelect);

    // Drag vs click: if the pointer moved, swallow the click so dragging
    // never navigates to a card's link
    let downX = 0;
    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
    };
    const onClickCapture = (e: MouseEvent) => {
      if (Math.abs(e.clientX - downX) > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    wrapper.addEventListener("pointerdown", onPointerDown);
    wrapper.addEventListener("click", onClickCapture, true);
    wrapper.style.userSelect = "none";
    wrapper.style.webkitUserSelect = "none";
    wrapper.style.touchAction = "pan-y";

    const slider = new Core(wrapper, {
      infinite: false,
      snap: false,
      variableWidth: true,
      lerpFactor,
      speedDecay,
      bounceLimit: 0,
      setOffset: ({ itemWidth, totalWidth }: { itemWidth: number; totalWidth: number }) => {
        const gapPx = window.innerWidth * gap;
        const lastSlideOffset = (posts.length - 1) * (itemWidth + gapPx);
        return totalWidth - lastSlideOffset;
      },
      onUpdate: (instance: { current: number }) => {
        const vwOffset = window.innerWidth * 0.1;

        slideEls.forEach((slide, i) => {
          const slideWidth = slide.offsetWidth;
          const slideLeft = slide.offsetLeft + instance.current;
          const isLast = i === posts.length - 1;
          // The front card keeps a resting hint of the exit tilt so the
          // stack reads as draggable before any interaction
          const minRatio = i === 0 && !isLast ? 0.12 : 0;
          const rawRatio = slideLeft < 0 ? Math.abs(slideLeft) / slideWidth : 0;
          const ratio = Math.min(1, Math.max(minRatio, rawRatio));

          if (ratio > 0 && !isLast) {
            const exit = Math.max(0, -slideLeft);
            // The vw push only applies while actually exiting — the resting
            // tilt is rotation/scale only, so the card stays in its slot
            const push = slideLeft < 0 ? ratio * vwOffset : 0;
            slide.style.cssText = `
              transform-origin: left 80%;
              transform: translateX(${instance.current + exit + push}px) rotate(${-15 * ratio}deg) scale(${1 - ratio * 0.4});
              position: relative;
              z-index: ${i + 1};
            `;
          } else {
            slide.style.cssText = `
              transform: translateX(${instance.current}px);
              z-index: ${i + 1};
            `;
          }
        });
      },
    });

    sliderRef.current = slider;

    let animId: number | null = null;
    let wasDragging = false;
    let momentum = 0;
    const MOMENTUM_DECAY = 0.96;

    function animate() {
      slider.update();

      if (slider.isDragging) {
        wasDragging = true;
        momentum = 0;
      } else if (wasDragging) {
        momentum = slider.speed * momentumMultiplier;
        wasDragging = false;
      }

      if (Math.abs(momentum) > 0.5) {
        slider.target += momentum;
        momentum *= MOMENTUM_DECAY;
        slider.target = Math.max(slider.maxScroll, Math.min(0, slider.target));
      }

      animId = requestAnimationFrame(animate);
    }

    // Only run the rAF loop while the slider is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (animId === null) animate();
      } else if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
    io.observe(wrapper);

    return () => {
      io.disconnect();
      if (animId !== null) cancelAnimationFrame(animId);
      wrapper.removeEventListener("selectstart", preventSelect);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      wrapper.removeEventListener("click", onClickCapture, true);
      slider.destroy();
      sliderRef.current = null;
    };
  }, [reduced, posts, gap, lerpFactor, speedDecay, momentumMultiplier]);

  const slideBy = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const step = window.innerWidth * 0.25;
    slider.target += direction === "left" ? step : -step;
    slider.target = Math.max(slider.maxScroll, Math.min(0, slider.target));
  };

  if (!posts || posts.length === 0) return null;

  return (
    <div className={`w-full min-h-[60vh] flex flex-col md:flex-row items-center gap-[4vw] overflow-hidden relative ${className}`}>
      <div className="md:w-1/3 w-full h-full flex flex-col items-start px-5 md:pl-[4vw] md:pr-8 justify-center z-10 relative">
        <span className="text-accent font-mono text-xs tracking-widest uppercase mb-2 block">From the Blog</span>
        <CharRevealHeading
          as="h2"
          className="text-4xl md:text-[3.6vw] uppercase leading-[.95] font-bold text-foreground break-words max-w-full"
          highlightWords={["Articles"]}
        >
          Latest Articles
        </CharRevealHeading>
        <p className="text-muted-foreground mt-[2vw] text-sm md:text-base">
          Drag to explore recent articles, insights, and updates on AI agents and Next.js development.
        </p>
      </div>

      <div className="md:w-2/3 w-full h-full overflow-hidden relative py-10 md:py-0" data-cursor="drag" data-cursor-label="DRAG">
        <div
          ref={wrapperRef}
          className={`flex h-full items-center pl-10 md:pl-16 ${reduced ? "overflow-x-auto gap-4 snap-x snap-mandatory" : "will-change-transform"}`}
        >
          {posts.map((post, i) => (
            <Link
              href={`/blog/${post.slug.current}`}
              key={post.slug.current}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              data-cursor="link"
            >
              <div
                className="shrink-0 rounded-2xl flex flex-col overflow-hidden bg-card shadow-2xl relative cursor-grab active:cursor-grabbing"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  marginRight: i < posts.length - 1 ? `${gap * 100}vw` : undefined,
                }}
              >
                <div className="relative w-full h-[50%] bg-muted pointer-events-none">
                  {post.mainImage && (
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-[2vw] flex flex-col flex-grow justify-between pointer-events-none">
                  <div>
                    <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded-sm uppercase tracking-wider">
                      {new Date(post._createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <h3 className="text-lg md:text-[1.5vw] font-medium leading-tight text-foreground mt-3 line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-xs md:text-[1vw] text-muted-foreground line-clamp-2">
                    {post.summary}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => slideBy("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-md bg-card/50 backdrop-blur-sm border border-border/30 text-foreground/30 hover:text-foreground/70 hover:bg-card/80 transition-all duration-200 cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => slideBy("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-md bg-card/50 backdrop-blur-sm border border-border/30 text-foreground/30 hover:text-foreground/70 hover:bg-card/80 transition-all duration-200 cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
