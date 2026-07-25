"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";
import { zeminDokusu } from "@/lib/textures";

export function Terrain() {
  const tex = useMemo(() => zeminDokusu(), []);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(880, 880, 220, 220);
    const pos = g.attributes.position;
    const renkler = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = -pos.getY(i);
      pos.setZ(i, araziYukseklik(x, z));
      const d = Math.sqrt(x * x + z * z);
      const yakin = Math.max(0, 1 - d / 90);
      const benek =
        0.86 + Math.sin(x * 0.33) * Math.cos(z * 0.29) * 0.1 + Math.sin(x * 1.3 + z * 0.9) * 0.05;
      renkler[i * 3] = (0.30 + yakin * 0.34) * benek;
      renkler[i * 3 + 1] = (0.36 + yakin * 0.16) * benek;
      renkler[i * 3 + 2] = (0.46 - yakin * 0.18) * benek;
    }
    g.setAttribute("color", new THREE.BufferAttribute(renkler, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial map={tex} vertexColors roughness={1} />
    </mesh>
  );
}
