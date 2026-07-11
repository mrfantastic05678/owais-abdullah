const video = document.getElementById('clip-video')
const masks = document.querySelectorAll('.mask-box')

function drawClipped(ctx, video, rect) {
  const videoAspect = video.videoWidth / video.videoHeight
  const windowAspect = window.innerWidth / window.innerHeight

  let displayWidth, displayHeight, displayX, displayY

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

function draw() {
  masks.forEach((mask) => {
    const canvas = mask.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    const rect = mask.getBoundingClientRect()

    canvas.width = rect.width
    canvas.height = rect.height

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    drawClipped(ctx, video, rect)
  })

  requestAnimationFrame(draw)
}

video.addEventListener('loadeddata', () => {
  video.play()
  draw()
})

masks.forEach((mask) => {
  let isDragging = false
  let offsetX, offsetY

  mask.addEventListener('mousedown', (e) => {
    isDragging = true
    mask.style.cursor = 'grabbing'
    offsetX = e.clientX - mask.offsetLeft
    offsetY = e.clientY - mask.offsetTop
  })

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      mask.style.left = e.clientX - offsetX + 'px'
      mask.style.top = e.clientY - offsetY + 'px'
    }
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
    mask.style.cursor = 'grab'
  })
})
