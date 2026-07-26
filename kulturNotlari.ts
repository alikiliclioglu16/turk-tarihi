"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { useOyun } from "@/lib/store";

/**
 * ALTIN YOL
 *
 * Discovery Tour'un imzası: oyuncunun önünde yerde akan, sıradaki durağa
 * götüren ışıklı şerit. Araziyi takip eder, oyuncu hareket ettikçe
 * kendini yeniden çizer ve üzerinde ışık dalgası akar.
 */

const ADIM = 40;          // şeridi kaç parçaya bölelim
const GENISLIK = 1.5;     // metre

export function AltinYol() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const faz = useOyun((s) => s.faz);
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const nod = nodlar[aktifIndex];

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1, ADIM, 1);
    g.rotateX(-Math.PI / 2);
    return g;
  }, [])

  const doku = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 8; c.height = 128;
    const x = c.getContext("2d")!;
    const grad = x.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0.0, "rgba(255,205,110,0.0)");
    grad.addColorStop(0.25, "rgba(255,214,130,0.75)");
    grad.addColorStop(0.5, "rgba(255,236,190,0.95)");
    grad.addColorStop(0.75, "rgba(255,214,130,0.75)");
    grad.addColorStop(1.0, "rgba(255,205,110,0.0)");
    x.fillStyle = grad; x.fillRect(0, 0, 8, 128);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1, 6);
    return t;
  }, []);

  useFrame(({ clock }, delta) => {
    const m = mesh.current;
    if (!m || !nod) return;

    const hedef = nod.world.guidePosition;
    const bx = oyuncuKonumu.x, bz = oyuncuKonumu.z;
    const dx = hedef[0] - bx, dz = hedef[2] - bz;
    const uz = Math.hypot(dx, dz);

    const goster = (faz === "gezinti" || faz === "kesif") && uz > 3;
    m.visible = goster;
    if (!goster) return;

    // şeridi araziye oturt — hafif yay çizerek
    const pos = m.geometry.attributes.position as THREE.BufferAttribute;
    const yon = { x: dx / uz, z: dz / uz };
    const dik = { x: -yon.z, z: yon.x };
    const gorunurUz = Math.min(uz, 90);

    for (let i = 0; i <= ADIM; i++) {
      const t = i / ADIM;
      const d = 1.4 + t * (gorunurUz - 1.4);
      // hafif S kıvrımı — düz çizgi yerine yol hissi
      const kivrim = Math.sin(t * Math.PI) * Math.min(6, uz * 0.06);
      const cx = bx + yon.x * d + dik.x * kivrim;
      const cz = bz + yon.z * d + dik.z * kivrim;
      const y = araziYukseklik(cx, cz) + 0.08;
      for (const yan of [0, 1]) {
        const idx = yan * (ADIM + 1) + i;
        const w = GENISLIK * (yan === 0 ? -0.5 : 0.5);
        pos.setXYZ(idx, cx + dik.x * w, y, cz + dik.z * w);
      }
    }
    pos.needsUpdate = true;
    m.geometry.computeBoundingSphere();

    if (mat.current?.map) {
      mat.current.map.offset.y -= delta * 0.55; // ışık akışı
      mat.current.opacity = 0.55 + Math.sin(clock.elapsedTime * 2.2) * 0.12;
    }
  });

  return (
    <mesh ref={mesh} geometry={geo} frustumCulled={false} renderOrder={2}>
      <meshBasicMaterial
        ref={mat}
        map={doku}
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
