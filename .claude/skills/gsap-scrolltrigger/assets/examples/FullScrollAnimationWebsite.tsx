/**
 * Full Scroll Animation Website Example
 *
 * This is a comprehensive showcase of GSAP ScrollTrigger animations.
 * It demonstrates multiple patterns working together on a single page:
 *
 * 1. Hero Ball Animation - Ball moves, changes size, and rotates on scroll
 * 2. Parallax Background - Multi-layer parallax effect
 * 3. Scroll Reveal Sections - Elements reveal as they enter viewport
 * 4. Horizontal Scroll Showcase - Vertical scroll drives horizontal movement
 * 5. Pinned Content Section - Content stays fixed while animating
 * 6. Text Split Animation - Characters animate individually
 * 7. Progress Indicator - Visual scroll progress bar
 * 8. Card Stacking - Cards stack with 3D transform
 */

"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef, useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Section with Animated Ball
 * The ball moves across screen, changes size, and rotates based on scroll
 */
export function HeroBallSection() {
  const container = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!container.current || !ball.current || !titleRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: true,
      }
    });

    // Ball animation sequence
    tl.to(ball.current, {
      x: '70vw',
      rotation: 720,
      scale: 2.5,
      backgroundColor: '#8b5cf6',
      duration: 3,
      ease: 'power1.inOut'
    })
    .to(ball.current, {
      y: '-20vh',
      scale: 1.5,
      backgroundColor: '#ec4899',
      duration: 2,
      ease: 'power2.inOut'
    }, '<')
    .to(ball.current, {
      borderRadius: '20%',
      rotation: -360,
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    }, 1);

    // Title reveals with stagger
    tl.from(titleRef.current.querySelectorAll('.word'), {
      y: 100,
      opacity: 0,
      rotationX: -90,
      stagger: 0.2,
      duration: 1,
      ease: 'back.out(1.7)'
    }, 0);

  }, { scope: container });

  return (
    <section
      ref={container}
      className="relative h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden"
    >
      {/* Animated Ball */}
      <div
        ref={ball}
        className="absolute left-10 top-1/2 w-20 h-20 bg-cyan-400 rounded-full will-change-transform"
        style={{
          boxShadow: '0 0 60px rgba(34, 211, 238, 0.5)',
          filter: 'blur(0px)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 ref={titleRef} className="text-6xl md:text-8xl font-bold text-white">
          <span className="word inline-block">Scroll</span>{' '}
          <span className="word inline-block">to</span>{' '}
          <span className="word inline-block text-cyan-400">Animate</span>
        </h1>
        <p className="mt-6 text-xl text-white/70">
          Watch the ball transform as you scroll
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/**
 * Parallax Section with Multi-Layer Background
 * Different layers move at different speeds creating depth
 */
export function ParallaxShowcaseSection() {
  const container = useRef<HTMLDivElement>(null);
  const bg1 = useRef<HTMLDivElement>(null);
  const bg2 = useRef<HTMLDivElement>(null);
  const bg3 = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    // Layered parallax - each layer moves at different speed
    [bg1, bg2, bg3].forEach((ref, index) => {
      if (ref.current) {
        gsap.to(ref.current, {
          yPercent: -(50 + index * 30),
          ease: 'none',
          scrollTrigger: {
            trigger: container.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }
    });

  }, { scope: container });

  return (
    <section
      ref={container}
      className="relative min-h-screen py-24 overflow-hidden"
    >
      {/* Background Layers */}
      <div
        ref={bg1}
        className="absolute inset-0 -z-30 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3), transparent 50%)'
        }}
      />
      <div
        ref={bg2}
        className="absolute inset-0 -z-20 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.3), transparent 50%)'
        }}
      />
      <div
        ref={bg3}
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.3), transparent 50%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
          Multi-Layer Parallax
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="glass-card p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10"
            >
              <div className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${
                num === 1 ? 'from-cyan-400 to-blue-500' :
                num === 2 ? 'from-purple-400 to-pink-500' :
                'from-pink-400 to-red-500'
              }`} />
              <h3 className="text-2xl font-semibold text-white mb-4">
                Layer {num}
              </h3>
              <p className="text-white/60">
                Each background layer moves at a different speed, creating
                a sense of depth and dimension.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Horizontal Scroll Section
 * Vertical scroll drives horizontal movement through panels
 */
export function HorizontalScrollSection() {
  const container = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !panelsRef.current) return;

    const panels = gsap.utils.toArray(panelsRef.current.children);
    const width = container.current.offsetWidth;

    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => `+=${width * panels.length}`,
      }
    });

  }, { scope: container });

  const sections = [
    {
      title: 'Discover',
      desc: 'Explore new possibilities',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      title: 'Create',
      desc: 'Build amazing experiences',
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Innovate',
      desc: 'Push the boundaries',
      color: 'from-pink-400 to-red-500'
    },
    {
      title: 'Inspire',
      desc: 'Leave a lasting impression',
      color: 'from-orange-400 to-yellow-500'
    }
  ];

  return (
    <section
      ref={container}
      className="h-screen overflow-hidden bg-slate-900"
    >
      <div ref={wrapper} className="flex h-full">
        <div ref={panelsRef} className="flex">
          {sections.map((section, i) => (
            <div
              key={i}
              className="h-screen w-full flex-shrink-0 flex items-center justify-center p-8"
            >
              <div className="text-center max-w-2xl">
                <div className={`inline-block mb-8 px-6 py-2 rounded-full bg-gradient-to-r ${section.color}`}>
                  <span className="text-white font-semibold">0{i + 1}</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-bold text-white mb-6">
                  {section.title}
                </h2>
                <p className="text-2xl text-white/60">
                  {section.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Card Stacking Section
 * Cards stack with 3D transform as you scroll
 */
export function CardStackingSection() {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !cardsRef.current) return;

    const cards = gsap.utils.toArray(cardsRef.current.children) as HTMLElement[];
    const containerHeight = container.current.offsetHeight;

    // Create stacking effect
    cards.forEach((card, index) => {
      gsap.to(card, {
        scale: 1 - (index * 0.1),
        y: -index * 30,
        rotationX: index * 10,
        zIndex: cards.length - index,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });

  }, { scope: container });

  const cardData = [
    { title: 'Card One', content: 'First card in the stack', emoji: '🎴' },
    { title: 'Card Two', content: 'Second card stacks here', emoji: '🎨' },
    { title: 'Card Three', content: 'Third card adds depth', emoji: '✨' },
    { title: 'Card Four', content: 'Fourth card completes', emoji: '🚀' },
  ];

  return (
    <section
      ref={container}
      className="min-h-screen py-32 bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center perspective-1000"
    >
      <div ref={cardsRef} className="relative max-w-md mx-auto">
        {cardData.map((card, i) => (
          <div
            key={i}
            className="absolute inset-0 p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl transform-gpu"
            style={{
              transformOrigin: 'center center',
              backfaceVisibility: 'hidden' as const,
            }}
          >
            <span className="text-6xl mb-4 block">{card.emoji}</span>
            <h3 className="text-3xl font-bold text-white mb-2">{card.title}</h3>
            <p className="text-white/60">{card.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Text Split Animation Section
 * Characters animate individually on scroll
 */
export function TextRevealSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const textElements = container.current.querySelectorAll('.reveal-text');

    textElements.forEach((el) => {
      const text = el.textContent || '';
      const chars = text.split('');

      // Clear original text
      el.innerHTML = '';

      // Create spans for each character
      chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.className = 'char inline-block will-change-transform';
        el.appendChild(span);
      });

      // Animate characters
      gsap.from(el.querySelectorAll('.char'), {
        y: 100,
        opacity: 0,
        rotationX: -90,
        stagger: 0.05,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    });

  }, { scope: container });

  return (
    <section
      ref={container}
      className="min-h-screen bg-slate-900 flex items-center justify-center py-24"
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="reveal-text text-5xl md:text-7xl font-bold text-white mb-12">
          Every character tells a story
        </h2>
        <p className="reveal-text text-2xl text-white/60">
          Scroll to see the magic of letter-by-letter animation
        </p>
      </div>
    </section>
  );
}

/**
 * Progress Bar Component
 * Shows scroll progress at the top of the page
 */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (barRef.current) {
          barRef.current.style.width = `${self.progress * 100}%`;
        }
      }
    });
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 origin-left"
      />
    </div>
  );
}

/**
 * Main Page Component
 * Combines all scroll animation sections
 */
export default function ScrollAnimationShowcase() {
  const mainRef = useRef<HTMLDivElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="bg-slate-900">
      <ScrollProgressBar />

      <HeroBallSection />
      <ParallaxShowcaseSection />
      <HorizontalScrollSection />
      <CardStackingSection />
      <TextRevealSection />

      {/* Footer */}
      <footer className="py-16 text-center text-white/40">
        <p>Built with GSAP ScrollTrigger + Next.js</p>
      </footer>
    </div>
  );
}

/**
 * STYLES NEEDED (add to your globals.css):
 *
 * .will-change-transform {
 *   will-change: transform, opacity;
 * }
 *
 * .glass-card {
 *   background: rgba(255, 255, 255, 0.05);
 *   backdrop-filter: blur(10px);
 * }
 *
 * .perspective-1000 {
 *   perspective: 1000px;
 * }
 *
 * .transform-gpu {
 *   transform: translateZ(0);
 * }
 *
 * @media (prefers-reduced-motion: reduce) {
 *   .will-change-transform {
 *     will-change: auto;
 *   }
 * }
 */
