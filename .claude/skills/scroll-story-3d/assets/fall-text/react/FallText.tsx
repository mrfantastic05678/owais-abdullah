'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

type FallTextProps = {
  children: React.ReactNode
  delay?: number
  color?: string
  triggerStart?: string
  triggerEnd?: string
  className?: string
}

export default function FallText({
  children,
  delay = 0,
  color = '#ededed',
  triggerStart = 'top 80%',
  triggerEnd = 'bottom 30%',
  className = '',
}: FallTextProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elementRef.current || !textRef.current) return

    const element = elementRef.current
    const originalText = textRef.current

    const ctx = gsap.context(() => {
      const colorBoxes: HTMLDivElement[] = []

      const split = new SplitText(originalText, { type: 'words' })
      const words = split.words as HTMLElement[]

      colorBoxes.push(
        ...words.map((word) => {
          gsap.set(word, {
            display: 'inline-block',
            position: 'relative',
          })

          const wordRect = word.getBoundingClientRect()

          const colorBox = document.createElement('div')
          colorBox.style.position = 'absolute'
          colorBox.style.top = '0'
          colorBox.style.left = '50%'
          colorBox.style.transform = 'translateX(-50%)'
          colorBox.style.zIndex = '10'
          colorBox.style.width = `${wordRect.width * 1.1}px`
          colorBox.style.height = `${wordRect.height * 0.9}px`
          colorBox.style.background = color
          colorBox.style.borderRadius = '.5vw'
          colorBox.style.pointerEvents = 'none'

          word.appendChild(colorBox)

          return colorBox
        })
      )

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: triggerStart,
          end: triggerEnd,
        },
        delay: delay / 1000,
        onComplete: () => {
          colorBoxes.forEach((box) => {
            box.style.display = 'none'
          })
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
    }, elementRef)

    return () => ctx.revert()
  }, [delay, color, triggerStart, triggerEnd])

  return (
    <div ref={elementRef} className={className}>
      <div ref={textRef}>{children}</div>
    </div>
  )
}
