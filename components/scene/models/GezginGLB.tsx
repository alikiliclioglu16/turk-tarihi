"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { klipSozlugu, klipSec, type OyunKlibi } from "@/lib/klipEsleme";

const YOL = "/assets/d01/characters/glb/karakter_gezgin.glb";

interface Props {
  klip: OyunKlibi;
  gecis?: number;
  tempo?: number;
}

/**
 * GEZGİN — gerçek 3B karakter
 *
 * ÖNEMLİ: Giydirilmiş (skinned) mesh `scene.clone()` ile KOPYALANMAZ.
 * Klonlama iskelet bağlarını kırar; mesh ya görünmez ya da bind pozunda
 * donar. Oyuncu karakteri tek örnek olduğu için sahne doğrudan kullanılır.
 *
 * Klip adları Meshy'nin kendi adlandırmasıyla gelir; `klipEsleme.ts`
 * bunları oyunun anlamsal adlarına bağlar.
 */
export function GezginGLB({ klip, gecis = 0.28, tempo = 1 }: Props) {
  const grup = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(YOL);
  const { actions, mixer } = useAnimations(animations, grup);

  const sozluk = useMemo(
    () => klipSozlugu(animations.map((a) => a.name)),
    [animations]
  );

  /** Gölge ve malzeme uyumu — sahne doğrudan kullanılıyor, klonlanmıyor */
  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh && !(o as THREE.SkinnedMesh).isSkinnedMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      m.frustumCulled = false;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && !mat.userData.ayarlandi) {
        mat.userData.ayarlandi = true;
        mat.roughness = Math.max(0.55, mat.roughness ?? 1);
        mat.metalness = Math.min(0.1, mat.metalness ?? 0);
        mat.envMapIntensity = 0.55;
        mat.needsUpdate = true;
      }
    });
  }, [scene]);

  const oncekiKlip = useRef<string | null>(null);

  useEffect(() => {
    const hedefAd = klipSec(sozluk, klip);
    if (!hedefAd || !actions[hedefAd]) return;
    const yeni = actions[hedefAd]!;

    // zıplama gibi döngüsüz klipler son karede kalsın
    const donguSuz = klip === "jump";
    yeni.setLoop(donguSuz ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
    yeni.clampWhenFinished = donguSuz;

    const oncekiAd = oncekiKlip.current;
    if (oncekiAd && oncekiAd !== hedefAd && actions[oncekiAd]) {
      yeni.reset().setEffectiveWeight(1).play();
      actions[oncekiAd]!.crossFadeTo(yeni, gecis, false);
    } else if (oncekiAd !== hedefAd) {
      yeni.reset().fadeIn(gecis).play();
    }
    oncekiKlip.current = hedefAd;
  }, [klip, actions, sozluk, gecis]);

  useFrame(() => {
    const ad = oncekiKlip.current;
    if (!ad || !actions[ad]) return;
    const hareketli = klip === "walk" || klip === "run";
    actions[ad]!.timeScale = hareketli ? Math.max(0.4, tempo) : 1;
  });

  useEffect(() => () => { mixer.stopAllAction(); }, [mixer]);

  return (
    <group ref={grup} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(YOL);
