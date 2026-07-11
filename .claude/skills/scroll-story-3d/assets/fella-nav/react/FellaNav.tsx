'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

type NavLink = { href: string; label: string }

type FellaNavProps = {
  logoText?: string
  links?: NavLink[]
  contactInfo?: { label: string; lines: string[] }[]
  studioLabel?: string
  studioImage?: string
  projectLabel?: string
  projectImage?: string
  accentColor?: string
}

const DEFAULT_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function FellaNav({
  logoText = 'Wolf',
  links = DEFAULT_LINKS,
  contactInfo = [
    { label: 'Contact', lines: ['test@example.com'] },
    { label: 'Team', lines: ['John: john@test.com', 'Jane: jane@test.com'] },
    { label: 'Social', lines: ['Instagram: @random_test_123', 'Linkedin: @test-company', 'Github: @TestUser42'] },
    { label: 'Status', lines: ['Lorem ipsum dolor sit amet', 'Random test data 12345'] },
  ],
  studioLabel = 'About the studio',
  studioImage = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
  projectLabel = 'Feature project',
  projectImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
  accentColor = '#f97316',
}: FellaNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const activeIndex = links.findIndex((link) => link.href === pathname)

  const refs = {
    nav: useRef<HTMLElement>(null),
    menu: useRef<HTMLDivElement>(null),
    topLine: useRef<HTMLSpanElement>(null),
    bottomLine: useRef<HTMLSpanElement>(null),
    links: useRef<(HTMLAnchorElement | null)[]>([]),
    linkRows: useRef<(HTMLDivElement | null)[]>([]),
    indicator: useRef<HTMLDivElement>(null),
    linksContainer: useRef<HTMLDivElement>(null),
    contactInfo: useRef<HTMLDivElement>(null),
    timeline: useRef<gsap.core.Timeline | null>(null),
    splits: useRef<SplitText[]>([]),
    allLines: useRef<HTMLElement[]>([]),
    indicatorRotation: useRef(0),
  }

  useEffect(() => {
    const splits: SplitText[] = []
    const lines: HTMLElement[] = []

    const splitElements = [
      ...refs.links.current.filter(Boolean),
      ...(refs.contactInfo.current?.querySelectorAll('[data-split]') || []),
    ] as HTMLElement[]

    splitElements.forEach((el) => {
      const split = new SplitText(el, {
        type: 'lines',
        linesClass: 'split-line',
      })
      splits.push(split)
      split.lines.forEach((line: HTMLElement) => {
        gsap.set(line, { y: '100%' })
        lines.push(line)
      })
    })

    refs.splits.current = splits
    refs.allLines.current = lines

    return () => {
      refs.timeline.current?.kill()
      splits.forEach((s) => s.revert())
    }
  }, [])

  const animateToLink = (index: number) => {
    const indicator = refs.indicator.current
    const container = refs.linksContainer.current
    if (!indicator || !container) return

    if (index >= 0 && refs.linkRows.current[index]) {
      const containerRect = container.getBoundingClientRect()
      const rowRect = refs.linkRows.current[index]!.getBoundingClientRect()
      const targetY =
        rowRect.top -
        containerRect.top +
        rowRect.height / 2 -
        indicator.offsetHeight / 2

      refs.indicatorRotation.current += 180

      gsap.to(indicator, {
        x: 0,
        y: targetY,
        rotation: refs.indicatorRotation.current,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.4)',
        overwrite: true,
      })
    } else {
      gsap.to(indicator, {
        x: '-2vw',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    refs.linkRows.current.forEach((row, i) => {
      if (!row) return
      gsap.to(row.querySelector('a'), {
        x: i === index ? '2.5vw' : '0vw',
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: true,
      })
    })
  }

  useEffect(() => {
    refs.timeline.current?.kill()
    const tl = gsap.timeline()
    refs.timeline.current = tl

    if (isOpen) {
      gsap.set(refs.indicator.current, { x: '-2vw', opacity: 0 })
      refs.linkRows.current.forEach((row) => {
        if (row) gsap.set(row.querySelector('a'), { x: '0vw' })
      })

      tl.to(refs.nav.current, { width: '90vw', duration: 0.5, ease: 'power3.inOut' })
        .to(refs.topLine.current, { rotation: 45, y: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(refs.bottomLine.current, { rotation: -45, y: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(refs.menu.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' }, 0.3)
        .to(refs.allLines.current, { y: '0%', duration: 0.5, stagger: 0.03, ease: 'power3.out' }, 0.5)
        .call(() => animateToLink(activeIndex))
    } else {
      tl.to(refs.topLine.current, { rotation: 0, y: '-0.3vw', duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(refs.bottomLine.current, { rotation: 0, y: '0.3vw', duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(refs.menu.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.5, ease: 'power3.inOut' }, 0)
        .to(refs.nav.current, { width: '95vw', duration: 0.5, ease: 'power3.inOut' }, 0.3)
        .set(refs.allLines.current, { y: '100%' }, 0.5)
    }
  }, [isOpen, activeIndex])

  return (
    <>
      <nav
        ref={refs.nav}
        className="fixed top-[5%] left-1/2 -translate-x-1/2 w-[95vw] bg-zinc-800 border border-white/10 rounded-md flex items-center justify-between px-[2vw] py-[1.5vw] z-50"
      >
        <p className="text-white text-[1.3vw] font-medium">{logoText}</p>

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex px-[2vw] items-center justify-center gap-[2vw] cursor-pointer"
        >
          <p className="text-white text-[1.3vw] font-medium">
            {isOpen ? 'Close' : 'Menu'}
          </p>

          <div className="relative w-[2vw] h-[1vw]">
            <span
              ref={refs.topLine}
              className="absolute left-0 top-1/2 w-[2vw] h-0.5 bg-white -translate-y-[.3vw]"
            />
            <span
              ref={refs.bottomLine}
              className="absolute left-0 top-1/2 w-[2vw] h-0.5 bg-white translate-y-[.3vw]"
            />
          </div>
        </div>
      </nav>

      <div
        ref={refs.menu}
        className="fixed top-[calc(6vw+5%)] left-1/2 -translate-x-1/2 w-[90vw] bg-zinc-800 border border-white/10 rounded-md z-40 overflow-hidden"
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      >
        <div className="p-[2.5vw] flex">
          <div
            ref={refs.linksContainer}
            className="w-[25%] flex flex-col gap-[.5vw] border-r border-white/10 pr-[2vw] relative"
            onMouseLeave={() => animateToLink(activeIndex)}
          >
            <div
              ref={refs.indicator}
              className="absolute left-0 top-0 size-[1.4vw] opacity-0 pointer-events-none z-10"
              style={{
                background: accentColor,
                transform: 'translateX(-2vw)',
              }}
            />

            {links.map((link, index) => (
              <div
                key={link.href}
                ref={(el) => { refs.linkRows.current[index] = el }}
                className="flex w-fit flex-row items-center"
                onMouseEnter={() => animateToLink(index)}
              >
                <Link
                  ref={(el) => { refs.links.current[index] = el }}
                  href={link.href}
                  className={`text-[2.8vw] font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-orange-500'
                      : 'text-white hover:text-orange-500'
                  }`}
                  style={
                    pathname === link.href
                      ? { color: accentColor }
                      : undefined
                  }
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          <div
            ref={refs.contactInfo}
            className="w-[25%] flex flex-col gap-[1.5vw] px-[2vw] text-white/70 text-[1.1vw]"
          >
            {contactInfo.map((section, i) => (
              <div key={i}>
                <p className="text-white/40 uppercase text-[0.85vw] mb-[0.3vw]">
                  {section.label}
                </p>
                {section.lines.map((line, j) => (
                  <p key={j} data-split>{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="w-[50%] flex gap-[1vw] pl-[2vw]">
            <div className="flex-1 flex flex-col gap-[1vw]">
              <p className="text-white/40 uppercase text-[.85vw]">
                {studioLabel}
              </p>
              <div className="flex-1 rounded-md overflow-hidden">
                <img
                  src={studioImage}
                  alt={studioLabel}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-[1vw]">
              <p className="text-white/40 uppercase text-[0.85vw]">
                {projectLabel}
              </p>
              <div
                className="flex-1 rounded-md overflow-hidden border-2"
                style={{ borderColor: accentColor }}
              >
                <img
                  src={projectImage}
                  alt={projectLabel}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
