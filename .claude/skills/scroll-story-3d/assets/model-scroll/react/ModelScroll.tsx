'use client'

import { Suspense, useRef, useState, ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Environment, useGLTF } from '@react-three/drei'
import { useLenis } from 'lenis/react'

interface ModelMeshProps {
  scrollProgress: number
  modelPath?: string
  scale?: number
}

function ModelMesh({ scrollProgress, modelPath = '/model.glb', scale = 0.11 }: ModelMeshProps) {
  const { scene } = useGLTF(modelPath)
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollProgress * Math.PI * 2
    }
  })

  return (
    <group ref={groupRef}>
      <primitive scale={scale} object={scene} />
    </group>
  )
}

function ModelFallback() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1, 0.4, 100, 16]} />
      <meshStandardMaterial color="#7c3a1e" metalness={0.6} roughness={0.3} />
    </mesh>
  )
}

interface ModelViewProps {
  modelPath?: string
  scale?: number
  cameraPosition?: [number, number, number]
  fov?: number
  meshPosition?: [number, number, number]
  environmentPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby'
}

function ModelView({
  modelPath,
  scale,
  cameraPosition = [0, 0, 5],
  fov = 50,
  meshPosition = [0, -1.3, 0],
  environmentPreset = 'sunset',
}: ModelViewProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useLenis(({ progress }: { progress: number }) => {
    setScrollProgress(progress)
  })

  return (
    <section className="h-screen w-full">
      <Canvas camera={{ position: cameraPosition, fov }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset={environmentPreset} environmentIntensity={0.5} />
        <Suspense fallback={<ModelFallback />}>
          <mesh position={meshPosition}>
            <Center>
              {modelPath ? (
                <ModelMesh scrollProgress={scrollProgress} modelPath={modelPath} scale={scale} />
              ) : (
                <ModelFallback />
              )}
            </Center>
          </mesh>
        </Suspense>
      </Canvas>
    </section>
  )
}

interface ContentBlock {
  title: string
  description: string
  align?: 'left' | 'right'
}

interface PageExperienceProps {
  modelPath?: string
  scale?: number
  cameraPosition?: [number, number, number]
  fov?: number
  meshPosition?: [number, number, number]
  environmentPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby'
  heroTitle?: string
  contentBlocks?: ContentBlock[]
  gridLineCount?: number
  gridLineColor?: string
  bgColor?: string
  accentColor?: string
  textColor?: string
  mutedColor?: string
  children?: ReactNode
}

export default function PageExperience({
  modelPath,
  scale,
  cameraPosition,
  fov,
  meshPosition,
  environmentPreset,
  heroTitle = 'Timeless',
  contentBlocks = [
    { title: 'Ancient Artistry', description: 'Discover the beauty of classical sculptures that have withstood the test of time, each piece telling a story of civilizations past.' },
    { title: 'Living History', description: 'Experience the craftsmanship of ancient artisans whose work continues to inspire and captivate audiences worldwide.', align: 'right' },
    { title: 'Eternal Beauty', description: 'Our collection showcases masterpieces from ancient Greece and Rome, preserved through centuries of history.' },
    { title: 'Timeless Elegance', description: 'Each piece in our collection is a testament to the timeless beauty and craftsmanship of ancient civilizations.', align: 'right' },
  ],
  gridLineCount = 5,
  gridLineColor = 'rgba(120, 60, 30, 0.15)',
  bgColor = '#e5e5e5',
  accentColor = '#7c3a1e',
  textColor = 'rgba(120, 60, 30, 0.7)',
  mutedColor = 'rgba(120, 60, 30, 0.7)',
  children,
}: PageExperienceProps) {
  return (
    <section
      className="relative w-full"
      style={{ background: bgColor }}
    >
      <div className="fixed inset-0 z-10">
        <ModelView
          modelPath={modelPath}
          scale={scale}
          cameraPosition={cameraPosition}
          fov={fov}
          meshPosition={meshPosition}
          environmentPreset={environmentPreset}
        />
      </div>

      <div
        className="fixed inset-0 flex justify-evenly pointer-events-none"
        style={{ zIndex: 5 }}
      >
        {Array.from({ length: gridLineCount }).map((_, i) => (
          <div
            key={i}
            className="h-full w-px shrink-0"
            style={{ background: gridLineColor }}
          />
        ))}
      </div>

      <div
        className="h-screen w-full flex items-end p-12"
        style={{ position: 'relative', zIndex: 20 }}
      >
        <h1
          style={{
            fontSize: '12vw',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: accentColor,
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          {heroTitle}
        </h1>
      </div>

      <div
        className="w-full"
        style={{
          padding: '6rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '6rem',
          position: 'relative',
          zIndex: 20,
        }}
      >
        {contentBlocks.map((block, i) => (
          <div
            key={i}
            className="flex p-12"
            style={{ justifyContent: block.align === 'right' ? 'flex-end' : 'flex-start' }}
          >
            <div style={{ maxWidth: '24rem' }}>
              <h2
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  color: accentColor,
                  marginBottom: '1rem',
                }}
              >
                {block.title}
              </h2>
              <p
                style={{
                  fontSize: '1.125rem',
                  color: mutedColor,
                  lineHeight: 1.6,
                }}
              >
                {block.description}
              </p>
            </div>
          </div>
        ))}
        {children}
      </div>
    </section>
  )
}
