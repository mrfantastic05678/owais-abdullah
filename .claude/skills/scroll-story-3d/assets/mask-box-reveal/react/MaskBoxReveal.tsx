'use client'

import { useEffect, useRef, useCallback } from 'react'

interface MaskBox {
  width: string
  height: string
  top: string
  left?: string
  right?: string
}

interface MaskBoxRevealProps {
  videoSrc: string
  masks?: MaskBox[]
  className?: string
  videoClassName?: string
}

const defaultMasks: MaskBox[] = [
  { width: '60vw', height: '35vw', top: '10vh', left: '10vw' },
  { width: '17vw', height: '9vw', top: '5vh', left: '5vw' },
  { width: '35vw', height: '19vw', top: '5vh', right: '5vw' },
  { width: '38vw', height: '22vw', top: '50vh', left: '5vw' },
]

function drawClipped(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  rect: { left: number; top: number; width: number; height: number },
) {
  const videoAspect = video.videoWidth / video.videoHeight
  const windowAspect = window.innerWidth / window.innerHeight

  let displayWidth: number, displayHeight: number, displayX: number, displayY: number

  if (videoAspect > windowAspect) {
    displayHeight = window.innerHeight
    displayWidth = displayHeight * videoAspect
    displayX = (window.innerWidth - displayWidth) / 2
    displayY = 0
  } else {
    displayWidth = window.innerWidth
    displayHeight = displayWidth / videoAspect
    displayX = 0
    displayY = (window.innerHeight - displayHeight) / 2
  }

  const scaleX = video.videoWidth / displayWidth
  const scaleY = video.videoHeight / displayHeight

  const sourceX = (rect.left - displayX) * scaleX
  const sourceY = (rect.top - displayY) * scaleY
  const sourceWidth = rect.width * scaleX
  const sourceHeight = rect.height * scaleY

  ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, rect.width, rect.height)
}

export default function MaskBoxReveal({
  videoSrc,
  masks = defaultMasks,
  className = '',
  videoClassName = '',
}: MaskBoxRevealProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)

  const draw = useCallback(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(draw)
      return
    }

    const maskEls = container.querySelectorAll<HTMLDivElement>('[data-mask]')

    maskEls.forEach((mask) => {
      const canvas = mask.querySelector<HTMLCanvasElement>('canvas')
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const rect = mask.getBoundingClientRect()

      canvas.width = rect.width
      canvas.height = rect.height

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      drawClipped(ctx, video, rect)
    })

    rafRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoaded = () => {
      video.play()
      rafRef.current = requestAnimationFrame(draw)
    }

    video.addEventListener('loadeddata', handleLoaded)

    return () => {
      video.removeEventListener('loadeddata', handleLoaded)
      cancelAnimationFrame(rafRef.current)
    }
  }, [draw])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let dragTarget: HTMLElement | null = null
    let offsetX = 0
    let offsetY = 0

    function handleMouseDown(e: MouseEvent) {
      const mask = (e.target as HTMLElement).closest<HTMLDivElement>('[data-mask]')
      if (!mask) return

      dragTarget = mask
      offsetX = e.clientX - mask.offsetLeft
      offsetY = e.clientY - mask.offsetTop
      mask.style.cursor = 'grabbing'
    }

    function handleMouseMove(e: MouseEvent) {
      if (!dragTarget) return
      dragTarget.style.left = `${e.clientX - offsetX}px`
      dragTarget.style.top = `${e.clientY - offsetY}px`
    }

    function handleMouseUp() {
      if (dragTarget) {
        dragTarget.style.cursor = 'grab'
        dragTarget = null
      }
    }

    container.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative h-screen w-full bg-black overflow-hidden ${className}`}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        autoPlay
        loop
        playsInline
        className={`hidden ${videoClassName}`}
      />

      {masks.map((mask, i) => (
        <div
          key={i}
          data-mask
          style={{
            position: 'fixed',
            width: mask.width,
            height: mask.height,
            top: mask.top,
            left: mask.left,
            right: mask.right,
            border: '1px solid white',
            cursor: 'grab',
            zIndex: 10,
          }}
        >
          <canvas style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
      ))}
    </div>
  )
}
