'use client';

/**
 * ScrollStory — React/Next.js + Tailwind port of the vanilla engine in
 * assets/standalone/scroll-story.js. Same algorithm (pin via a tall wrapper
 * + sticky inner, rAF-scheduled scroll reads, canvas frame-sequence drawing
 * or <video> currentTime fallback, prefers-reduced-motion static fallback);
 * ported to hooks/refs instead of a class, and to Tailwind utility classes
 * instead of scroll-story.css. Keep both in sync if you change the algorithm.
 *
 * Canvas drawing is imperative (refs), not state — only scroll progress
 * (used to toggle act overlay visibility) is React state, so re-renders
 * stay cheap and act visibility is derived in render, not in an effect.
 *
 * Usage:
 *   <ScrollStory
 *     mode="frames"
 *     framesBaseUrl="/frames/product-"
 *     frameCount={60}
 *     staticFrameUrl="/frames/product-001.webp"
 *     acts={[
 *       { start: 0, end: 26, heading: 'Still. Perfect. Waiting.', subheading: 'Every detail, exactly as it should be.' },
 *       { start: 30, end: 66, heading: 'Then everything changes.', subheading: 'Scroll to watch it unfold.' },
 *       { start: 72, end: 100, heading: 'Reborn.', subheading: 'Built to do this again and again.' },
 *     ]}
 *   />
 */

import { useEffect, useRef, useState, type CSSProperties } from 'react';

export interface ScrollStoryAct {
  start: number; // scroll progress %, 0-100
  end: number;
  heading?: string;
  subheading?: string;
}

export interface ScrollStoryProps {
  mode?: 'frames' | 'video';
  framesBaseUrl?: string;
  frameCount?: number;
  framePad?: number;
  frameExt?: string;
  videoSrc?: string;
  staticFrameUrl?: string;
  pinDistance?: string; // CSS length, e.g. '300vh'
  acts: ScrollStoryAct[];
  textColor?: string;
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function drawBitmap(canvas: HTMLCanvasElement, bmp: ImageBitmap) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const targetWidth = Math.round(canvas.clientWidth * dpr);
  const targetHeight = Math.round(canvas.clientHeight * dpr);
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  const canvasRatio = canvas.width / canvas.height;
  const bmpRatio = bmp.width / bmp.height;
  let dw: number, dh: number, dx: number, dy: number;
  if (bmpRatio > canvasRatio) {
    dh = canvas.height;
    dw = dh * bmpRatio;
    dx = (canvas.width - dw) / 2;
    dy = 0;
  } else {
    dw = canvas.width;
    dh = dw / bmpRatio;
    dx = 0;
    dy = (canvas.height - dh) / 2;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, dx, dy, dw, dh);
}

export default function ScrollStory({
  mode = 'frames',
  framesBaseUrl = '',
  frameCount = 60,
  framePad = 3,
  frameExt = 'webp',
  videoSrc,
  staticFrameUrl,
  pinDistance = '300vh',
  acts,
  textColor = '#ffffff',
  className = '',
}: ScrollStoryProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const currentFrameRef = useRef(-1);
  const tickingRef = useRef(false);

  const [progressPct, setProgressPct] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      if (canvasRef.current && staticFrameUrl) {
        fetch(staticFrameUrl)
          .then((r) => r.blob())
          .then((blob) => createImageBitmap(blob))
          .then((bmp) => canvasRef.current && drawBitmap(canvasRef.current, bmp))
          .catch(() => {});
      }
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let started = false;

    function loadFrame(n: number): Promise<ImageBitmap | null> {
      const padded = String(n).padStart(framePad, '0');
      const url = `${framesBaseUrl}${padded}.${frameExt}`;
      return fetch(url)
        .then((r) => r.blob())
        .then((blob) => createImageBitmap(blob))
        .catch(() => null);
    }

    function renderFrame(progress: number) {
      if (mode === 'video') {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        video.currentTime = progress * video.duration;
        return;
      }
      const index = clamp(Math.round(progress * (frameCount - 1)), 0, frameCount - 1);
      if (index === currentFrameRef.current) return;
      const bmp = framesRef.current[index];
      const canvas = canvasRef.current;
      if (!bmp || !canvas) return;
      currentFrameRef.current = index;
      drawBitmap(canvas, bmp);
    }

    function raf() {
      tickingRef.current = false;
      const wrapperEl = wrapperRef.current;
      if (!wrapperEl) return;
      const rect = wrapperEl.getBoundingClientRect();
      const scrollableDistance = wrapperEl.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, Math.max(scrollableDistance, 0));
      const progress = scrollableDistance > 0 ? scrolled / scrollableDistance : 0;

      renderFrame(progress);
      setProgressPct(progress * 100);
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(raf);
    }

    async function preloadFrames() {
      const first = await loadFrame(1);
      if (first) framesRef.current[0] = first;
      renderFrame(0);
      for (let i = 2; i <= frameCount; i++) {
        loadFrame(i).then((bmp) => {
          if (bmp) framesRef.current[i - 1] = bmp;
        });
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            if (mode === 'frames') {
              preloadFrames();
            } else {
              videoRef.current?.pause();
            }
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
          }
        });
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [mode, framesBaseUrl, frameCount, framePad, frameExt, reducedMotion, staticFrameUrl]);

  const stickyClass = reducedMotion
    ? 'relative h-[70vh]'
    : 'sticky top-0 h-screen';

  return (
    <section
      className={`relative ${className}`}
      style={{ '--scroll-story-text-color': textColor } as CSSProperties}
    >
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: reducedMotion ? 'auto' : pinDistance }}
      >
        <div className={`${stickyClass} flex items-center justify-center overflow-hidden bg-black`}>
          {mode === 'video' ? (
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
            >
              {videoSrc && <source src={videoSrc} type="video/mp4" />}
            </video>
          ) : (
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />
          )}

          {acts.map((act, i) => {
            const visible = reducedMotion || (progressPct >= act.start && progressPct <= act.end);
            return (
              <div
                key={i}
                className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center transition-all duration-500 ${
                  visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ color: 'var(--scroll-story-text-color)' }}
              >
                {act.heading && (
                  <h2 className="mb-2 text-[clamp(1.75rem,5vw,3.5rem)] font-semibold tracking-tight">
                    {act.heading}
                  </h2>
                )}
                {act.subheading && (
                  <p className="max-w-[40ch] text-[clamp(1rem,2vw,1.25rem)] opacity-85">
                    {act.subheading}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
