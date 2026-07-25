"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Hotspot } from "@/lib/types";
import { araziYukseklik } from "@/lib/terrain";
import { useOyun } from "@/lib/store";
import { tik } from "@/lib/audio";

interface Props {
  hotspot: Hotspot;
  gezildi: boolean;
}

export function HotspotMarker({ hotspot, gezildi }: Props) {
  const grup = useRef<THREE.Group>(null);
  const hotspotAc = useOyun((s) => s.hotspotAc);
  const renk = gezildi ? "#4BB3A9" : "#F0A44A";

  useFrame(({ clock, camera }) => {
    if (!grup.current) return;
    const t = clock.elapsedTime;
    const s = 1 + Math.sin(t * 3.2) * 0.12;
    grup.current.scale.setScalar(s);
    grup.current.lookAt(camera.position);
  });

  const [x, y, z] = hotspot.position;
  const zemin = araziYukseklik(x, z);

  return (
    <group position={[x, Math.max(y, zemin + 0.6), z]}>
      <group
        ref={grup}
        onClick={(e) => {
          e.stopPropagation();
          tik();
          hotspotAc(hotspot.id);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <mesh>
          <ringGeometry args={[0.26, 0.36, 28]} />
          <meshBasicMaterial color={renk} transparent opacity={0.95} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.14, 20]} />
          <meshBasicMaterial color={renk} transparent opacity={0.9} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
      <pointLight color={renk} intensity={2.5} distance={3} />
    </group>
  );
}
