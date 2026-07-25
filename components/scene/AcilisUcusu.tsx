"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";
import { useOyun } from "@/lib/store";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";

/**
 * AÇILIŞ UÇUŞU — kuşbakışı tanıtım
 *
 * Bölüm açıldığında kamera obanın üzerinde geniş bir yay çizer:
 * yüksekten başlar, yerleşimin üzerinden süzülür, ufku ve dört bölgeyi
 * gösterir, sonra yavaşça alçalıp gezginin omzuna iner.
 *
 * Bu sırada Dede Korkut dış ses olarak dönemi anlatır.
 * Öğrenci daha ilk saniyede dünyanın büyüklüğünü görür.
 */

interface Nokta { pos: [number, number, number]; bak: [number, number, number] }

const K = DUNYA_OLCEK;

/** Uçuş rotası — dünya ölçeğine göre */
const ROTA: Nokta[] = [
  { pos: [0, 190, 260 * K * 0.35], bak: [0, 0, 0] },
  { pos: [-90, 130, 120], bak: [0, 10, 40] },
  { pos: [-40, 78, 10], bak: [10, 6, 60] },
  { pos: [60, 92, -30], bak: [-20, 6, 40] },
  { pos: [40, 55, 90], bak: [0, 4, 40] },
  { pos: [8, 22, 70], bak: [0, 3, 46] },
];

/**
 * Uçuş süresi anlatının uzunluğuna göre ayarlanır.
 * Önceden sabit 21 saniyeydi; anlatı bitmeden sahne geçiyordu.
 * AcilisAnlatisi bileşeni gerçek süreyi buraya bildirir.
 */
export const acilisSuresi = { saniye: 21, anlatiBitti: false };

function kubik(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

function egri(noktalar: [number, number, number][], t: number): THREE.Vector3 {
  const n = noktalar.length - 1;
  const x = Math.min(Math.floor(t * n), n - 1);
  const yerel = t * n - x;
  const p = (i: number) => noktalar[Math.max(0, Math.min(n, i))];
  return new THREE.Vector3(
    kubik(p(x - 1)[0], p(x)[0], p(x + 1)[0], p(x + 2)[0], yerel),
    kubik(p(x - 1)[1], p(x)[1], p(x + 1)[1], p(x + 2)[1], yerel),
    kubik(p(x - 1)[2], p(x)[2], p(x + 1)[2], p(x + 2)[2], yerel)
  );
}

export function AcilisUcusu() {
  const { camera } = useThree();
  const faz = useOyun((s) => s.faz);
  const acilisBitti = useOyun((s) => s.acilisBitti);
  const t = useRef(0);
  const bakis = useRef(new THREE.Vector3());

  const konumlar = ROTA.map((r) => r.pos);
  const bakislar = ROTA.map((r) => r.bak);

  useEffect(() => {
    if (faz === "acilis") t.current = 0;
  }, [faz]);

  useFrame((_, delta) => {
    if (faz !== "acilis") return;
    t.current = Math.min(1, t.current + delta / acilisSuresi.saniye);
    // yumuşak giriş-çıkış
    const k = t.current < 0.5
      ? 2 * t.current * t.current
      : 1 - Math.pow(-2 * t.current + 2, 2) / 2;

    const p = egri(konumlar, k);
    const b = egri(bakislar, k);
    // araziye çarpmasın
    const zemin = araziYukseklik(p.x, p.z) + 6;
    camera.position.set(p.x, Math.max(p.y, zemin), p.z);
    bakis.current.set(b.x, b.y, b.z);
    camera.lookAt(bakis.current);
    camera.rotation.z += Math.sin(t.current * 9) * 0.006;

    // uçuş bitse bile anlatı sürüyorsa bekle — son karede yumuşakça asılı kal
    if (t.current >= 1 && acilisSuresi.anlatiBitti) acilisBitti();
  });

  return null;
}
