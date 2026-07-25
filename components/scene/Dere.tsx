"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SU_KOTU } from "@/lib/terrain";

/** Dere yüzeyi — su başı bölgesinde akan, hafif dalgalanan şerit */
const YOL: [number, number][] = [
  [86, -8], [80, 6], [70, 18], [60, 28], [52, 34], [44, 40],
];

export function Dere() {
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  const parcalar = useMemo(() => {
    const liste: { pos: [number, number, number]; aci: number; uz: number }[] = [];
    for (let i = 0; i < YOL.length - 1; i++) {
      const [ax, az] = YOL[i];
      const [bx, bz] = YOL[i + 1];
      const uz = Math.hypot(bx - ax, bz - az);
      liste.push({
        pos: [(ax + bx) / 2, SU_KOTU, (az + bz) / 2],
        aci: Math.atan2(bx - ax, bz - az),
        uz: uz + 1.5,
      });
    }
    return liste;
  }, []);

  useFrame(({ clock }) => {
    if (mat.current) {
      // yüzeyde hafif parıltı dalgalanması
      mat.current.roughness = 0.1 + Math.sin(clock.elapsedTime * 0.6) * 0.05;
    }
  });

  return (
    <group>
      {parcalar.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[-Math.PI / 2, 0, -p.aci]} receiveShadow>
          <planeGeometry args={[9.5, p.uz]} />
          {i === 0 ? (
            <meshStandardMaterial
              ref={mat}
              color="#1E3A4A"
              roughness={0.12}
              metalness={0.55}
              transparent
              opacity={0.85}
            />
          ) : (
            <meshStandardMaterial
              color="#1E3A4A"
              roughness={0.14}
              metalness={0.55}
              transparent
              opacity={0.85}
            />
          )}
        </mesh>
      ))}
    </group>
  );
}
