"use client";

import { useRef, useEffect, useState } from "react";
import Core from "smooothy";
import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/types/blogtypes";
import { urlFor } from "@/sanity/lib/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import CharRevealHeading from "./CharRevealHeading";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

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
  const isDraggingRef = useRef(false);
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

    // Drag vs click: accurately differentiate drag gestures from normal card clicks
    let startX = 0;
    let startY = 0;

    const onPointerDown = (e: PointerEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      isDraggingRef.current = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.buttons > 0) {
        const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
        if (dist > 14) {
          isDraggingRef.current = true;
        }
      }
    };

    const onPointerUp = () => {
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 120);
    };

    const onClickCapture = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    wrapper.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
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
      setOffset: ({ itemWidth }: { itemWidth: number }) => {
        // Allows the last card to scroll completely into clear, front view without right-edge clipping
        return itemWidth + (window.innerWidth < 768 ? 40 : 120);
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
            slide.style.transformOrigin = "left 80%";
            slide.style.transform = `translateX(${instance.current + exit + push}px) rotate(${-15 * ratio}deg) scale(${1 - ratio * 0.4})`;
            slide.style.position = "relative";
            slide.style.zIndex = `${i + 1}`;
          } else {
            slide.style.transformOrigin = "";
            slide.style.transform = `translateX(${instance.current}px)`;
            slide.style.position = "relative";
            slide.style.zIndex = `${i + 1}`;
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
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      wrapper.removeEventListener("click", onClickCapture, true);
      slider.destroy();
      sliderRef.current = null;
    };
  }, [reduced, posts, gap, lerpFactor, speedDecay, momentumMultiplier]);

  const slideBy = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const step = window.innerWidth * 0.32;
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

      <div className="md:w-2/3 w-full h-full overflow-hidden relative py-6 sm:py-16 md:py-20" data-cursor="drag" data-cursor-label="DRAG">
        <div
          ref={wrapperRef}
          className={`flex h-full items-center pl-3 sm:pl-8 md:pl-16 ${reduced ? "overflow-x-auto gap-4 snap-x snap-mandatory" : "will-change-transform"}`}
        >
          {posts.map((post, i) => (
            <div
              key={post.slug.current}
              className="shrink-0 select-none relative"
              style={{
                width: cardWidth,
                height: cardHeight,
                minWidth: cardWidth,
                marginRight: i < posts.length - 1 ? `${gap * 100}vw` : "4vw",
              }}
            >
              <div
                className="w-full h-full rounded-2xl flex flex-col overflow-hidden bg-white dark:bg-[#081B1E] border border-slate-200 dark:border-teal-900/60 shadow-xl shadow-teal-950/10 relative cursor-grab active:cursor-grabbing group"
              >
                <div className="relative w-full h-[48%] bg-slate-100 dark:bg-slate-900 border-b border-slate-200/60 dark:border-teal-900/40 pointer-events-none shrink-0 overflow-hidden">
                  {post.mainImage && (
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between overflow-hidden">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/50 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block">
                      {new Date(post._createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    
                    {/* Clickable Title with pointer cursor */}
                    <h3 className="text-base sm:text-lg md:text-[1.3vw] font-bold leading-snug text-foreground mt-2 line-clamp-2">
                      <Link
                        href={`/blog/${post.slug.current}`}
                        className="cursor-pointer hover:text-teal-700 dark:hover:text-teal-400 transition-colors inline"
                        data-cursor="link"
                        onClick={(e) => {
                          if (isDraggingRef.current) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs md:text-[0.88vw] text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  {/* CTA Button Link with pointer cursor and button text hover animation */}
                  <div className="pt-2">
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-500/50 transition-all group/btn"
                      data-cursor="link"
                      onClick={(e) => {
                        if (isDraggingRef.current) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      <SplitFlapLabel primary="Read Article" secondary="Read Story" />
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows: Vibrant & theme-matched in light and dark */}
        <button
          onClick={() => slideBy("left")}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 dark:bg-[#041417]/95 border border-slate-300 dark:border-teal-500/40 text-slate-800 dark:text-teal-200 shadow-lg hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-slate-950 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => slideBy("right")}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 dark:bg-[#041417]/95 border border-slate-300 dark:border-teal-500/40 text-slate-800 dark:text-teal-200 shadow-lg hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-slate-950 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
