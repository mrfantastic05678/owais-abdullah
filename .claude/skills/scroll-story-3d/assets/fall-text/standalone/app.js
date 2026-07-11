gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({ duration: 1.2, touchMultiplier: 2, smoothTouch: true })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

function initFallText(container) {
  const color = container.getAttribute('data-color') || '#ededed'
  const delay = parseFloat(container.getAttribute('data-delay') || '0') / 1000
  const textEl = container.querySelector('h1, h2')

  if (!textEl) return

  const words = textEl.textContent.trim().split(/\s+/)
  textEl.innerHTML = words
    .map((word) => `<span class="fall-word">${word}</span>`)
    .join(' ')

  const colorBoxes = []
  textEl.querySelectorAll('.fall-word').forEach((wordEl) => {
    const rect = wordEl.getBoundingClientRect()
    const box = document.createElement('div')
    box.className = 'fall-color-box'
    box.style.cssText = `
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      width: ${rect.width * 1.1}px;
      height: ${rect.height * 0.9}px;
      background: ${color};
      border-radius: 0.5vw;
      pointer-events: none;
    `
    wordEl.style.position = 'relative'
    wordEl.style.display = 'inline-block'
    wordEl.appendChild(box)
    colorBoxes.push(box)
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      end: 'bottom 30%',
    },
    delay: delay,
    onComplete: () => {
      colorBoxes.forEach((box) => { box.style.display = 'none' })
    },
  })

  tl.to(colorBoxes, {
    y: () => gsap.utils.random(1200, 1600),
    x: () => gsap.utils.random(-150, 150),
    rotation: () => gsap.utils.random(-360, 360),
    duration: 1,
    ease: 'power2.in',
    stagger: 0.02,
  })
}

document.querySelectorAll('.fall-text').forEach(initFallText)
