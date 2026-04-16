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

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float t = uTime * 0.15;

  vec2 mouse = (uMouse - 0.5) * vec2(aspect, 1.0);
  float mouseDist = length(p - mouse);
  float mouseInfluence = smoothstep(0.6, 0.0, mouseDist);

  // Layer 1: Flowing raked sand lines
  float lineFreq = 25.0;
  float lineWarp = snoise(vec2(uv.y * 3.0 + t, uv.x * 0.5)) * 1.5;
  float mouseWarp = mouseInfluence * sin(mouseDist * 20.0 - uTime * 1.5) * 0.8;
  float lines = sin((uv.x + lineWarp + mouseWarp) * lineFreq) * 0.5 + 0.5;
  lines = smoothstep(0.3, 0.7, lines);

  // Layer 2: Large flowing noise field
  float flow1 = snoise(p * 1.5 + vec2(t * 0.5, t * 0.3)) * 0.5 + 0.5;
  float flow2 = snoise(p * 2.5 + vec2(-t * 0.3, t * 0.4)) * 0.5 + 0.5;
  float flow = mix(flow1, flow2, 0.5);

  // Layer 3: Concentric zen ripples from center
  float centerDist = length(p);
  float ripple = sin(centerDist * 12.0 - uTime * 0.8) * 0.5 + 0.5;
  ripple *= smoothstep(1.2, 0.0, centerDist);

  // Layer 4: Mouse proximity glow
  float glow = exp(-mouseDist * mouseDist * 8.0) * 0.6;

  vec3 ink = vec3(0.031, 0.024, 0.051);
  vec3 inkLight = vec3(0.055, 0.043, 0.082);
  vec3 warmDark = vec3(0.35, 0.18, 0.05);
  vec3 warmMid = vec3(0.75, 0.42, 0.12);
  vec3 warmLight = vec3(1.0, 0.65, 0.28);

  vec3 color = ink;
  color = mix(color, inkLight, lines * 0.4);
  color = mix(color, warmDark, lines * flow * 0.15);
  color = mix(color, inkLight, flow * 0.12);
  color = mix(color, warmDark, ripple * 0.08);
  color = mix(color, warmMid, glow * 0.5);
  color = mix(color, warmLight, glow * mouseInfluence * 0.3);
  color = mix(color, warmDark, lines * mouseInfluence * 0.25);

  float vignette = 1.0 - smoothstep(0.4, 1.4, centerDist);
  color *= 0.7 + vignette * 0.3;

  float grain = (fract(sin(dot(uv * uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.03;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}
`

function ZenShader() {
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
    mat.uniforms.uTime.value = clock.getElapsedTime()
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

export function ZenScene({ className }: { className?: string }) {
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
      <ZenShader />
    </Canvas>
  )
}
