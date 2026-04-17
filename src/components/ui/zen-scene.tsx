"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

// Simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Distance to nearest "stone" for concentric arcs
float stoneField(vec2 p) {
  // Three implied stone positions creating concentric rake patterns
  vec2 s1 = vec2(-0.35, -0.10);
  vec2 s2 = vec2(0.28, 0.15);
  vec2 s3 = vec2(0.05, -0.30);
  float d = min(length(p - s1), min(length(p - s2), length(p - s3)));
  return d;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float t = uTime * 0.08;

  // Mouse in world space
  vec2 mouse = (uMouse - 0.5) * vec2(aspect, 1.0);
  float mouseDist = length(p - mouse);
  float mouseInfluence = smoothstep(0.5, 0.0, mouseDist);

  // === Concentric rake patterns around implied stones ===
  float stoneD = stoneField(p);
  float rakeFreq = 55.0;
  float rakeWarp = snoise(p * 2.5 + vec2(t, t * 0.7)) * 0.02;
  float rakeLines = sin((stoneD + rakeWarp) * rakeFreq) * 0.5 + 0.5;
  rakeLines = smoothstep(0.4, 0.6, rakeLines);
  // Fade lines far from stones (outer area is mostly smooth sand)
  rakeLines *= smoothstep(1.2, 0.2, stoneD);

  // === Large slow dune noise -- breaks up the flatness of empty sand ===
  float dune = snoise(p * 1.2 + vec2(t * 0.3, -t * 0.2)) * 0.5 + 0.5;

  // === Fine sand grain -- high-frequency subtle texture ===
  float grain1 = snoise(p * 60.0) * 0.5 + 0.5;
  float grain2 = snoise(p * 140.0 + vec2(7.3, 2.1)) * 0.5 + 0.5;
  float grain = grain1 * 0.6 + grain2 * 0.4;

  // === Mouse proximity: reveals rake lines more strongly ===
  float mouseReveal = mouseInfluence;

  // === Colors -- COOL NEUTRAL SAND, not amber ===
  vec3 ink = vec3(0.031, 0.024, 0.051);              // deep ink blue-black
  vec3 sandDeep = vec3(0.11, 0.095, 0.078);          // deepest sand shadow
  vec3 sandMid = vec3(0.185, 0.165, 0.135);          // midtone sand
  vec3 sandHigh = vec3(0.26, 0.23, 0.19);            // highlight sand
  vec3 warmGlow = vec3(1.0, 0.58, 0.22);             // warm amber -- mouse glow only

  // Base ink -> sand transition based on dune (creates darker/lighter zones)
  vec3 color = mix(ink, sandDeep, dune * 0.6);
  color = mix(color, sandMid, dune * 0.8);

  // Rake line ridges -- lighter sand color where ridges lift
  color = mix(color, sandHigh, rakeLines * 0.5);

  // Extra reveal near mouse
  color = mix(color, sandHigh, rakeLines * mouseReveal * 0.4);
  color = mix(color, mix(sandHigh, warmGlow, 0.4), mouseReveal * 0.3);

  // Fine grain adds texture
  color += (grain - 0.5) * 0.025;

  // Warm mouse glow spot (gaussian falloff)
  float glowFalloff = exp(-mouseDist * mouseDist * 6.0);
  color += warmGlow * glowFalloff * 0.22;

  // Vignette darkens edges toward pure ink
  float centerDist = length(p);
  float vignette = smoothstep(1.5, 0.3, centerDist);
  color = mix(ink, color, vignette * 0.85 + 0.15);

  // Subtle film grain overlay
  float filmGrain = fract(sin(dot(uv * (uTime * 10.0 + 1.0), vec2(12.9898, 78.233))) * 43758.5453);
  color += (filmGrain - 0.5) * 0.015;

  gl_FragColor = vec4(color, 1.0);
}
`

function ZenShader({ animated }: { animated: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size.width, size.height],
  )

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.ShaderMaterial
    if (animated) {
      mat.uniforms.uTime.value = clock.getElapsedTime()
    }
    mat.uniforms.uMouse.value.set(
      (pointer.x + 1) * 0.5,
      (pointer.y + 1) * 0.5,
    )
    mat.uniforms.uResolution.value.set(size.width, size.height)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}

export function ZenScene({ className, animated = true }: { className?: string; animated?: boolean }) {
  return (
    <Canvas
      className={className}
      gl={{
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      }}
      style={{ background: "#080618" }}
      camera={{ position: [0, 0, 1] }}
    >
      <ZenShader animated={animated} />
    </Canvas>
  )
}
