'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

interface ScatterTextProps {
  text: string
  className?: string
  wrapperClassName?: string
  lineHeight?: number
  fontStyle?: React.CSSProperties
}

export default function ScatterText({
  text,
  className = '',
  wrapperClassName = '',
  lineHeight = 15,
  fontStyle,
}: ScatterTextProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const textEl = textRef.current
    if (!wrapper || !textEl) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time: number) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      function init() {
        const split = new SplitText(textEl, { type: 'chars' })
        const chars = split.chars

        const positions = chars.map((char: HTMLElement) => ({
          left: char.offsetLeft,
          top: char.offsetTop,
        }))

        const wrapperRect = wrapper.getBoundingClientRect()
        const textRect = textEl.getBoundingClientRect()
        const line1X = wrapperRect.width * 0.3
        const line2X = wrapperRect.width * 0.7
        const centerY = wrapperRect.height * 0.5

        const totalChars = chars.length
        const charsPerLine = Math.floor(totalChars * 0.3)

        const indices = Array.from({ length: totalChars }, (_, i) => i)
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[indices[i], indices[j]] = [indices[j], indices[i]]
        }

        const leftLineIndices = indices.slice(0, charsPerLine)
        const rightLineIndices = indices.slice(charsPerLine, charsPerLine * 2)
        const randomIndices = indices.slice(charsPerLine * 2)

        leftLineIndices.sort((a, b) => positions[b].top - positions[a].top)
        rightLineIndices.sort((a, b) => positions[b].top - positions[a].top)
        randomIndices.sort((a, b) => positions[b].top - positions[a].top)

        const charData = new Array(totalChars)
        leftLineIndices.forEach((charIdx: number, lineIdx: number) => {
          charData[charIdx] = { group: 'left', lineIndex: lineIdx }
        })
        rightLineIndices.forEach((charIdx: number, lineIdx: number) => {
          charData[charIdx] = { group: 'right', lineIndex: lineIdx }
        })
        const halfRandom = Math.floor(randomIndices.length / 2)
        randomIndices.forEach((charIdx: number, idx: number) => {
          charData[charIdx] = {
            group: idx < halfRandom ? 'leftBox' : 'rightBox',
            randomIndex: idx < halfRandom ? idx : idx - halfRandom,
          }
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: '+=300%',
            scrub: 1,
            pin: true,
          },
        })

        const totalWidth = line2X - line1X
        const boxWidth = totalWidth / 3
        const boxHeight = charsPerLine * lineHeight
        const boxTop = centerY - (charsPerLine * lineHeight) / 2

        chars.forEach((char: HTMLElement, i: number) => {
          const data = charData[i]
          let startLeft: number, startTop: number, animationDelay: number

          if (data.group === 'left') {
            startLeft = line1X - (textRect.left - wrapperRect.left)
            startTop = boxTop + data.lineIndex * lineHeight - (textRect.top - wrapperRect.top)
            animationDelay = -data.lineIndex * 0.01
          } else if (data.group === 'right') {
            startLeft = line2X - (textRect.left - wrapperRect.left)
            startTop = boxTop + data.lineIndex * lineHeight - (textRect.top - wrapperRect.top)
            animationDelay = -data.lineIndex * 0.01
          } else if (data.group === 'leftBox') {
            startLeft = line1X + Math.random() * boxWidth - (textRect.left - wrapperRect.left)
            startTop = boxTop + Math.random() * boxHeight - (textRect.top - wrapperRect.top)
            animationDelay = -(charsPerLine * 0.01) + data.randomIndex * 0.01
          } else {
            startLeft = line2X - boxWidth + Math.random() * boxWidth - (textRect.left - wrapperRect.left)
            startTop = boxTop + Math.random() * boxHeight - (textRect.top - wrapperRect.top)
            animationDelay = -(charsPerLine * 0.01) + data.randomIndex * 0.01
          }

          gsap.set(char, {
            position: 'absolute',
            left: startLeft,
            top: startTop,
          })

          tl.to(
            char,
            {
              left: positions[i].left,
              top: positions[i].top,
              ease: 'power3.out',
            },
            animationDelay,
          )
        })
      }

      ScrollTrigger.addEventListener('refresh', init)
      init()
    }, wrapper)

    return () => {
      ctx.revert()
      lenis.destroy()
    }
  }, [text, lineHeight])

  return (
    <div
      ref={wrapperRef}
      className={`wrapper ${wrapperClassName}`}
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <p
        ref={textRef}
        className={className}
        style={{
          fontFamily: "'Satoshi', sans-serif",
          fontSize: '1.3vw',
          width: '45%',
          textAlign: 'center',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          paddingBottom: '6vw',
          ...fontStyle,
        }}
      >
        {text}
      </p>
    </div>
  )
}
