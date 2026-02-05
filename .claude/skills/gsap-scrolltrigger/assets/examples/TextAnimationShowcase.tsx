/**
 * Text Animation Showcase
 *
 * Creative text animation techniques for engaging storytelling.
 * Demonstrates: character split, word stagger, counter, scroll marquee, stroke draw
 */

"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef, useMemo } from 'react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Character Explosion - Characters explode outward then reform
 */
export function CharacterExplosion() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const chars = textRef.current.querySelectorAll('.char');

    gsap.from(chars, {
      y: (i) => (i % 2 === 0 ? -200 : 200),
      x: (i) => (i - chars.length / 2) * 30,
      opacity: 0,
      rotation: (i) => (i - chars.length / 2) * 20,
      scale: 0,
      duration: 1,
      stagger: 0.03,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
      }
    });

  }, { scope: container });

  const text = "EXPLODE";
  const chars = useMemo(() => text.split(''), [text]);

  return (
    <section ref={container} className="h-screen bg-slate-900 flex items-center justify-center">
      <h1 ref={textRef} className="text-6xl md:text-9xl font-bold">
        {chars.map((char, i) => (
          <span key={i} className="char inline-block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </section>
  );
}

/**
 * Word Cascade - Words cascade down like waterfall
 */
export function WordCascade() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const words = textRef.current.querySelectorAll('.word');

    gsap.from(words, {
      y: -150,
      opacity: 0,
      rotationX: -90,
      transformOrigin: 'top center',
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 70%',
      }
    });

  }, { scope: container });

  const text = "Words cascade like water";
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <section ref={container} className="h-screen bg-slate-900 flex items-center justify-center perspective-1000">
      <h1 ref={textRef} className="text-4xl md:text-7xl font-bold text-center px-4">
        {words.map((word, i) => (
          <span key={i} className="word inline-block mx-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            {word}
          </span>
        ))}
      </h1>
    </section>
  );
}

/**
 * Number Counter - Numbers count up as they enter viewport
 */
export function NumberCounter() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const counters = container.current.querySelectorAll('.counter');

    counters.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target') || '0');
      const suffix = counter.getAttribute('data-suffix') || '';

      gsap.to(counter, {
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
        },
        onUpdate: function() {
          counter.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
        }
      });
    });

  }, { scope: container });

  const stats = [
    { value: 500, suffix: '+', label: 'Projects' },
    { value: 100, suffix: '%', label: 'Satisfaction' },
    { value: 50, suffix: 'k', label: 'Users' },
    { value: 24, suffix: '/7', label: 'Support' },
  ];

  return (
    <section ref={container} className="min-h-screen bg-slate-900 flex items-center py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
          By the Numbers
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="counter text-5xl md:text-7xl font-bold text-white mb-2"
                data-target={stat.value}
                data-suffix={stat.suffix}
              >
                0{stat.suffix}
              </div>
              <p className="text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Scroll Marquee - Text continuously scrolls as page scrolls
 */
export function ScrollMarquee() {
  const container = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!marqueeRef.current || !container.current) return;

    gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      }
    });

  }, { scope: container });

  const text = "CREATIVE • SCROLL • ANIMATIONS • ";
  const repeatedText = text.repeat(8);

  return (
    <section ref={container} className="h-screen bg-slate-900 flex items-center overflow-hidden">
      <div ref={marqueeRef} className="whitespace-nowrap">
        <span className="text-6xl md:text-9xl font-bold text-white/10">
          {repeatedText}
        </span>
      </div>
    </section>
  );
}

/**
 * Stroke Text Animation - Text stroke draws on like handwriting
 */
export function StrokeTextDraw() {
  const container = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll('path');

    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength();

      gsap.fromTo(path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
          }
        }
      );
    });

  }, { scope: container });

  return (
    <section ref={container} className="h-screen bg-slate-900 flex items-center justify-center">
      <svg
        ref={svgRef}
        className="w-80 h-80 md:w-[500px] md:h-[500px]"
        viewBox="0 0 500 500"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className="stroke-cyan-400"
          d="M100,250 Q150,150 250,250 T400,250"
          stroke="url(#gradient1)"
        />
        <path
          className="stroke-purple-400"
          d="M50,400 L150,300 L250,400 L350,300 L450,400"
          stroke="url(#gradient2)"
        />
        <circle className="stroke-pink-400" cx="250" cy="150" r="80" stroke="url(#gradient3)" />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
}

/**
 * Text Color Shift - Words change color as you scroll
 */
export function TextColorShift() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const words = container.current.querySelectorAll('.color-word');

    words.forEach((word) => {
      gsap.to(word, {
        color: 'var(--accent-color)',
        scrollTrigger: {
          trigger: word,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        }
      });
    });

  }, { scope: container });

  const text = "Watch each word transform as you scroll through this section";
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <section
      ref={container}
      className="min-h-screen bg-slate-900 flex items-center py-20"
      style={{ '--accent-color': '#a855f7' } as React.CSSProperties}
    >
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-2xl md:text-4xl font-medium text-white/40 leading-relaxed">
          {words.map((word, i) => (
            <span key={i} className="color-word inline-block mx-1 transition-colors duration-300">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/**
 * Highlight Reveal - Text highlights like marker on scroll
 */
export function HighlightReveal() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const highlights = container.current.querySelectorAll('.highlight-text');
    const markers = container.current.querySelectorAll('.highlight-marker');

    highlights.forEach((text, i) => {
      const marker = markers[i];

      gsap.to(marker, {
        scaleX: 1,
        transformOrigin: 'left',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: text,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1,
        }
      });
    });

  }, { scope: container });

  const highlights = [
    { text: 'scroll', color: 'from-cyan-400' },
    { text: 'animations', color: 'from-purple-400' },
    { text: 'create', color: 'from-pink-400' },
    { text: 'magic', color: 'from-orange-400' },
  ];

  return (
    <section ref={container} className="h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl md:text-2xl text-white/60 mb-4">Watch the highlights appear</p>
        <div className="space-y-4">
          {highlights.map((item, i) => (
            <div key={i} className="highlight-text relative inline-block">
              <span className="text-4xl md:text-6xl font-bold text-white relative z-10">
                {item.text}
              </span>
              <div
                className={`highlight-marker absolute inset-0 bg-gradient-to-r ${item.color} to-transparent -z-0`}
                style={{ scaleX: 0 }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Main showcase combining all text animations
 */
export default function TextAnimationShowcase() {
  useGSAP(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-slate-900">
      <CharacterExplosion />
      <WordCascade />
      <NumberCounter />
      <ScrollMarquee />
      <StrokeTextDraw />
      <TextColorShift />
      <HighlightReveal />
    </div>
  );
}
