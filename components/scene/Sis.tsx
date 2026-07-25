"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lekeDokusu } from "@/lib/textures";

/**
 * ZEMİN SİSİ — hacimsel sisin ucuz karşılığı
 *
 * Zemine yakın, yavaşça sürüklenen yumuşak katmanlar. Gerçek volumetrik
 * hesaplama yerine katmanlı saydam düzlemler kullanır; derinlik hissini
 * ve ışığın "içinden geçtiği hava" duygusunu verir.
 */
export function Sis() {
  const grup = useRef<THREE.Group>(null);
  const leke = useMemo(() => lekeDokusu(), []);

  const katmanlar = useMemo(
    () =>
      Array.from({ length: 12 }, () => {
        const a = Math.random() * Math.PI * 2;
        const r = 6 + Math.random() * 42;
        return {
          pos: [Math.cos(a) * r, 0.35 + Math.random() * 0.9, Math.sin(a) * r] as [number, number, number],
          olcek: 7 + Math.random() * 13,
          hiz: 0.06 + Math.random() * 0.1,
          faz: Math.random() * Math.PI * 2,
          opak: 0.05 + Math.random() * 0.07,
        };
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!grup.current) return;
    const t = clock.elapsedTime;
    grup.current.children.forEach((c, i) => {
      const k = katmanlar[i];
      c.position.x = k.pos[0] + Math.sin(t * k.hiz + k.faz) * 3.5;
      c.position.z = k.pos[2] + Math.cos(t * k.hiz * 0.7 + k.faz) * 2.5;
      c.position.y = k.pos[1] + Math.sin(t * 0.25 + k.faz) * 0.15;
    });
  });

  return (
    <group ref={grup}>
      {katmanlar.map((k, i) => (
        <sprite key={i} position={k.pos} scale={[k.olcek, k.olcek * 0.42, 1]}>
          <spriteMaterial
            map={leke}
            color="#8fa5c8"
            transparent
            opacity={k.opak}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </sprite>
      ))}
    </group>
  );
}
