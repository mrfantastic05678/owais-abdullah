const overlay = document.getElementById('transition-overlay')
const pathEl = document.getElementById('svg-path')
const pages = document.querySelectorAll('.page')
const links = document.querySelectorAll('.nav-link')

let isTransitioning = false
let currentPage = 'home'

const pathLength = pathEl.getTotalLength()
pathEl.style.strokeDasharray = pathLength
pathEl.style.strokeDashoffset = pathLength

function showPage(pageId) {
  pages.forEach((p) => p.classList.remove('active'))
  document.getElementById(`page-${pageId}`).classList.add('active')
}

function transitionTo(pageId) {
  if (isTransitioning || pageId === currentPage) return
  isTransitioning = true

  gsap.set(pathEl, { strokeWidth: 2, strokeDashoffset: pathLength })

  const tl = gsap.timeline({
    onComplete: () => {
      showPage(pageId)
      currentPage = pageId

      const enterTl = gsap.timeline({
        onComplete: () => {
          gsap.set(pathEl, { strokeDashoffset: pathLength })
          isTransitioning = false
        },
      })

      enterTl
        .to(pathEl, {
          strokeDashoffset: 0,
          strokeWidth: 2,
          duration: 1.5,
          ease: 'power2.inOut',
        })
        .to(
          overlay,
          {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          1,
        )
    },
  })

  tl.to(overlay, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.inOut',
  }).to(
    pathEl,
    {
      strokeDashoffset: 0,
      strokeWidth: 300,
      duration: 1.5,
      ease: 'power2.inOut',
    },
    0,
  )
}

links.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const pageId = link.dataset.page
    transitionTo(pageId)
  })
})

showPage('home')
