'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, Stats } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Fluid } from '@whatisjery/react-fluid-distortion'
import { degToRad } from 'three/src/math/MathUtils'
import * as THREE from 'three'

type FluidDistortionProps = {
  fluidColor?: string
  curl?: number
  modelPath?: string
  useFallback?: boolean
  showStats?: boolean
  children?: React.ReactNode
}

function Model({ modelPath, useFallback }: { modelPath: string; useFallback: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })

  if (useFallback) {
    return (
      <group ref={groupRef}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusKnotGeometry args={[0.9, 0.3, 192, 36]} />
          <meshPhysicalMaterial
            color="#9977ff"
            metalness={0.05}
            roughness={0.25}
            clearcoat={1}
            clearcoatRoughness={0.15}
            emissive="#4422aa"
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[1.25, 0.015, 24, 80]} />
          <meshBasicMaterial color="#6644ff" transparent opacity={0.25} />
        </mesh>
      </group>
    )
  }

  const { scene } = useGLTF(modelPath)
  return (
    <primitive
      ref={groupRef}
      object={scene}
      scale={0.008}
      rotation-y={degToRad(180)}
    />
  )
}

export default function FluidDistortion({
  fluidColor = '#1b1b1b',
  curl = 30,
  modelPath = '/model.glb',
  useFallback = false,
  showStats = false,
  children,
}: FluidDistortionProps) {
  return (
    <header className="relative h-screen w-full bg-black">
      <div className="absolute inset-0 size-full">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <Environment preset="studio" environmentIntensity={1} />
          <Model modelPath={modelPath} useFallback={useFallback} />
          {showStats && <Stats />}
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.3} />
            <Fluid fluidColor={fluidColor} curl={curl} />
          </EffectComposer>
        </Canvas>
      </div>
      {children && (
        <div className="relative z-5 flex size-full items-center justify-between px-10 py-5">
          {children}
        </div>
      )}
    </header>
  )
}
