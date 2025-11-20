"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

const GLASS_COLOR = new THREE.Color("#71f3ff");
const FLESH_COLOR = new THREE.Color("#fe5f73");
const RIND_COLOR = new THREE.Color("#24bd62");

function Knife() {
  const bladeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!bladeRef.current) return;
    const t = state.clock.getElapsedTime();
    const cycle = (Math.sin(t * 0.6) + 1) / 2;
    const eased = cycle * cycle * (3 - 2 * cycle);
    bladeRef.current.position.x = THREE.MathUtils.lerp(1.5, -1.1, eased);
    bladeRef.current.position.y = THREE.MathUtils.lerp(1.2, -0.2, eased);
    bladeRef.current.rotation.z = THREE.MathUtils.degToRad(
      THREE.MathUtils.lerp(-25, 18, eased)
    );
  });

  return (
    <group position={[0, 0.25, 0]}>
      <mesh ref={bladeRef} castShadow>
        <boxGeometry args={[0.08, 2.4, 0.35]} />
        <meshStandardMaterial
          roughness={0.1}
          metalness={0.85}
          color="#f5f5f5"
          envMapIntensity={1.4}
        />
      </mesh>
      <mesh position={[0, -1.25, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.2, 0.8, 20]} />
        <meshStandardMaterial color="#242424" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}

type HalfProps = {
  side: -1 | 1;
};

function WatermelonHalf({ side }: HalfProps) {
  const outerGeometry = useMemo(
    () =>
      new THREE.SphereGeometry(1.1, 128, 128, side === -1 ? 0 : Math.PI, Math.PI),
    [side]
  );
  const innerGeometry = useMemo(
    () =>
      new THREE.SphereGeometry(0.95, 128, 128, side === -1 ? 0 : Math.PI, Math.PI),
    [side]
  );
  const rindGeometry = useMemo(
    () =>
      new THREE.SphereGeometry(
        1.02,
        128,
        128,
        side === -1 ? 0 : Math.PI,
        Math.PI
      ),
    [side]
  );

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const splitCycle = (Math.sin(t * 0.6 - Math.PI / 2) + 1) / 2;
    const eased = splitCycle * splitCycle * (3 - 2 * splitCycle);
    const offset = THREE.MathUtils.lerp(0.05, 0.85, eased);
    groupRef.current.position.x = side * offset;
    groupRef.current.rotation.y = THREE.MathUtils.degToRad(
      side * THREE.MathUtils.lerp(0, 26, eased)
    );
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={outerGeometry} castShadow>
        <meshPhysicalMaterial
          transparent
          transmission={0.98}
          roughness={0.04}
          metalness={0.05}
          thickness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.02}
          color={GLASS_COLOR}
          attenuationColor={GLASS_COLOR}
          attenuationDistance={2.2}
        />
      </mesh>
      <mesh geometry={innerGeometry} receiveShadow>
        <meshPhysicalMaterial
          transparent
          opacity={0.8}
          thickness={1.2}
          roughness={0.25}
          metalness={0.05}
          color={FLESH_COLOR}
          transmission={0.45}
        />
      </mesh>
      <mesh geometry={rindGeometry}>
        <meshStandardMaterial
          color={RIND_COLOR}
          roughness={0.3}
          metalness={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>
      <group position={[side * 0.45, 0.2, 0]}>
        {[...Array(14)].map((_, idx) => {
          const angle = (idx / 14) * Math.PI - Math.PI / 2;
          return (
            <mesh
              key={`${side}-${idx}`}
              position={[
                Math.cos(angle) * 0.35,
                Math.sin(angle) * 0.25,
                side * 0.03,
              ]}
              rotation={[0, side === 1 ? 0.3 : -0.3, 0]}
            >
              <coneGeometry args={[0.02, 0.08, 8]} />
              <meshStandardMaterial color="#0d1f0c" roughness={0.35} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function JuiceDroplets() {
  const particles = useMemo(() => {
    return new Array(60).fill(null).map((_, index) => {
      const radial = 0.2 + Math.random() * 0.4;
      const angle = (index / 60) * Math.PI * 2;
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * radial,
          Math.random() * 0.8,
          Math.sin(angle) * radial
        ),
        scale: 0.015 + Math.random() * 0.025,
        speed: 0.6 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  const refs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    refs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const data = particles[idx];
      const localTime = t * data.speed + data.offset;
      mesh.position.set(
        data.position.x * Math.cos(localTime * 0.6),
        data.position.y + Math.sin(localTime) * 0.2,
        data.position.z * Math.sin(localTime * 0.6)
      );
    });
  });

  return (
    <group>
      {particles.map((particle, idx) => (
        <mesh
          key={idx}
          ref={(instance) => {
            if (instance) refs.current[idx] = instance;
          }}
          scale={particle.scale}
          castShadow
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.9}
            roughness={0.02}
            transmission={0.95}
            thickness={0.4}
            color={GLASS_COLOR}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent() {
  const watermelonGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!watermelonGroup.current) return;
    const t = state.clock.getElapsedTime();
    watermelonGroup.current.rotation.y = Math.sin(t * 0.2) * 0.25;
    watermelonGroup.current.position.y = Math.sin(t * 0.9) * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        intensity={1.6}
        position={[4, 3, 2]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight intensity={0.8} position={[-3, 4, -2]} />
      <group ref={watermelonGroup} position={[0, 0.15, 0]}>
        <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.7}>
          <WatermelonHalf side={-1} />
          <WatermelonHalf side={1} />
          <JuiceDroplets />
        </Float>
      </group>
      <Knife />
      <Sparkles
        count={80}
        size={2}
        speed={0.2}
        opacity={0.6}
        color="#c8fbff"
        scale={[3.5, 3.5, 3.5]}
      />
      <Environment preset="studio">
        <Lightformer
          intensity={4}
          rotation={[0, Math.PI / 2, 0]}
          position={[2.5, 2, -1]}
          scale={[2, 3, 1]}
        />
        <Lightformer
          intensity={3}
          rotation={[0, -Math.PI / 2, 0]}
          position={[-2, 1.5, 2]}
          scale={[1.5, 2.5, 0.5]}
        />
      </Environment>
      <ContactShadows
        opacity={0.45}
        scale={6}
        blur={2.2}
        far={6}
        position={[0, -1.05, 0]}
      />
    </>
  );
}

export function GlassWatermelonScene() {
  return (
    <Canvas
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        alpha: true,
      }}
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 4.5], fov: 32 }}
    >
      <SceneContent />
    </Canvas>
  );
}
