"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";

/** Durağın yerini gösteren altın ışık sütunu — Discovery Tour tarzı */
export function DurakIsigi({ pos }: { pos: [number, number, number] }) {
  const sutun = useRef<THREE.Mesh>(null);
  const halka = useRef<THREE.Mesh>(null);
  const y = araziYukseklik(pos[0], pos[2]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (halka.current) {
      const s = 1 + Math.sin(t * 2.4) * 0.13;
      halka.current.scale.set(s, s, 1);
      (halka.current.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(t * 2.4) * 0.2;
    }
    if (sutun.current) {
      sutun.current.rotation.y = t * 0.35;
      (sutun.current.material as THREE.MeshBasicMaterial).opacity = 0.22 + Math.sin(t * 1.7) * 0.06;
    }
  });

  return (
    <group position={[pos[0], y, pos[2]]}>
      <mesh ref={sutun} position={[0, 6, 0]}>
        <cylinderGeometry args={[0.9, 1.4, 12, 16, 1, true]} />
        <meshBasicMaterial
          color="#FFD98A" transparent opacity={0.22}
          side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={halka} position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2.1, 40]} />
        <meshBasicMaterial
          color="#FFCF72" transparent opacity={0.6}
          side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
