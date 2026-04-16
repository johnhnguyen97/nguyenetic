"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment } from "@react-three/drei"
import * as THREE from "three"

function MouseCamera() {
  const target = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 3, 0.03)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 4 + pointer.y * 1.5, 0.03)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7 - Math.abs(pointer.x) * 0.5, 0.03)
    camera.lookAt(target.current)
  })

  return null
}

function GardenModel() {
  const { scene } = useGLTF("/assets/models/zen-garden.glb")

  return (
    <primitive
      object={scene}
      scale={0.5}
      position={[0, -0.5, 0]}
      receiveShadow
      castShadow
    />
  )
}

useGLTF.preload("/assets/models/zen-garden.glb")

function DustParticles() {
  const count = 60
  const meshRef = useRef<THREE.Points>(null)

  const positions = (() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (((i * 7 + 3) % 20) - 10)
      arr[i * 3 + 1] = ((i * 3) % 4)
      arr[i * 3 + 2] = (((i * 11 + 5) % 20) - 10)
    }
    return arr
  })()

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.02
    const pos = meshRef.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i)
      pos.setY(i, y + Math.sin(t + i * 0.5) * 0.002)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ff8a3d"
        size={0.06}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

export function ZenScene({ className }: { className?: string }) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 4, 7], fov: 40 }}
      shadows
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.8,
      }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#0a0f1a", 6, 22]} />
      <Environment files="/assets/hdri/night.hdr" background={false} />

      <ambientLight intensity={0.05} color="#ffeedd" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        color="#ff8a3d"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#ff8a3d" distance={12} />
      <pointLight position={[-3, 2, -2]} intensity={0.2} color="#ff6b1a" distance={8} />

      <GardenModel />
      <DustParticles />
      <MouseCamera />
    </Canvas>
  )
}
