/**
 * Advanced 3D Scroll Animation Showcase
 *
 * Demonstrates advanced 3D transforms and scroll-linked animations.
 * Includes: card flips, cube rotation, accordion 3D, perspective tilt
 */

"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

/**
 * 3D Card Flip - Cards flip 360 degrees as they enter viewport
 */
export function CardFlipShowcase() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const cards = container.current.querySelectorAll('.flip-card');

    cards.forEach((card, i) => {
      gsap.from(card, {
        rotationY: 180,
        transformOrigin: 'center center',
        opacity: 0,
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1,
        }
      });
    });

  }, { scope: container });

  const cardData = [
    { emoji: '🎨', title: 'Design', desc: 'Beautiful interfaces' },
    { emoji: '⚡', title: 'Speed', desc: 'Lightning fast' },
    { emoji: '🔒', title: 'Secure', desc: 'Enterprise ready' },
  ];

  return (
    <section ref={container} className="min-h-screen py-20 bg-slate-900 flex items-center">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          Flip to Discover
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {cardData.map((card, i) => (
            <div
              key={i}
              className="flip-card h-80 perspective-1000"
            >
              <div className="relative w-full h-full transition-all duration-500 transform-style-3d">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 flex flex-col items-center justify-center p-8">
                  <span className="text-6xl mb-4">{card.emoji}</span>
                  <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                  <p className="text-white/60 mt-2">{card.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 3D Cube Rotation - Cube rotates based on scroll position
 */
export function CubeRotation() {
  const container = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cubeRef.current || !container.current) return;

    gsap.to(cubeRef.current, {
      rotationX: 720,
      rotationY: 360,
      rotationZ: 180,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      }
    });

  }, { scope: container });

  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];

  return (
    <section ref={container} className="h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
      <div className="text-center mb-80">
        <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Scroll to Rotate
        </h2>
      </div>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 perspective-1000">
        <div
          ref={cubeRef}
          className="relative w-full h-full transform-style-3d will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {faces.map((face, i) => (
            <div
              key={face}
              className={`absolute w-40 h-40 bg-gradient-to-br from-${face === 'front' || face === 'back' ? 'purple' : 'pink'}-500/30 to-${face === 'front' || face === 'back' ? 'pink' : 'purple'}-500/30 backdrop-blur-lg border-2 border-white/20 flex items-center justify-center`}
              style={{
                transform: getFaceTransform(face),
              }}
            >
              <span className="text-white font-bold text-lg">{face.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function for cube face transforms
function getFaceTransform(face: string): string {
  const size = 160; // w-40 = 160px
  const transforms: Record<string, string> = {
    front: `rotateY(0deg) translateZ(${size / 2}px)`,
    back: `rotateY(180deg) translateZ(${size / 2}px)`,
    right: `rotateY(90deg) translateZ(${size / 2}px)`,
    left: `rotateY(-90deg) translateZ(${size / 2}px)`,
    top: `rotateX(90deg) translateZ(${size / 2}px)`,
    bottom: `rotateX(-90deg) translateZ(${size / 2}px)`,
  };
  return transforms[face];
}

/**
 * 3D Accordion - Items expand in 3D space based on scroll
 */
export function Accordion3D() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const items = container.current.querySelectorAll('.accordion-item');
    const totalWidth = container.current.offsetWidth;

    // Create timeline with scroll control
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      }
    });

    // Animate through accordion states
    items.forEach((item, i) => {
      if (i === 0) return; // Skip first, it's default expanded

      tl.to(item, {
        width: '15%',
        duration: 0.5,
        ease: 'power2.inOut'
      }, i * 0.1);
    });

    // First item starts expanded
    gsap.set(items[0], { width: '55%' });

  }, { scope: container });

  const items = [
    { title: '01', desc: 'Discovery', color: 'from-cyan-500 to-blue-500' },
    { title: '02', desc: 'Design', color: 'from-purple-500 to-pink-500' },
    { title: '03', desc: 'Develop', color: 'from-orange-500 to-red-500' },
    { title: '04', desc: 'Deploy', color: 'from-green-500 to-teal-500' },
  ];

  return (
    <section ref={container} className="h-screen bg-slate-900 flex items-center px-8 perspective-2000">
      <div className="w-full max-w-6xl mx-auto flex gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="accordion-item h-[70vh] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
            style={{
              width: i === 0 ? '55%' : '15%',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className={`w-full h-full bg-gradient-to-br ${item.color} flex flex-col items-center justify-center p-8`}>
              <span className="text-4xl font-bold text-white mb-4">{item.title}</span>
              <span className="text-white/80">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Perspective Tilt Cards - Cards tilt toward scroll direction
 */
export function PerspectiveTilt() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const cards = container.current.querySelectorAll('.tilt-card');

    cards.forEach((card, i) => {
      gsap.from(card, {
        rotationY: -15 + (i % 3) * 15,
        rotationX: 10,
        transformOrigin: 'center center',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 30%',
          scrub: 1,
        }
      });
    });

  }, { scope: container });

  const tiltData = [
    { emoji: '🚀', title: 'Launch', sub: 'To the moon' },
    { emoji: '💡', title: 'Ideas', sub: 'Bright thinking' },
    { emoji: '🎯', title: 'Focus', sub: 'Hit targets' },
    { emoji: '⭐', title: 'Quality', sub: 'Star level' },
    { emoji: '🔥', title: 'Passion', sub: 'Burning hot' },
    { emoji: '💎', title: 'Premium', sub: 'Cut above' },
  ];

  return (
    <section ref={container} className="min-h-screen py-20 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
          Tilted Perspective
        </h2>

        <div className="grid md:grid-cols-3 gap-8 perspective-1000">
          {tiltData.map((item, i) => (
            <div
              key={i}
              className="tilt-card h-64 transform-style-3d will-change-transform"
            >
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 p-8 flex flex-col items-center justify-center">
                <span className="text-5xl mb-4">{item.emoji}</span>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-white/60 text-sm mt-1">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 3D Product Showcase - Product rotates with feature callouts
 */
export function Product3DShowcase() {
  const container = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !productRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=400%',
        scrub: 1,
        pin: true,
      }
    });

    // Product rotates 360 and scales
    tl.to(productRef.current, {
      rotationY: 360,
      scale: 1.3,
      ease: 'none'
    })
    // Feature callouts appear sequentially
    .from('.feature-1', { opacity: 0, x: -100 }, '<0.2')
    .from('.feature-2', { opacity: 0, x: 100 }, '<0.1')
    .from('.feature-3', { opacity: 0, y: 100 }, '<0.1')
    // Final product state
    .to(productRef.current, { scale: 0.9, y: 50 }, '<0.2');

  }, { scope: container });

  return (
    <section ref={container} className="h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-6xl mx-auto px-4">
        {/* Features that appear on scroll */}
        <div ref={featuresRef} className="absolute inset-0 pointer-events-none">
          <div className="feature-1 absolute top-20 left-10 md:left-20">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
              <span className="text-cyan-400 font-bold">⚡</span>
              <p className="text-white font-semibold">Lightning Fast</p>
            </div>
          </div>
          <div className="feature-2 absolute top-40 right-10 md:right-20">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
              <span className="text-purple-400 font-bold">🎨</span>
              <p className="text-white font-semibold">Beautiful Design</p>
            </div>
          </div>
          <div className="feature-3 absolute bottom-20 left-1/2 -translate-x-1/2">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
              <span className="text-pink-400 font-bold">🔒</span>
              <p className="text-white font-semibold">Secure & Reliable</p>
            </div>
          </div>
        </div>

        {/* 3D Product */}
        <div
          ref={productRef}
          className="relative w-64 h-64 md:w-80 md:h-80 mx-auto transform-style-3d"
        >
          {/* Cube representation of product */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-3xl transform-style-3d flex items-center justify-center">
            <span className="text-8xl">📦</span>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/50 to-purple-500/50 rounded-3xl blur-3xl -z-10" />
        </div>

        <p className="text-center text-white/60 mt-20">Scroll to explore features</p>
      </div>
    </section>
  );
}

/**
 * Main showcase combining all 3D effects
 */
export default function Advanced3DShowcase() {
  useGSAP(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-slate-900">
      <CardFlipShowcase />
      <CubeRotation />
      <Accordion3D />
      <PerspectiveTilt />
      <Product3DShowcase />
    </div>
  );
}
