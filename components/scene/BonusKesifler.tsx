"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BONUS_KESIFLER } from "@/lib/bonusKesifler";
import { useOyun } from "@/lib/store";
import { tik } from "@/lib/audio";

/** Obada dolaşırken bulunabilen küçük keşif işaretleri */
export function BonusKesifler() {
  const bulunan = useOyun((s) => s.bulunanBonuslar);
  const bonusBul = useOyun((s) => s.bonusBul);
  const faz = useOyun((s) => s.faz);
  const grup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!grup.current) return;
    const t = clock.elapsedTime;
    grup.current.children.forEach((c, i) => {
      c.position.y = (c.userData.temelY as number) + Math.sin(t * 1.6 + i) * 0.13;
      c.rotation.y = t * 0.7 + i;
    });
  });

  // görev sırasında dikkat dağıtmasın
  if (faz === "gorev" || faz === "odul" || faz === "anlati") return null;

  return (
    <group ref={grup}>
      {BONUS_KESIFLER.map((b) => {
        const acildi = bulunan.includes(b.id);
        return (
          <group
            key={b.id}
            position={b.pos}
            userData={{ temelY: b.pos[1] }}
            onClick={(e) => {
              e.stopPropagation();
              tik();
              bonusBul(b.id);
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          >
            <mesh>
              <octahedronGeometry args={[acildi ? 0.11 : 0.15, 0]} />
              <meshBasicMaterial
                color={acildi ? "#4BB3A9" : "#F0D48A"}
                transparent
                opacity={acildi ? 0.5 : 0.95}
              />
            </mesh>
            {!acildi && <pointLight color="#F0D48A" intensity={1.6} distance={2.6} />}
            {/* tıklama alanını büyütmek için görünmez küre */}
            <mesh visible={false}>
              <sphereGeometry args={[0.55, 8, 8]} />
              <meshBasicMaterial />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
