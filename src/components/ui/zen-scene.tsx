"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
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

function Ground() {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[30, 30, 128, 128]} />
      <meshStandardMaterial
        color="#1a1510"
        roughness={0.92}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Rock({
  position,
  scale,
  seed,
}: {
  position: [number, number, number]
  scale: [number, number, number]
  seed: number
}) {
  const geometry = (() => {
    const g = new THREE.IcosahedronGeometry(1, 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const noise = Math.sin(x * 3 + seed) * 0.15 + Math.cos(z * 2 + seed) * 0.1
      pos.setXYZ(i, x + noise * 0.3, y * 0.6 + noise * 0.1, z + noise * 0.2)
    }
    g.computeVertexNormals()
    return g
  })()

  return (
    <mesh position={position} scale={scale} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#1c1815" roughness={0.97} metalness={0.02} />
    </mesh>
  )
}

function DustParticles() {
  const count = 60
  const meshRef = useRef<THREE.Points>(null)

  const positions = (() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Deterministic positions using index-based math to avoid hydration issues
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

function RakedPatterns() {
  const rings = [2, 3.5, 5, 7, 9]

  return (
    <>
      {rings.map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
          <ringGeometry args={[radius - 0.03, radius + 0.03, 64]} />
          <meshStandardMaterial
            color="#2a2015"
            roughness={0.85}
            transparent
            opacity={0.4 - i * 0.05}
          />
        </mesh>
      ))}
    </>
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

      <ambientLight intensity={0.15} color="#ffeedd" />
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

      <Ground />
      <RakedPatterns />

      <Rock position={[-2.5, 0, -1.5]} scale={[1, 0.6, 0.8]} seed={1} />
      <Rock position={[1.8, 0, -2.5]} scale={[0.6, 0.35, 0.5]} seed={2.7} />
      <Rock position={[0.2, 0, 0.8]} scale={[1.2, 0.8, 1]} seed={4.2} />
      <Rock position={[3.5, 0, 1]} scale={[0.45, 0.28, 0.4]} seed={6.1} />
      <Rock position={[-1.2, 0, 2.5]} scale={[0.7, 0.45, 0.6]} seed={8.3} />

      <DustParticles />
      <MouseCamera />
    </Canvas>
  )
}
