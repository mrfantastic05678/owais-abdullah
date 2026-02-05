/**
 * Image Reveal Showcase
 *
 * Multiple image reveal techniques for visual storytelling.
 * Demonstrates: curtain reveal, circle expand, slice reveal, pixel fade
 */

"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Curtain Reveal - Image reveals from center like curtains
 */
export function CurtainReveal() {
  const container = useRef<HTMLDivElement>(null);
  const leftCurtain = useRef<HTMLDivElement>(null);
  const rightCurtain = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!leftCurtain.current || !rightCurtain.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
      }
    });

    tl.to(leftCurtain.current, {
      xPercent: -100,
      ease: 'power2.inOut'
    })
    .to(rightCurtain.current, {
      xPercent: 100,
      ease: 'power2.inOut'
    }, '<');

  }, { scope: container });

  return (
    <section ref={container} className="relative h-screen flex items-center justify-center bg-slate-900">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Image */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-6xl">🎭</span>
          </div>
        </div>

        {/* Curtains */}
        <div
          ref={leftCurtain}
          className="absolute inset-0 w-1/2 left-0 bg-gradient-to-r from-slate-900 to-slate-800 rounded-l-2xl z-10"
        />
        <div
          ref={rightCurtain}
          className="absolute inset-0 w-1/2 right-0 bg-gradient-to-l from-slate-900 to-slate-800 rounded-r-2xl z-10"
        />
      </div>

      <p className="absolute bottom-20 text-white/60">Scroll to reveal</p>
    </section>
  );
}

/**
 * Circle Reveal - Image reveals through expanding circle
 */
export function CircleReveal() {
  const container = useRef<HTMLDivElement>(null);
  const circle = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!circle.current || !container.current) return;

    gsap.from(circle.current, {
      scale: 0,
      transformOrigin: 'center center',
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 70%',
        end: 'center center',
        scrub: 1,
      }
    });

  }, { scope: container });

  return (
    <section ref={container} className="relative h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Hidden content that gets revealed */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center">
        <h2 className="text-6xl md:text-8xl font-bold text-white">Revealed!</h2>
      </div>

      {/* Expanding circle mask - starts as overlay, reveals content */}
      <div
        ref={circle}
        className="absolute w-[150vmax] h-[150vmax] rounded-full bg-slate-900"
        style={{ transformOrigin: 'center center' }}
      />
    </section>
  );
}

/**
 * Slice Reveal - Image reveals in horizontal slices
 */
export function SliceReveal() {
  const container = useRef<HTMLDivElement>(null);
  const slicesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!slicesRef.current) return;

    const slices = gsap.utils.toArray(slicesRef.current.children);

    gsap.from(slices, {
      scaleX: 0,
      transformOrigin: (i) => i % 2 === 0 ? 'left' : 'right',
      stagger: 0.15,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
      }
    });

  }, { scope: container });

  // Create 8 slice divs
  const slices = Array.from({ length: 8 }, (_, i) => i);

  return (
    <section ref={container} className="relative h-screen flex items-center justify-center bg-slate-900">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Content to reveal */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <span className="text-6xl">🔥</span>
        </div>

        {/* Slices */}
        <div ref={slicesRef} className="absolute inset-0">
          {slices.map((i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 bg-slate-900"
              style={{
                left: `${(i / 8) * 100}%`,
                width: `${(1 / 8) * 100}%`,
                transformOrigin: i % 2 === 0 ? 'left' : 'right'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Parallax Image Grid - Images reveal with parallax offset
 */
export function ParallaxImageGrid() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const items = container.current.querySelectorAll('.grid-item');

    items.forEach((item, i) => {
      gsap.from(item, {
        y: 100 + (i % 3) * 50,
        opacity: 0,
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          end: 'top 40%',
          scrub: 1,
        }
      });
    });

  }, { scope: container });

  const images = [
    { emoji: '🌊', title: 'Ocean' },
    { emoji: '🏔️', title: 'Mountains' },
    { emoji: '🌲', title: 'Forest' },
    { emoji: '🏜️', title: 'Desert' },
    { emoji: '🌆', title: 'City' },
    { emoji: '🌅', title: 'Sunset' },
  ];

  return (
    <section ref={container} className="min-h-screen py-20 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-400">
          Explore
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {images.map((item, i) => (
            <div
              key={i}
              className="grid-item relative h-64 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10" />
              <div className="relative h-full flex flex-col items-center justify-center p-8">
                <span className="text-6xl mb-4">{item.emoji}</span>
                <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Main showcase combining all reveal techniques
 */
export default function ImageRevealShowcase() {
  // Cleanup on unmount
  useGSAP(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-slate-900">
      <CurtainReveal />
      <CircleReveal />
      <SliceReveal />
      <ParallaxImageGrid />
    </div>
  );
}
