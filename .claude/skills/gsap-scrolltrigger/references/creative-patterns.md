# Creative GSAP ScrollTrigger Patterns

A collection of inspiring scroll animation patterns and ideas for distinctive web experiences.

## Table of Contents

1. [Hero Transformations](#hero-transformations)
2. [Image Reveal Techniques](#image-reveal-techniques)
3. [Text Animation Ideas](#text-animation-ideas)
4. [Scroll-Linked Effects](#scroll-linked-effects)
5. [3D Transform Patterns](#3d-transform-patterns)
6. [Sequential Storytelling](#sequential-storytelling)
7. [Interactive Cards](#interactive-cards)
8. [Background Effects](#background-effects)
9. [Transition Effects](#transition-effects)
10. [Real-World Inspired Examples](#real-world-inspired-examples)

---

## Hero Transformations

### 1. Morphing Shape to Content

A shape transforms into the hero content as you scroll.

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "+=200%",
    scrub: 1,
    pin: true
  }
});

// Circle expands and morphs into hero text
tl.to(".morph-shape", {
  scale: 50,
  borderRadius: "0%",
  backgroundColor: "transparent"
})
.from(".hero-title", {
  scale: 0,
  opacity: 0,
  rotation: -180
}, "<0.3")
.from(".hero-subtitle", {
  y: 100,
  opacity: 0
}, "<0.2");
```

### 2. Text Explosion

Characters explode outward then reform into words.

```typescript
// Split text into characters
const text = ".hero-title";
const chars = gsap.utils.toArray(`${text} .char`);

gsap.from(chars, {
  y: (i) => (i % 2 === 0 ? -200 : 200),
  x: (i) => (i - chars.length / 2) * 50,
  opacity: 0,
  rotation: (i) => (i - chars.length / 2) * 15,
  scale: 0,
  duration: 1,
  stagger: 0.02,
  ease: "elastic.out(1, 0.5)",
  scrollTrigger: {
    trigger: text,
    start: "top 80%"
  }
});
```

### 3. Camera Fly-Through

Simulates a camera flying through a 3D space.

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".flythrough-section",
    start: "top top",
    end: "+=400%",
    scrub: 1,
    pin: true
  }
});

// Elements fly toward camera (z-axis)
tl.to(".layer-1", { z: 500, scale: 3, opacity: 0 })
  .to(".layer-2", { z: 500, scale: 3, opacity: 0 }, "<0.2")
  .to(".layer-3", { z: 500, scale: 3, opacity: 0 }, "<0.2")
  .from(".destination", { scale: 0, rotation: 360 }, "<0.3");
```

---

## Image Reveal Techniques

### 1. Curved Reveal

Image reveals behind a curved SVG mask.

```typescript
gsap.to(".image-mask", {
  attr: { d: "M0,0 H1000 V1000 H0 Z" }, // Final path
  scrollTrigger: {
    trigger: ".image-reveal",
    start: "top 80%",
    end: "bottom 20%",
    scrub: 1
  }
});
```

### 2. Pixelated Reveal

Image transitions from pixels to clear.

```typescript
gsap.to(".pixelated-image", {
  imageRendering: "auto",
  filter: "blur(0px)",
  scrollTrigger: {
    trigger: ".pixelated-image",
    start: "top 80%",
    end: "center center",
    scrub: 1
  }
});
```

### 3. Slice Reveal

Image reveals in horizontal slices.

```typescript
const slices = gsap.utils.toArray(".image-slice");

gsap.from(slices, {
  scaleX: 0,
  transformOrigin: (i) => (i % 2 === 0 ? "left" : "right"),
  stagger: 0.1,
  ease: "power4.inOut",
  scrollTrigger: {
    trigger: ".slice-reveal-container",
    start: "top 80%"
  }
});
```

### 4. Circular Reveal with Follow

Image reveals in circle that follows scroll position.

```typescript
gsap.to(".reveal-circle", {
  scale: 50,
  scrollTrigger: {
    trigger: ".circular-reveal",
    start: "top 80%",
    end: "bottom 20%",
    scrub: 1,
    onUpdate: (self) => {
      gsap.set(".reveal-circle", {
        x: self.progress * window.innerWidth * 0.6
      });
    }
  }
});
```

---

## Text Animation Ideas

### 1. Marquee on Scroll

Text continuously scrolls as page scrolls.

```typescript
gsap.to(".marquee-text", {
  xPercent: -50,
  ease: "none",
  scrollTrigger: {
    trigger: ".marquee-section",
    start: "top bottom",
    end: "bottom top",
    scrub: 0.5
  }
});
```

### 2. Text Counter

Numbers count up as they enter viewport.

```typescript
gsap.utils.toArray(".counter").forEach(counter => {
  const target = parseFloat(counter.dataset.target);

  gsap.to(counter, {
    innerHTML: target,
    duration: 2,
    snap: { innerHTML: 1 },
    scrollTrigger: {
      trigger: counter,
      start: "top 85%"
    }
  });
});
```

### 3. Word-by-Word Color Shift

Words change color as you scroll.

```typescript
const words = gsap.utils.toArray(".color-shift-text .word");

words.forEach((word, i) => {
  gsap.to(word, {
    color: "var(--accent-color)",
    scrollTrigger: {
      trigger: word,
      start: "top 80%",
      end: "top 20%",
      scrub: true
    }
  });
});
```

### 4. Text Stroke Animation

Text stroke draws on scroll.

```typescript
gsap.fromTo(".stroke-text",
  { strokeDasharray: 1000, strokeDashoffset: 1000 },
  {
    strokeDashoffset: 0,
    scrollTrigger: {
      trigger: ".stroke-text",
      start: "top 80%",
      end: "center center",
      scrub: 1
    }
  }
);
```

---

## Scroll-Linked Effects

### 1. Progress-Based Color Transition

Background color shifts through spectrum based on scroll progress.

```typescript
gsap.to("body", {
  backgroundColor: "#1a1a2e",
  scrollTrigger: {
    trigger: ".color-transition-section",
    start: "top 50%",
    end: "bottom 50%",
    scrub: true,
    onUpdate: (self) => {
      const hue = self.progress * 360;
      gsap.set("body", { backgroundColor: `hsl(${hue}, 50%, 20%)` });
    }
  }
});
```

### 2. Scroll Velocity Detection

Animations respond to how fast user scrolls.

```typescript
let scrollVelocity = 0;
let lastScroll = 0;

ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: (self) => {
    scrollVelocity = Math.abs(self.scroll() - lastScroll);
    lastScroll = self.scroll();

    gsap.to(".velocity-indicator", {
      scale: 1 + scrollVelocity * 0.01,
      duration: 0.1
    });
  }
});
```

### 3. Parallax Grid

Grid items move at different rates based on position.

```typescript
const gridItems = gsap.utils.toArray(".grid-item");

gridItems.forEach((item, i) => {
  const column = i % 5;
  const row = Math.floor(i / 5);

  gsap.to(item, {
    yPercent: -20 + column * 5,
    xPercent: -10 + row * 5,
    scrollTrigger: {
      trigger: item,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});
```

---

## 3D Transform Patterns

### 1. Card Flip on Scroll

Cards flip in 3D as they enter viewport.

```typescript
gsap.utils.toArray(".flip-card").forEach(card => {
  gsap.from(card, {
    rotationY: 180,
    transformOrigin: "center center",
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      end: "top 50%",
      scrub: 1
    }
  });
});
```

### 2. Cube Rotation

3D cube rotates based on scroll.

```typescript
gsap.to(".cube", {
  rotationX: 720,
  rotationY: 360,
  scrollTrigger: {
    trigger: ".cube-section",
    start: "top top",
    end: "bottom bottom",
    scrub: 1
  }
});
```

### 3. Perspective Tilt

Elements tilt toward cursor/scroll direction.

```typescript
gsap.utils.toArray(".tilt-card").forEach(card => {
  gsap.to(card, {
    rotationX: 15,
    rotationY: -15,
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
      end: "top 30%",
      scrub: 1
    }
  });
});
```

### 4. Accordion 3D

3D accordion that expands on scroll.

```typescript
const accordionItems = gsap.utils.toArray(".accordion-item");

accordionItems.forEach((item, i) => {
  gsap.to(item, {
    width: i === 0 ? "70%" : "15%",
    scrollTrigger: {
      trigger: ".accordion-container",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        const activeIndex = Math.floor(self.progress * accordionItems.length);
        accordionItems.forEach((item, i) => {
          gsap.to(item, {
            width: i === activeIndex ? "70%" : "15%"
          });
        });
      }
    }
  });
});
```

---

## Sequential Storytelling

### 1. Timeline Progress

Visual progress bar that fills as story unfolds.

```typescript
gsap.to(".timeline-progress", {
  scaleY: 1,
  transformOrigin: "top",
  scrollTrigger: {
    trigger: ".story-section",
    start: "top 80%",
    end: "bottom 20%",
    scrub: 1
  }
});
```

### 2. Step-by-Step Reveal

Each step reveals as you scroll, highlighting current step.

```typescript
const steps = gsap.utils.toArray(".story-step");

steps.forEach((step, i) => {
  ScrollTrigger.create({
    trigger: step,
    start: "top center",
    end: "bottom center",
    onEnter: () => {
      gsap.to(step, { scale: 1.1, backgroundColor: "var(--active)" });
    },
    onLeave: () => {
      gsap.to(step, { scale: 1, backgroundColor: "var(--inactive)" });
    },
    onEnterBack: () => {
      gsap.to(step, { scale: 1.1, backgroundColor: "var(--active)" });
    },
    onLeaveBack: () => {
      gsap.to(step, { scale: 1, backgroundColor: "var(--inactive)" });
    }
  });
});
```

### 3. Image Sequence Playback

Play through image sequence on scroll (video-like).

```typescript
const frames = 100;
const images = [];

// Preload images
for (let i = 0; i < frames; i++) {
  const img = new Image();
  img.src = `/frames/frame_${i.toString().padStart(3, '0')}.jpg`;
  images.push(img);
}

const obj = { frame: 0 };

gsap.to(obj, {
  frame: frames - 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".sequence-section",
    start: "top top",
    end: "+=300%",
    scrub: 1,
    pin: true,
    onUpdate: () => {
      const frame = Math.round(obj.frame);
      document.querySelector(".sequence-display").src = images[frame].src;
    }
  }
});
```

---

## Interactive Cards

### 1. Card Stack Deal

Cards deal from top as you scroll.

```typescript
const cards = gsap.utils.toArray(".deck-card");

cards.forEach((card, i) => {
  gsap.from(card, {
    y: -200 - i * 50,
    rotation: (Math.random() - 0.5) * 30,
    opacity: 0,
    scrollTrigger: {
      trigger: ".card-deck",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1
    }
  });
});
```

### 2. Card Fan

Cards fan out in arc on scroll.

```typescript
const cards = gsap.utils.toArray(".fan-card");

cards.forEach((card, i) => {
  const angle = (i - cards.length / 2) * 15;

  gsap.from(card, {
    x: 0,
    y: 0,
    rotation: 0,
    scrollTrigger: {
      trigger: ".card-fan",
      start: "top 80%",
      end: "center center",
      scrub: 1
    }
  });

  gsap.to(card, {
    x: Math.sin(angle * Math.PI / 180) * 200,
    y: -Math.abs(Math.cos(angle * Math.PI / 180) * 200 - 200),
    rotation: angle,
    scrollTrigger: {
      trigger: ".card-fan",
      start: "top 80%",
      end: "center center",
      scrub: 1
    }
  });
});
```

### 3. Hover + Scroll Combined

Cards have hover effect that persists based on scroll position.

```typescript
gsap.utils.toArray(".interactive-card").forEach(card => {
  // Scroll effect
  gsap.from(card, {
    y: 100,
    opacity: 0,
    scrollTrigger: {
      trigger: card,
      start: "top 85%"
    }
  });

  // Hover effect (use Motion.dev or CSS)
  card.addEventListener("mouseenter", () => {
    gsap.to(card, { scale: 1.05, y: -10 });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, { scale: 1, y: 0 });
  });
});
```

---

## Background Effects

### 1. Particle Field

Particles move in 3D space on scroll.

```typescript
const particles = gsap.utils.toArray(".particle");

particles.forEach((particle, i) => {
  gsap.to(particle, {
    z: 1000,
    scale: 0,
    scrollTrigger: {
      trigger: ".particle-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      // Offset each particle
      end: `+=${i * 10}px`
    }
  });
});
```

### 2. Gradient Wave

Background gradient shifts colors on scroll.

```typescript
gsap.to(".gradient-bg", {
  backgroundPosition: "200% 50%",
  ease: "none",
  scrollTrigger: {
    trigger: ".gradient-section",
    start: "top top",
    end: "bottom bottom",
    scrub: 1
  }
});
```

### 3. Mesh Distortion

SVG mesh points distort on scroll.

```typescript
const points = document.querySelectorAll(".mesh-point");

gsap.to(points, {
  attr: {
    // Morph to new positions
    cx: (i) => Math.random() * 100,
    cy: (i) => Math.random() * 100
  },
  stagger: 0.05,
  scrollTrigger: {
    trigger: ".mesh-section",
    start: "top 80%",
    end: "bottom 20%",
    scrub: 1
  }
});
```

### 4. Starfield Speed

Stars move faster based on scroll speed.

```typescript
gsap.to(".star", {
  y: "100vh",
  ease: "none",
  scrollTrigger: {
    trigger: ".starfield-section",
    start: "top bottom",
    end: "bottom top",
    scrub: (self) => {
      return self.getVelocity() / 1000; // Velocity-based scrub
    }
  }
});
```

---

## Transition Effects

### 1. Page Transition Wipe

Old page wipes away to reveal new content.

```typescript
gsap.from(".new-page-content", {
  yPercent: 100,
  scrollTrigger: {
    trigger: ".page-transition",
    start: "top top",
    end: "+=100%",
    scrub: 1
  }
});

gsap.to(".old-page-content", {
  yPercent: -100,
  scrollTrigger: {
    trigger: ".page-transition",
    start: "top top",
    end: "+=100%",
    scrub: 1
  }
});
```

### 2. Circle Transition

Content reveals through expanding circle.

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".circle-transition",
    start: "top top",
    end: "+=200%",
    scrub: 1,
    pin: true
  }
});

tl.to(".transition-circle", {
  scale: 100,
  transformOrigin: "center center"
})
.from(".new-content", {
  opacity: 0,
  scale: 1.5
}, "<0.5");
```

### 3. Blinds Effect

Content reveals through horizontal blinds.

```typescript
const blinds = gsap.utils.toArray(".blind");

gsap.to(blinds, {
  scaleY: 0,
  transformOrigin: "top",
  stagger: {
    each: 0.1,
    from: "center"
  },
  scrollTrigger: {
    trigger: ".blinds-container",
    start: "top 80%",
    end: "bottom 20%",
    scrub: 1
  }
});
```

---

## Real-World Inspired Examples

### 1. Apple-Style Product Reveal

Product rotates and floats with feature callouts.

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".product-showcase",
    start: "top top",
    end: "+=300%",
    scrub: 1,
    pin: true
  }
});

// Product rotates 360
tl.to(".product-3d", { rotationY: 360, scale: 1.2 })
  // Features fade in
  .from(".feature-1", { opacity: 0, x: -100 }, "<0.2")
  .from(".feature-2", { opacity: 0, x: 100 }, "<0.1")
  .from(".feature-3", { opacity: 0, y: 100 }, "<0.1")
  // Product scales down for overview
  .to(".product-3d", { scale: 0.8, y: 100 }, "<0.2");
```

### 2. Spotify-Style Playlist Scroll

Album art morphs and changes on scroll.

```typescript
ScrollTrigger.create({
  trigger: ".playlist-section",
  start: "top 80%",
  end: "bottom 20%",
  onUpdate: (self) => {
    const index = Math.floor(self.progress * albums.length);
    const progress = (self.progress * albums.length) % 1;

    // Crossfade between current and next album
    gsap.set(albums[index], { opacity: 1 - progress });
    gsap.set(albums[index + 1], { opacity: progress });
  }
});
```

### 3. Airbnb-Style Experience Cards

Cards stack and expand on scroll.

```typescript
const cards = gsap.utils.toArray(".experience-card");

cards.forEach((card, i) => {
  gsap.from(card, {
    y: 100 * i,
    scale: 1 - i * 0.1,
    opacity: 0,
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
      end: "top 30%",
      scrub: 1
    }
  });
});
```

### 4. Nike-Style Product Features

Text overlays while product transforms.

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".product-features",
    start: "top top",
    end: "+=400%",
    scrub: 1,
    pin: true
  }
});

tl.to(".product-base", { scale: 1.5 })
  .from(".feature-text-1", { opacity: 0, x: -50 }, "<")
  .to(".product-base", { rotation: 45 }, "<0.3")
  .from(".feature-text-2", { opacity: 0, x: 50 }, "<")
  .to(".product-base", { rotation: 90 }, "<0.3")
  .from(".feature-text-3", { opacity: 0, y: 50 }, "<");
```

### 5. Portfolio-Style Project Gallery

Projects reveal with image zoom and text slide.

```typescript
gsap.utils.toArray(".project-card").forEach(project => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: project,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  tl.from(project.querySelector(".project-image"), {
    scale: 1.2,
    opacity: 0,
    duration: 1
  })
  .from(project.querySelector(".project-title"), {
    y: 50,
    opacity: 0,
    duration: 0.8
  }, "<0.3")
  .from(project.querySelector(".project-desc"), {
    y: 30,
    opacity: 0,
    duration: 0.6
  }, "<0.2");
});
```

---

## Quick Idea Generator

Stuck on ideas? Mix and match these concepts:

| Visual | Motion | Timing | Interaction |
|--------|--------|--------|-------------|
| Circle | Scale | Scrub | Hover |
| Line | Rotate | Toggle | Click |
| Square | Translate | Stagger | Drag |
| Text | Morph | Sequence | Scroll |
| Image | Fade | Random | Velocity |
| Grid | Skew | Reverse | Pin |
| Particles | Flip | Loop | Snap |

**Example combinations:**
- Circle + Scale + Scrub + Hover = Pulsing orb that expands on scroll
- Text + Morph + Stagger + Scroll = Letters transform into shapes
- Grid + Skew + Random + Velocity = Grid distorts based on scroll speed
- Image + Fade + Sequence + Pin = Crossfade slideshow
