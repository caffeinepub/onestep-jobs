import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import type * as THREE from "three";

interface SphereData {
  id: number;
  position: [number, number, number];
  radius: number;
  color: string;
  emissiveIntensity: number;
  phaseOffset: number;
  speed: number;
  driftX: number;
  driftZ: number;
}

const COLORS = [
  "#7c3aed",
  "#6d28d9",
  "#4f46e5",
  "#2563eb",
  "#0d9488",
  "#059669",
  "#10b981",
  "#0891b2",
  "#a78bfa",
  "#34d399",
];

// Seeded pseudo-random so spheres are consistent across renders
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function FloatingSphere({ data }: { data: SphereData }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y =
      data.position[1] + Math.sin(t * data.speed + data.phaseOffset) * 0.35;
    meshRef.current.position.x =
      data.position[0] +
      Math.cos(t * data.speed * 0.65 + data.phaseOffset) * data.driftX;
    meshRef.current.position.z =
      data.position[2] +
      Math.sin(t * data.speed * 0.45 + data.phaseOffset * 1.3) * data.driftZ;
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.rotation.x = t * 0.15;
  });

  return (
    <mesh ref={meshRef} position={data.position}>
      <sphereGeometry args={[data.radius, 20, 20]} />
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={data.emissiveIntensity}
        roughness={0.15}
        metalness={0.7}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  const spheres = useMemo<SphereData[]>(() => {
    return Array.from({ length: 32 }, (_, i) => {
      const r = (n: number) => seededRand(i * 17 + n);
      return {
        id: i,
        position: [
          (r(0) - 0.5) * 12,
          (r(1) - 0.5) * 7,
          (r(2) - 0.5) * 6 - 1,
        ] as [number, number, number],
        radius: 0.05 + r(3) * 0.38,
        color: COLORS[i % COLORS.length],
        emissiveIntensity: 0.5 + r(4) * 0.8,
        phaseOffset: r(5) * Math.PI * 2,
        speed: 0.25 + r(6) * 0.45,
        driftX: 0.1 + r(7) * 0.25,
        driftZ: 0.05 + r(8) * 0.15,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.045;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight
        position={[4, 6, 4]}
        color="#7c3aed"
        intensity={30}
        distance={20}
      />
      <pointLight
        position={[-6, -4, 2]}
        color="#10b981"
        intensity={20}
        distance={18}
      />
      <pointLight
        position={[0, 0, 6]}
        color="#a78bfa"
        intensity={8}
        distance={15}
      />
      {spheres.map((data) => (
        <FloatingSphere key={data.id} data={data} />
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
