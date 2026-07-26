"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { klipSozlugu, klipSec, type OyunKlibi } from "@/lib/klipEsleme";
import { klipleriIsle } from "@/lib/klipIsleme";

/**
 * GENEL KARAKTER — çok örnekli
 *
 * Aynı GLB'den onlarca farklı NPC üretir. Gezginden farkı: burada
 * karakterler ÇOĞALTILIR, bu yüzden `SkeletonUtils.clone` kullanılır.
 * Düz `scene.clone()` giydirilmiş mesh'in iskelet bağını kırar.
 *
 * Her örnek kendi karışımına (mixer) sahiptir; aynı klibi farklı fazda
 * oynatır — kalabalık senkron yürümez.
 */

export interface KarakterAyari {
  /** GLB yolu */
  yol: string;
  /** oynatılacak klip */
  klip: OyunKlibi;
  /** 0-1 arası faz kayması — kalabalık senkron olmasın */
  faz?: number;
  /** boy çarpanı */
  olcek?: number;
  /** kıyafet doku varyantı yolu (varsa) */
  doku?: string | null;
  /** animasyon hız çarpanı */
  tempo?: number;
  /** işe özgü kemik düzeltmesi */
  duzeltme?: KemikDuzeltme | null;
}

/** Animasyon üstüne binen, nesneye özgü el/kol müdahalesi */
export interface KemikDuzeltme {
  /** kemik adı → her karede uygulanacak fonksiyon */
  uygula: (kemikler: Record<string, THREE.Bone>, t: number) => void;
}

export function KarakterGLB({
  yol, klip, faz = 0, olcek = 1, doku = null, tempo = 1, duzeltme = null,
}: KarakterAyari) {
  const grup = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(yol);

  /** Giydirilmiş mesh için DOĞRU kopyalama */
  const kopya = useMemo(() => SkeletonUtils.clone(scene) as THREE.Group, [scene]);

  /** Kliplerden root motion temizlenir, aşırı genlikler kısılır */
  const klipler = useMemo(() => klipleriIsle(animations), [animations]);
  const sozluk = useMemo(() => klipSozlugu(klipler.map((k) => k.name)), [klipler]);

  const mixer = useMemo(() => new THREE.AnimationMixer(kopya), [kopya]);
  const eylemler = useRef<Record<string, THREE.AnimationAction>>({});
  const onceki = useRef<string | null>(null);

  /** Kemik sözlüğü — prosedürel düzeltme için */
  const kemikler = useMemo(() => {
    const k: Record<string, THREE.Bone> = {};
    kopya.traverse((o) => {
      const b = o as THREE.Bone;
      if (b.isBone) k[b.name.replace("mixamorig:", "")] = b;
    });
    return k;
  }, [kopya]);

  /** Doku varyantı ve gölge ayarı */
  useEffect(() => {
    let yeniDoku: THREE.Texture | null = null;
    if (doku) {
      yeniDoku = new THREE.TextureLoader().load(doku);
      yeniDoku.flipY = false;
      yeniDoku.colorSpace = THREE.SRGBColorSpace;
    }
    kopya.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh && !(o as THREE.SkinnedMesh).isSkinnedMesh) return;
      m.castShadow = true;
      m.receiveShadow = false; // kalabalıkta maliyet kırpılır
      m.frustumCulled = false;
      const eski = m.material as THREE.MeshStandardMaterial;
      if (!eski) return;
      const mat = eski.clone();
      mat.roughness = Math.max(0.6, mat.roughness ?? 1);
      mat.metalness = Math.min(0.08, mat.metalness ?? 0);
      if (yeniDoku) mat.map = yeniDoku;
      mat.needsUpdate = true;
      m.material = mat;
    });
    return () => { yeniDoku?.dispose(); };
  }, [kopya, doku]);

  /** Klip değişimi */
  useEffect(() => {
    const ad = klipSec(sozluk, klip);
    if (!ad) return;
    if (!eylemler.current[ad]) {
      const k = klipler.find((x) => x.name === ad);
      if (!k) return;
      eylemler.current[ad] = mixer.clipAction(k);
    }
    const yeni = eylemler.current[ad];
    const donguSuz = klip === "jump";
    yeni.setLoop(donguSuz ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
    yeni.clampWhenFinished = donguSuz;

    if (onceki.current && onceki.current !== ad && eylemler.current[onceki.current]) {
      yeni.reset().setEffectiveWeight(1).play();
      eylemler.current[onceki.current].crossFadeTo(yeni, 0.3, false);
    } else if (onceki.current !== ad) {
      yeni.reset().play();
      // faz kayması: kalabalık aynı anda aynı hareketi yapmasın
      yeni.time = (yeni.getClip().duration * faz) % yeni.getClip().duration;
    }
    onceki.current = ad;
  }, [klip, sozluk, klipler, mixer, faz]);

  useFrame((_, dt) => {
    mixer.update(dt * tempo);
  });

  /** Prosedürel katman — animasyon karışımından SONRA çalışır */
  useFrame(({ clock }) => {
    if (duzeltme) duzeltme.uygula(kemikler, clock.elapsedTime + faz * 10);
  }, 1);

  useEffect(() => () => { mixer.stopAllAction(); }, [mixer]);

  return (
    <group ref={grup} scale={olcek} dispose={null}>
      <primitive object={kopya} />
    </group>
  );
}
