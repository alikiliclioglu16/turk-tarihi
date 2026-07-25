"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik, DUNYA_YARICAP } from "@/lib/terrain";

/**
 * SINIR KUŞAĞI
 *
 * Dünyanın kenarını görünür kılan kaya ve tepe kuşağı. Oyuncu buraya
 * ulaştığında "burası dünyanın kenarı" olduğunu görür; görünmez bir
 * duvara çarpmış gibi hissetmez.
 */
export function SinirKusagi() {
  const kayaRef = useRef<THREE.InstancedMesh>(null);
  const yazildi = useRef(false);

  const veri = useMemo(() => {
    let t = 5150;
    const r = () => { t = (t * 1103515245 + 12345) & 0x7fffffff; return t / 0x7fffffff; };
    const liste: { p: [number, number, number]; s: number; rot: [number, number, number] }[] = [];
    const adet = 260;
    for (let i = 0; i < adet; i++) {
      const a = (i / adet) * Math.PI * 2 + r() * 0.06;
      const d = DUNYA_YARICAP + 6 + r() * 55;
      const x = Math.cos(a) * d;
      const z = Math.sin(a) * d;
      const s0 = 5 + r() * 9;
      liste.push({
        // kayanın YARISI toprağa gömülü olmalı — yoksa havada asılı durur
        p: [x, araziYukseklik(x, z) - s0 * 0.34, z],
        s: s0,
        rot: [r() * 0.4, r() * 3, r() * 0.4],
      });
    }
    return liste;
  }, []);

  useFrame(() => {
    if (yazildi.current) return;
    const im = kayaRef.current;
    if (!im) return;
    const g = new THREE.Object3D();
    veri.forEach((k, i) => {
      g.position.set(...k.p);
      g.rotation.set(...k.rot);
      g.scale.set(k.s, k.s * (0.55 + (i % 5) * 0.08), k.s);
      g.updateMatrix();
      im.setMatrixAt(i, g.matrix);
    });
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
    yazildi.current = true;
  });

  return (
    <instancedMesh ref={kayaRef} args={[undefined, undefined, veri.length]} castShadow receiveShadow frustumCulled>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6B6555" roughness={1} flatShading />
    </instancedMesh>
  );
}
