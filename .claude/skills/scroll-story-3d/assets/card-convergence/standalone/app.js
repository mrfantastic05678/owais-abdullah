import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.3.17/+esm';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const cards = [
  {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
    x: -40, y: -50, bgColor: '#f0ebe3',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
    x: 45, y: -40, bgColor: '#e8e0d8',
  },
  {
    src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80',
    x: -50, y: 45, bgColor: '#d9d0c5',
  },
  {
    src: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=400&q=80',
    x: 50, y: 50, bgColor: '#c8bfb5',
  },
  {
    src: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&q=80',
    x: 0, y: -60, bgColor: '#e5ddd5',
  },
  {
    src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=80',
    x: -55, y: 0, bgColor: '#d5ccc5',
  },
];

const container = document.getElementById('cardsContainer');
const section = document.getElementById('convergence');

const cardEls = [];
const initial = [];

cards.forEach((card, i) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'convergence__card';
  wrapper.style.transform = `translate(-50%, -50%)`;
  wrapper.style.left = `calc(50% + ${card.x}%)`;
  wrapper.style.top = `calc(50% + ${card.y}%)`;
  wrapper.style.backgroundColor = card.bgColor;

  const img = document.createElement('img');
  img.src = card.src;
  img.alt = '';
  img.loading = 'lazy';
  wrapper.appendChild(img);

  container.appendChild(wrapper);
  cardEls.push({ wrapper, img });

  const rotation = (Math.random() - 0.5) * 24;
  const zIndex = Math.floor(Math.random() * cards.length);
  initial.push({ rotation, scale: 1, zIndex });
});

function measureOffset(el) {
  const wrapperRect = el.getBoundingClientRect();
  const sectionRect = section.getBoundingClientRect();
  const wrapperCenter = {
    x: wrapperRect.left + wrapperRect.width / 2,
    y: wrapperRect.top + wrapperRect.height / 2,
  };
  const sectionCenter = {
    x: sectionRect.left + sectionRect.width / 2,
    y: sectionRect.top + sectionRect.height / 2,
  };
  return {
    x: wrapperCenter.x - sectionCenter.x,
    y: wrapperCenter.y - sectionCenter.y,
  };
}

const ctx = gsap.context(() => {
  cardEls.forEach(({ wrapper }, i) => {
    const offset = measureOffset(wrapper);
    const init = initial[i];
    wrapper.style.zIndex = init.zIndex;

    gsap.fromTo(
      wrapper,
      {
        x: offset.x,
        y: offset.y,
        scale: init.scale,
        rotation: init.rotation,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
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

window.addEventListener('resize', () => {
  ctx.revert();
  cardEls.forEach(({ wrapper }, i) => {
    const offset = measureOffset(wrapper);
    const init = initial[i];
    gsap.set(wrapper, { x: offset.x, y: offset.y, scale: init.scale, rotation: init.rotation });
  });
  ScrollTrigger.refresh();
});
