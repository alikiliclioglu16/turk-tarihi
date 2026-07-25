"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";
import { otDokusu } from "@/lib/textures";

/** Bozkır dekoru: ot demetleri, dağınık kayalar, uzak dağ silüetleri */
export function Dekor() {
  const otTex = useMemo(() => otDokusu(), []);

  const otlar = useMemo(() => {
    const liste: { pos: [number, number, number]; s: number; r: number }[] = [];
    for (let i = 0; i < 110; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 8 + Math.random() * 46;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      liste.push({ pos: [x, araziYukseklik(x, z) + 0.3, z], s: 0.7 + Math.random() * 1.2, r: Math.random() * 3 });
    }
    return liste;
  }, []);

  const kayalar = useMemo(() => {
    const liste: { pos: [number, number, number]; s: number; rot: [number, number, number] }[] = [];
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 12 + Math.random() * 46;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      liste.push({
        pos: [x, araziYukseklik(x, z) + 0.15, z],
        s: 0.35 + Math.random() * 0.8,
        rot: [Math.random() * 3, Math.random() * 3, Math.random() * 3],
      });
    }
    return liste;
  }, []);

  const daglar = useMemo(() => {
    const liste: { pos: [number, number, number]; s: [number, number]; rot: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + Math.random() * 0.3;
      const r = 100 + Math.random() * 30;
      liste.push({
        pos: [Math.cos(a) * r, 2, Math.sin(a) * r],
        s: [16 + Math.random() * 18, 13 + Math.random() * 16],
        rot: Math.random() * Math.PI,
      });
    }
    return liste;
  }, []);

  return (
    <>
      {otlar.map((o, i) => (
        <group key={`ot${i}`} position={o.pos} scale={o.s} rotation-y={o.r}>
          <mesh>
            <planeGeometry args={[0.9, 0.62]} />
            <meshStandardMaterial map={otTex} transparent alphaTest={0.35} side={THREE.DoubleSide} roughness={1} color="#93AFA4" />
          </mesh>
          <mesh rotation-y={Math.PI / 2}>
            <planeGeometry args={[0.9, 0.62]} />
            <meshStandardMaterial map={otTex} transparent alphaTest={0.35} side={THREE.DoubleSide} roughness={1} color="#93AFA4" />
          </mesh>
        </group>
      ))}

      {kayalar.map((k, i) => (
        <mesh key={`kaya${i}`} position={k.pos} scale={[k.s, k.s * 0.65, k.s]} rotation={k.rot} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#42506A" roughness={1} flatShading />
        </mesh>
      ))}

      {daglar.map((d, i) => (
        <mesh key={`dag${i}`} position={d.pos} rotation-y={d.rot}>
          <coneGeometry args={[d.s[0], d.s[1], 5]} />
          <meshBasicMaterial color="#101c30" />
        </mesh>
      ))}
    </>
  );
}
