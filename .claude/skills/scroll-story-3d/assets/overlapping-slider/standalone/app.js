const slidesData = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", username: "@john_doe", color: '#FFFF00' },
  { text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.", username: "@jane_smith", color: '#55DB9C' },
  { text: "Believe you can and you're halfway there. Your limitation—it's only your imagination.", username: "@mike_wilson", color: '#E9CCFF' },
  { text: "It does not matter how slowly you go as long as you do not stop.", username: "@sarah_jones", color: '#FB4903' },
  { text: "Everything you've ever wanted is on the other side of fear.", username: "@alex_brown", color: '#FFFFFF' },
  { text: "The future belongs to those who believe in the beauty of their dreams.", username: "@emma_davis", color: '#4DA2FF' },
  { text: "In the middle of difficulty lies opportunity.", username: "@chris_taylor", color: '#E9CCFF' },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", username: "@lisa_martin", color: '#FB4903' },
  { text: "Your time is limited, don't waste it living someone else's life.", username: "@david_lee", color: '#55DB9C' },
  { text: "The only impossible journey is the one you never begin.", username: "@amy_chen", color: '#FFB347' },
]

const track = document.getElementById('slider-track')

slidesData.forEach((slide, i) => {
  const card = document.createElement('div')
  card.className = 'slide-card'
  card.style.backgroundColor = slide.color
  card.dataset.index = i
  card.innerHTML = `
    <p class="slide-text">${slide.text}</p>
    <p class="slide-username">${slide.username}</p>
  `
  track.appendChild(card)
})

const slides = [...track.children]
const gap = window.innerWidth * 0.02
const slideWidth = window.innerWidth * 0.3
const totalWidth = slides.length * (slideWidth + gap)
const lastSlideOffset = (slidesData.length - 1) * (slideWidth + gap)
const maxScroll = totalWidth - lastSlideOffset

let current = 0
let target = 0
let isDragging = false
let startX = 0
let startCurrent = 0
let velocity = 0
let momentum = 0
let wasDragging = false
let animId

function setOffset() {
  return window.innerWidth * 0.5 - slideWidth
}

function updateSlides() {
  const vwOffset = window.innerWidth * 0.1

  slides.forEach((slide, i) => {
    const slideLeft = slide.offsetLeft + current
    const bgColor = slidesData[i].color
    const isLast = i === slidesData.length - 1

    if (slideLeft < 0 && !isLast) {
      const ratio = Math.min(1, Math.abs(slideLeft) / slideWidth)
      slide.style.cssText = `
        background-color: ${bgColor};
        border: 2px solid rgba(0,0,0,0.6);
        transform-origin: left 80%;
        transform: translateX(${current + Math.abs(slideLeft) + ratio * vwOffset}px) rotate(${-15 * ratio}deg) scale(${1 - ratio * 0.4});
        position: relative;
        z-index: ${i + 1};
      `
    } else {
      slide.style.cssText = `
        background-color: ${bgColor};
        border: 2px solid rgba(0, 0, 0, 0.6);
        transform: translateX(${current}px);
        z-index: ${i + 1};
      `
    }
  })
}

function animate() {
  current += (target - current) * 0.08
  track.style.transform = `translateX(${current}px)`
  updateSlides()

  if (Math.abs(momentum) > 0.5) {
    target += momentum
    momentum *= 0.96
    target = Math.max(-maxScroll + setOffset(), Math.min(0, target))
  }

  animId = requestAnimationFrame(animate)
}

track.addEventListener('mousedown', (e) => {
  isDragging = true
  wasDragging = false
  startX = e.clientX
  startCurrent = current
  velocity = 0
  momentum = 0
  track.style.cursor = 'grabbing'
})

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return
  const dx = e.clientX - startX
  target = startCurrent + dx
  target = Math.max(-maxScroll + setOffset(), Math.min(0, target))
  velocity = dx
  wasDragging = true
})

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false
    track.style.cursor = 'grab'
    if (wasDragging) {
      momentum = velocity
      wasDragging = false
    }
  }
})

// Touch support
track.addEventListener('touchstart', (e) => {
  isDragging = true
  wasDragging = false
  startX = e.touches[0].clientX
  startCurrent = current
  velocity = 0
  momentum = 0
}, { passive: true })

document.addEventListener('touchmove', (e) => {
  if (!isDragging) return
  const dx = e.touches[0].clientX - startX
  target = startCurrent + dx
  target = Math.max(-maxScroll + setOffset(), Math.min(0, target))
  velocity = dx
  wasDragging = true
}, { passive: true })

document.addEventListener('touchend', () => {
  if (isDragging) {
    isDragging = false
    if (wasDragging) {
      momentum = velocity
      wasDragging = false
    }
  }
})

// Prevent text selection
track.addEventListener('selectstart', (e) => e.preventDefault())
track.style.userSelect = 'none'
track.style.webkitUserSelect = 'none'

animate()
