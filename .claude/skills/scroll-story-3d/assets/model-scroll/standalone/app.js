import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

const container = document.getElementById('canvas-container')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 5)

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
container.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(10, 10, 5)
scene.add(directionalLight)

const loader = new RGBELoader()
loader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/empty_warehouse_01_1k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture
  scene.environmentIntensity = 0.5
})

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let modelGroup = new THREE.Group()
const modelPosition = new THREE.Vector3(0, -1.3, 0)

const modelUrl = './model.glb'
gltfLoader.load(modelUrl, (gltf) => {
  const model = gltf.scene
  model.scale.setScalar(0.11)
  modelGroup.add(model)
  modelGroup.position.copy(modelPosition)
  scene.add(modelGroup)
}, undefined, (error) => {
  console.warn('Could not load model.glb. Using fallback geometry.', error)
  const fallback = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({ color: 0x7c3a1e, metalness: 0.6, roughness: 0.3 })
  )
  fallback.scale.setScalar(0.8)
  modelGroup.add(fallback)
  modelGroup.position.copy(modelPosition)
  scene.add(modelGroup)
})

let scrollProgress = 0

window.addEventListener('scroll', () => {
  const docEl = document.documentElement
  const scrollTop = window.scrollY || docEl.scrollTop || 0
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    docEl.scrollHeight,
    document.body.offsetHeight,
    docEl.offsetHeight,
    document.body.clientHeight,
    docEl.clientHeight
  )
  const windowHeight = window.innerHeight
  const maxScroll = Math.max(scrollHeight - windowHeight, 1)
  scrollProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1)
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

function animate() {
  requestAnimationFrame(animate)
  if (modelGroup.children.length > 0) {
    modelGroup.rotation.y = scrollProgress * Math.PI * 2
  }
  renderer.render(scene, camera)
}

animate()
