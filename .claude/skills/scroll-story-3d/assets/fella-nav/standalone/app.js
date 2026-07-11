gsap.registerPlugin()

const navLinks = [
  { href: '#', label: 'Home' },
  { href: '#', label: 'Work' },
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'About' },
  { href: '#', label: 'Contact' },
]

const refs = {
  nav: document.getElementById('nav'),
  menu: document.getElementById('menu'),
  toggleText: document.getElementById('toggleText'),
  lineTop: document.getElementById('lineTop'),
  lineBottom: document.getElementById('lineBottom'),
  linksContainer: document.getElementById('linksContainer'),
  indicator: document.getElementById('indicator'),
  contactInfo: document.getElementById('contactInfo'),
}

const linkRows = document.querySelectorAll('.menu__link-row')
const links = document.querySelectorAll('.menu__link')
let isOpen = false
let tl = null
let indicatorRotation = 0

function splitTextLines(container) {
  const lines = []
  container.querySelectorAll('[data-split]').forEach(el => {
    const words = el.textContent.trim().split(' ')
    const fragment = document.createDocumentFragment()
    words.forEach((word, i) => {
      const span = document.createElement('span')
      span.className = 'split-line'
      span.textContent = word + (i < words.length - 1 ? '\u00A0' : '')
      span.style.display = 'inline-block'
      gsap.set(span, { y: '100%' })
      fragment.appendChild(span)
    })
    el.innerHTML = ''
    el.appendChild(fragment)
    el.querySelectorAll('.split-line').forEach(s => lines.push(s))
  })
  return lines
}

const allLines = splitTextLines(refs.contactInfo)

function animateToLink(index) {
  const indicator = refs.indicator
  const container = refs.linksContainer
  if (!indicator || !container) return

  if (index >= 0 && linkRows[index]) {
    const containerRect = container.getBoundingClientRect()
    const rowRect = linkRows[index].getBoundingClientRect()
    const targetY = rowRect.top - containerRect.top + (rowRect.height / 2) - (indicator.offsetHeight / 2)
    indicatorRotation += 180

    gsap.to(indicator, {
      x: 0,
      y: targetY,
      rotation: indicatorRotation,
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

  linkRows.forEach((row, i) => {
    const a = row.querySelector('a')
    if (!a) return
    gsap.to(a, {
      x: i === index ? '2.5vw' : '0vw',
      duration: 0.4,
      ease: 'back.out(1.4)',
      overwrite: true,
    })
  })
}

function toggleMenu() {
  isOpen = !isOpen
  if (tl) tl.kill()
  tl = gsap.timeline()

  const activeIndex = 0

  if (isOpen) {
    refs.toggleText.textContent = 'Close'

    gsap.set(refs.indicator, { x: '-2vw', opacity: 0 })
    linkRows.forEach(row => {
      const a = row.querySelector('a')
      if (a) gsap.set(a, { x: '0vw' })
    })

    tl.to(refs.nav, { width: '90vw', duration: 0.5, ease: 'power3.inOut' })
      .to(refs.lineTop, { rotation: 45, y: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
      .to(refs.lineBottom, { rotation: -45, y: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
      .to(refs.menu, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' }, 0.3)
      .to(allLines, { y: '0%', duration: 0.5, stagger: 0.03, ease: 'power3.out' }, 0.5)
      .call(() => animateToLink(activeIndex))
  } else {
    refs.toggleText.textContent = 'Menu'

    tl.to(refs.lineTop, { rotation: 0, y: '-0.3vw', duration: 0.3, ease: 'power2.inOut' }, 0)
      .to(refs.lineBottom, { rotation: 0, y: '0.3vw', duration: 0.3, ease: 'power2.inOut' }, 0)
      .to(refs.menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.5, ease: 'power3.inOut' }, 0)
      .to(refs.nav, { width: '95vw', duration: 0.5, ease: 'power3.inOut' }, 0.3)
      .set(allLines, { y: '100%' }, 0.5)
  }
}

document.getElementById('navToggle').addEventListener('click', toggleMenu)

linkRows.forEach((row, i) => {
  row.addEventListener('mouseenter', () => animateToLink(i))
})

refs.linksContainer.addEventListener('mouseleave', () => animateToLink(0))
