"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
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

  /**
   * Karışım drei'nin useAnimations'ı ile kuruluyor.
   * Elle AnimationMixer kurmak bu bileşende çalışmadı; useAnimations
   * hem mixer'ı hem güncelleme döngüsünü kendisi yönetiyor.
   */
  const { actions, mixer } = useAnimations(klipler, grup);
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
    if (!ad || !actions[ad]) return;
    const yeni = actions[ad]!;
    const donguSuz = klip === "jump";
    yeni.setLoop(donguSuz ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
    yeni.clampWhenFinished = donguSuz;
    yeni.timeScale = tempo;

    const oncekiAd = onceki.current;
    if (oncekiAd && oncekiAd !== ad && actions[oncekiAd]) {
      yeni.reset().setEffectiveWeight(1).play();
      actions[oncekiAd]!.crossFadeTo(yeni, 0.3, false);
    } else if (oncekiAd !== ad) {
      yeni.reset().play();
      // faz kayması: kalabalık aynı anda aynı hareketi yapmasın
      const sure = yeni.getClip().duration;
      yeni.time = (sure * faz) % sure;
    }
    onceki.current = ad;
  }, [klip, sozluk, actions, faz, tempo]);

  /**
   * SON ÇARE
   *
   * Klip eşlemesi tutmazsa hiçbir eylem başlamaz; figür bind pozunda
   * donar. Bu durumda sözlükteki ilk klibi çalıştır — donuk T-pozundan
   * her zaman iyidir.
   */
  useEffect(() => {
    const z = window.setTimeout(() => {
      if (onceki.current && actions[onceki.current]?.isRunning()) return;
      const ilkAd = Object.keys(actions)[0];
      if (!ilkAd || !actions[ilkAd]) return;
      actions[ilkAd]!.reset().play();
      onceki.current = ilkAd;
    }, 300);
    return () => window.clearTimeout(z);
  }, [actions]);

  /** Prosedürel katman — animasyon karışımından SONRA çalışır */
  /**
   * PROSEDÜREL KATMAN
   *
   * KRİTİK: `ekle()` kemik dönüşüne EKLEME yapar. Bu yalnız animasyon
   * karışımı her karede dönüşleri SIFIRLADIĞI için güvenlidir.
   *
   * Animasyon çalışmıyorsa (klip bulunamadı, eylem duraklatıldı) ekleme
   * sonsuza kadar birikir — saniyede 60 kez. Birkaç saniyede kemikler
   * çılgına döner; figür "deli dana gibi" hareket eder.
   *
   * Bu yüzden düzeltme YALNIZ etkin bir eylem varken uygulanır.
   */
  useFrame(({ clock }) => {
    const ad = onceki.current;
    const eylem = ad ? actions[ad] : null;

    /* ---------- 1. KATMAN: eylem yoksa veya durduysa yeniden başlat ----------
       Klip bulunamaz veya eylem duraklarsa animasyon durur, kemikler bind
       pozunda kalır. Bu durumda düzeltme uygulanırsa birikir. Önce eylemi
       geri başlatmayı dene. */
    if (!eylem) return;
    if (!eylem.isRunning()) {
      eylem.reset().play();
      return;   // bu karede düzeltme yok
    }

    /* ---------- 2. KATMAN: kemik dönüşlerini sınırla ----------
       Birikme olursa bile açı asla kontrolden çıkmaz. Normal bir kemik
       ±2,2 radyanı (126°) aşmaz; aşıyorsa birikme var demektir. */
    for (const b of Object.values(kemikler)) {
      const r = b.rotation;
      if (Math.abs(r.x) > 2.2 || Math.abs(r.y) > 2.2 || Math.abs(r.z) > 2.2) {
        r.set(
          THREE.MathUtils.clamp(r.x, -2.2, 2.2),
          THREE.MathUtils.clamp(r.y, -2.2, 2.2),
          THREE.MathUtils.clamp(r.z, -2.2, 2.2)
        );
      }
    }

    if (duzeltme) duzeltme.uygula(kemikler, clock.elapsedTime + faz * 10);
  });

  useEffect(() => () => { mixer.stopAllAction(); }, [mixer]);

  return (
    <group ref={grup} scale={olcek} dispose={null}>
      <primitive object={kopya} />
    </group>
  );
}
