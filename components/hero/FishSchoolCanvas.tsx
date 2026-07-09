"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { HeroFallbackAnimation } from "@/components/hero/HeroFallbackAnimation";

type FishConfig = {
  id: number;
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  drift: number;
  color: string;
  accent: string;
  opacity: number;
  standout?: boolean;
};

type FishSchoolCanvasProps = {
  enableParallax?: boolean;
};

function makeFishConfigs() {
  const fish: FishConfig[] = [];

  for (let index = 0; index < 26; index += 1) {
    const row = index % 5;
    const column = Math.floor(index / 5);
    fish.push({
      id: index,
      position: [
        -1.6 + column * 0.56 + Math.sin(index * 1.9) * 0.18,
        1.05 - row * 0.46 + Math.cos(index * 1.3) * 0.12,
        -0.2 - (index % 4) * 0.12,
      ],
      scale: 0.6 + (index % 4) * 0.08,
      speed: 0.42 + (index % 6) * 0.045,
      phase: index * 0.72,
      drift: 0.12 + (index % 5) * 0.024,
      color: index % 3 === 0 ? "#DFF7FF" : "#BFEFE3",
      accent: index % 4 === 0 ? "#FFD1CA" : "#DFF7FF",
      opacity: 0.44 + (index % 4) * 0.05,
    });
  }

  fish.push({
    id: 99,
    position: [0.8, -0.18, 0.24],
    scale: 1.08,
    speed: 0.5,
    phase: 1.2,
    drift: 0.22,
    color: "#FF6B5F",
    accent: "#FFD1CA",
    opacity: 0.92,
    standout: true,
  });

  return fish;
}

function Fish({ config }: { config: FishConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const elapsed = performance.now() / 1000;
    const wave = Math.sin(elapsed * config.speed + config.phase);

    if (groupRef.current) {
      groupRef.current.position.x = config.position[0] + wave * config.drift;
      groupRef.current.position.y =
        config.position[1] + Math.cos(elapsed * 0.64 + config.phase) * 0.045;
      groupRef.current.rotation.z = wave * 0.035;
    }

    if (tailRef.current) {
      tailRef.current.rotation.z =
        Math.sin(elapsed * 2.8 + config.phase) *
        (config.standout ? 0.22 : 0.16);
    }
  });

  return (
    <group
      ref={groupRef}
      position={config.position}
      scale={config.scale}
      rotation={[0, 0, -0.02]}
    >
      <mesh ref={tailRef} position={[-0.24, 0, 0]}>
        <shapeGeometry
          args={[
            new THREE.Shape([
              new THREE.Vector2(0, 0),
              new THREE.Vector2(-0.28, 0.18),
              new THREE.Vector2(-0.21, 0),
              new THREE.Vector2(-0.28, -0.18),
            ]),
          ]}
        />
        <meshBasicMaterial
          color={config.accent}
          transparent
          opacity={config.opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh scale={[1.38, 0.62, 1]}>
        <circleGeometry args={[0.22, 8]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={config.opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0.19, 0.04, 0.01]}>
        <circleGeometry args={[0.026, 8]} />
        <meshBasicMaterial color="#061826" transparent opacity={0.84} />
      </mesh>
      {config.standout ? (
        <mesh position={[-0.02, -0.08, 0.012]} scale={[1.05, 0.22, 1]}>
          <circleGeometry args={[0.16, 8]} />
          <meshBasicMaterial color="#FFD1CA" transparent opacity={0.5} />
        </mesh>
      ) : null}
    </group>
  );
}

function LightRays() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = performance.now() / 1000;
    groupRef.current.position.x = Math.sin(elapsed * 0.12) * 0.08;
    groupRef.current.rotation.z = Math.sin(elapsed * 0.08) * 0.03;
  });

  return (
    <group ref={groupRef} position={[0.45, 0.28, -1.2]}>
      {[-0.9, -0.3, 0.34].map((offset, index) => (
        <mesh
          key={offset}
          position={[offset, 0.35 - index * 0.12, 0]}
          rotation={[0, 0, -0.34]}
          scale={[0.18 + index * 0.04, 3.3, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={index === 2 ? "#FFD1CA" : "#DFF7FF"}
            transparent
            opacity={index === 2 ? 0.035 : 0.055}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function FishScene({ enableParallax }: FishSchoolCanvasProps) {
  const fish = useMemo(() => makeFishConfigs(), []);
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = performance.now() / 1000;
    const parallaxX = enableParallax ? pointer.x * 0.08 : 0;
    const parallaxY = enableParallax ? pointer.y * 0.06 : 0;

    groupRef.current.position.x = parallaxX + Math.sin(elapsed * 0.16) * 0.035;
    groupRef.current.position.y = parallaxY + Math.cos(elapsed * 0.12) * 0.03;
  });

  return (
    <>
      <color attach="background" args={["#061826"]} />
      <ambientLight intensity={0.85} />
      <LightRays />
      <group ref={groupRef} position={[0.25, 0, 0]}>
        {fish.map((config) => (
          <Fish key={config.id} config={config} />
        ))}
      </group>
    </>
  );
}

export default function FishSchoolCanvas({
  enableParallax = true,
}: FishSchoolCanvasProps) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Canvas
        tabIndex={-1}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        }}
        camera={{ position: [0, 0, 3.2], fov: 42 }}
        fallback={<HeroFallbackAnimation className="h-full max-w-none" />}
        onCreated={({ gl }) => {
          gl.setClearColor("#061826", 0);
        }}
      >
        <FishScene enableParallax={enableParallax} />
      </Canvas>
    </div>
  );
}
