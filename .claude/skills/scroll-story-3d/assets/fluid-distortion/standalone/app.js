import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const container = document.getElementById('canvas-container')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100)
camera.position.set(0, 0, 6)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
container.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 0.8

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444466, 2)
scene.add(hemiLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 3)
dirLight.position.set(5, 10, 7)
scene.add(dirLight)

const rimLight = new THREE.DirectionalLight(0x8866ff, 1)
rimLight.position.set(-5, -1, 5)
scene.add(rimLight)

const group = new THREE.Group()

const knotGeo = new THREE.TorusKnotGeometry(0.9, 0.3, 192, 36)
const knotMat = new THREE.MeshPhysicalMaterial({
  color: 0x9977ff,
  metalness: 0.05,
  roughness: 0.25,
  clearcoat: 1,
  clearcoatRoughness: 0.15,
  emissive: 0x4422aa,
  emissiveIntensity: 0.1,
  envMapIntensity: 1,
})
const knot = new THREE.Mesh(knotGeo, knotMat)
knot.rotation.x = Math.PI / 4
group.add(knot)

const ringGeo = new THREE.TorusGeometry(1.25, 0.015, 24, 80)
const ringMat = new THREE.MeshBasicMaterial({
  color: 0x6644ff,
  transparent: true,
  opacity: 0.25,
})
const ring = new THREE.Mesh(ringGeo, ringMat)
ring.rotation.x = Math.PI / 2.5
group.add(ring)

scene.add(group)

const clock = new THREE.Clock()

function resize() {
  const w = container.clientWidth
  const h = container.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

window.addEventListener('resize', resize)

function animate() {
  const t = clock.getElapsedTime()
  group.rotation.y = t * 0.2
  knot.rotation.z = Math.sin(t * 0.25) * 0.08
  ring.rotation.y = t * 0.1
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
