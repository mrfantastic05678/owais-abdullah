gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({ duration: 1.2, touchMultiplier: 2, smoothTouch: true })

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

const DEFAULT_PX_STEPS = [2, 5, 6, 8, 100]

function initPixelImage(container) {
  const canvas = document.createElement('canvas')
  canvas.style.position = 'absolute'
  canvas.style.inset = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  container.appendChild(canvas)

  const hiddenImg = container.querySelector('img')
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = hiddenImg.src
  hiddenImg.setAttribute('data-pixel-src', hiddenImg.src)
  hiddenImg.style.position = 'absolute'
  hiddenImg.style.opacity = '0'
  hiddenImg.style.pointerEvents = 'none'

  const ctx = canvas.getContext('2d')
  const state = { pxIndex: 0, imgRatio: 1, img: null, pxSteps: DEFAULT_PX_STEPS }
  state.img = img

  const triggerStart = container.getAttribute('data-trigger') || 'top+=20% bottom'
  const speed = parseInt(container.getAttribute('data-speed') || '80', 10)
  const initialDelay = parseInt(container.getAttribute('data-delay') || '300', 10)

  function render() {
    const cw = container.offsetWidth
    const ch = container.offsetHeight
    canvas.width = cw
    canvas.height = ch

    const w = cw * 1.05
    const h = ch * 1.05
    let newWidth = w
    let newHeight = h
    let newX = 0
    let newY = 0

    if (w / h > state.imgRatio) {
      newHeight = Math.round(w / state.imgRatio)
    } else {
      newWidth = Math.round(h * state.imgRatio)
      newX = (w - newWidth) / 2
    }

    const size = state.pxSteps[state.pxIndex] * 0.01
    ctx.imageSmoothingEnabled = size === 1
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, 0, 0, w * size, h * size)
    ctx.drawImage(canvas, 0, 0, w * size, h * size, newX, newY, newWidth, newHeight)
  }

  function animatePixels() {
    if (state.pxIndex < state.pxSteps.length) {
      setTimeout(() => {
        render()
        state.pxIndex++
        animatePixels()
      }, state.pxIndex === 0 ? initialDelay : speed)
    }
  }

  img.onload = () => {
    state.imgRatio = img.width / img.height
    render()

    window.addEventListener('resize', render)

    ScrollTrigger.create({
      trigger: container,
      start: triggerStart,
      onEnter: animatePixels,
      once: true,
    })

    ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      onEnter: () => gsap.set(container, { opacity: 1 }),
      once: true,
    })
  }
}

document.querySelectorAll('.pixel-image').forEach(initPixelImage)
