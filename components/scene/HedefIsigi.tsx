"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";

/** Sıradaki durağı gösteren ışık sütunu */
export function HedefIsigi({ pos }: { pos: [number, number, number] }) {
  const halka = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!halka.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.15;
    halka.current.scale.set(s, s, 1);
  });

  const y = araziYukseklik(pos[0], pos[2]);

  return (
    <group position={[pos[0], y, pos[2]]}>
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.55, 0.8, 7, 14, 1, true]} />
        <meshBasicMaterial
          color="#F0A44A"
          transparent
          opacity={0.16}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={halka} position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.1, 32]} />
        <meshBasicMaterial color="#F0A44A" transparent opacity={0.75} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}
