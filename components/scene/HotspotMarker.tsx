"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Hotspot } from "@/lib/types";
import { araziYukseklik } from "@/lib/terrain";
import { useOyun } from "@/lib/store";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { tik } from "@/lib/audio";

const ACILMA_MESAFESI = 5.5; // metre — bu kadar yaklaşınca kendiliğinden açılır

/**
 * KEŞİF NOKTASI
 *
 * Tıklamaya gerek yok. Oyuncu yaklaştığında nokta kendiliğinden açılır;
 * Discovery Tour'daki gibi yürümek yeterlidir.
 */
export function HotspotMarker({ hotspot, gezildi }: { hotspot: Hotspot; gezildi: boolean }) {
  const grup = useRef<THREE.Group>(null);
  const halka = useRef<THREE.Mesh>(null);
  const acildi = useRef(gezildi);
  const hotspotAc = useOyun((s) => s.hotspotAc);

  useEffect(() => { acildi.current = gezildi; }, [gezildi]);

  const [x, y, z] = hotspot.position;
  const zemin = araziYukseklik(x, z);
  const yy = Math.max(y, zemin + 0.9);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    if (halka.current) {
      const s = 1 + Math.sin(t * 2.6) * 0.14;
      halka.current.scale.set(s, s, 1);
    }
    if (grup.current) grup.current.lookAt(camera.position);

    // yakınlık tetikleyici
    const d = Math.hypot(oyuncuKonumu.x - x, oyuncuKonumu.z - z);
    if (!acildi.current && d < ACILMA_MESAFESI) {
      acildi.current = true;
      tik();
      hotspotAc(hotspot.id);
    }
  });

  const renk = gezildi ? "#7FD8CE" : "#FFCF72";

  return (
    <group position={[x, yy, z]}>
      <group ref={grup}>
        <mesh ref={halka}>
          <ringGeometry args={[0.34, 0.48, 30]} />
          <meshBasicMaterial color={renk} transparent opacity={0.9}
            side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.17, 20]} />
          <meshBasicMaterial color={renk} transparent opacity={0.85}
            side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      {/* zemin halkası */}
      <mesh position={[0, zemin - yy + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.25, 28]} />
        <meshBasicMaterial color={renk} transparent opacity={0.35}
          side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
