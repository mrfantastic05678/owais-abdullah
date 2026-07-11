'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_PX_STEPS = [2, 5, 6, 8, 100]

type PixelImageProps = {
  children: React.ReactNode
  pxSteps?: number[]
  triggerStart?: string
  speed?: number
  initialDelay?: number
  className?: string
  style?: React.CSSProperties
}

export default function PixelImage({
  children,
  pxSteps = DEFAULT_PX_STEPS,
  triggerStart = 'top+=20% bottom',
  speed = 80,
  initialDelay = 300,
  className = '',
  style = {},
}: PixelImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    pxIndex: 0,
    imgRatio: 1,
    img: null as HTMLImageElement | null,
  })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const hiddenImg = container.querySelector<HTMLImageElement>(
      'img[data-pixel-src]'
    )
    const state = stateRef.current
    if (!hiddenImg) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = hiddenImg.getAttribute('data-pixel-src') || hiddenImg.src
    state.img = img

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

      const size = pxSteps[state.pxIndex] * 0.01
      ctx.imageSmoothingEnabled = size === 1
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, 0, 0, w * size, h * size)
      ctx.drawImage(
        canvas,
        0,
        0,
        w * size,
        h * size,
        newX,
        newY,
        newWidth,
        newHeight
      )
    }

    function animatePixels() {
      if (state.pxIndex < pxSteps.length) {
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

    return () => {
      window.removeEventListener('resize', render)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [pxSteps, triggerStart, speed, initialDelay])

  const wrappedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return null
    const isImgTag = child.type === 'img'
    const isNextImage =
      typeof child.type === 'function' &&
      (child.type.displayName === 'Image' ||
        child.type.name === 'Image')

    if (isImgTag || isNextImage) {
      return cloneElement(child as React.ReactElement<any>, {
        'data-pixel-src': (child as React.ReactElement<any>).props.src,
        style: {
          ...(child as React.ReactElement<any>).props.style,
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
        },
      })
    }
    return child
  })

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden opacity-0 ${className}`}
      style={style}
    >
      {wrappedChildren}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full"
      />
    </div>
  )
}
