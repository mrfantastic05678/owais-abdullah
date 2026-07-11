'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { TransitionRouter } from 'next-transition-router'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(DrawSVGPlugin)

const SVG_PATH_D =
  'M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213'

interface SVGPageTransitionProps {
  children: ReactNode
  strokeColor?: string
  overlayClassName?: string
  leaveDuration?: number
  enterDuration?: number
  maxStrokeWidth?: number
}

export default function SVGPageTransition({
  children,
  strokeColor = '#82A0FF',
  overlayClassName = '',
  leaveDuration = 1.5,
  enterDuration = 1.5,
  maxStrokeWidth = 300,
}: SVGPageTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (pathRef.current) {
      gsap.set(pathRef.current, {
        drawSVG: '0%',
        strokeWidth: 2,
      })
    }
  }, [])

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const tl = gsap.timeline({ onComplete: next })

        tl.to(
          overlayRef.current,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.inOut',
          },
        ).to(
          pathRef.current,
          {
            drawSVG: '100%',
            strokeWidth: maxStrokeWidth,
            duration: leaveDuration,
            ease: 'power2.inOut',
          },
          0,
        )

        return () => tl.kill()
      }}
      enter={(next) => {
        const tl = gsap.timeline({ onComplete: next })

        tl.to(
          pathRef.current,
          {
            drawSVG: '100% 100%',
            strokeWidth: 2,
            duration: enterDuration,
            ease: 'power2.inOut',
          },
        ).to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          1,
        ).set(pathRef.current, {
          drawSVG: '0%',
          strokeWidth: 2,
        })

        return () => tl.kill()
      }}
    >
      <div
        ref={overlayRef}
        className={`fixed inset-0 pointer-events-none flex items-center justify-center opacity-0 ${overlayClassName}`}
        style={{ zIndex: 999 }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1316 664"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ transform: 'scale(1.3)', transformOrigin: 'center' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            ref={pathRef}
            d={SVG_PATH_D}
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {children}
    </TransitionRouter>
  )
}
