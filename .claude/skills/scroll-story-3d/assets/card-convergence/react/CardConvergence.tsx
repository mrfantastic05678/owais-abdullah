'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface CardData {
  src: string;
  alt?: string;
  x: number;
  y: number;
  bgColor?: string;
}

export interface CardConvergenceProps {
  cards: CardData[];
  heading?: string;
  text?: string;
  cta?: string;
  className?: string;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function CardConvergence({
  cards,
  heading = 'Crafted for impact',
  text = 'Every detail thoughtfully composed to create an immersive experience that feels both intentional and effortless.',
  cta = 'Learn more',
  className = '',
}: CardConvergenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const initial = cards.map(() => ({
      rotation: randomBetween(-12, 12),
      zIndex: Math.floor(Math.random() * cards.length),
    }));

    const wrappers = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    wrappers.forEach((el, i) => {
      el.style.zIndex = String(initial[i].zIndex);
    });

    function measureOffset(el: HTMLElement) {
      const wrapperRect = el.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      return {
        x: wrapperRect.left + wrapperRect.width / 2 - (sectionRect.left + sectionRect.width / 2),
        y: wrapperRect.top + wrapperRect.height / 2 - (sectionRect.top + sectionRect.height / 2),
      };
    }

    const ctx = gsap.context(() => {
      wrappers.forEach((wrapper, i) => {
        const offset = measureOffset(wrapper);
        const init = initial[i];

        gsap.fromTo(
          wrapper,
          { x: offset.x, y: offset.y, scale: 1, rotation: init.rotation },
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'center center',
              scrub: 1.5,
            },
          }
        );
      });
    }, section);

    const handleResize = () => {
      ctx.revert();
      wrappers.forEach((wrapper, i) => {
        const offset = measureOffset(wrapper);
        const init = initial[i];
        gsap.set(wrapper, {
          x: offset.x,
          y: offset.y,
          scale: 1,
          rotation: init.rotation,
        });
      });
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [cards]);

  return (
    <section
      ref={sectionRef}
      className={`relative flex h-screen w-full items-center justify-center overflow-hidden ${className}`}
    >
      <div className="relative z-10 max-w-[600px] px-8 text-center">
        <h2 className="mb-4 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight">
          {heading}
        </h2>
        <p className="mx-auto mb-8 max-w-[45ch] text-[clamp(1rem,2vw,1.25rem)] leading-relaxed opacity-70">
          {text}
        </p>
        {cta && (
          <button className="inline-block rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85">
            {cta}
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0"
      >
        {cards.map((card, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="absolute overflow-hidden rounded-2xl will-change-transform"
            style={{
              width: 'clamp(140px, 16vw, 220px)',
              height: 'clamp(180px, 20vw, 280px)',
              left: `calc(50% + ${card.x}%)`,
              top: `calc(50% + ${card.y}%)`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: card.bgColor || '#e5ddd5',
            }}
          >
            <img
              src={card.src}
              alt={card.alt || ''}
              loading="lazy"
              className="pointer-events-none h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
