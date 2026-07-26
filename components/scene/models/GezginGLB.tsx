"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { klipSozlugu, klipSec, type OyunKlibi } from "@/lib/klipEsleme";

const YOL = "/assets/d01/characters/glb/karakter_gezgin.glb";

interface Props {
  /** oyun durumuna göre istenen klip */
  klip: OyunKlibi;
  /** geçiş süresi (sn) */
  gecis?: number;
  /** yürüyüş hızına göre animasyon temposu */
  tempo?: number;
}

/**
 * GEZGİN — gerçek 3B karakter
 *
 * Meshy'den gelen riglenmiş GLB. Prosedürel modelin yerini alır.
 *
 * Klip adları Meshy'nin kendi adlandırmasıyla geliyor
 * ("Walking", "Chair_Sit_Idle_M"); `klipEsleme.ts` bunları oyunun
 * anlamsal adlarına bağlar. GLB'yi yeniden adlandırmaya gerek yok.
 *
 * Eksik klipler için yedek zinciri devrede: `jump` yoksa `run`,
 * o da yoksa `idle` çalınır.
 */
export function GezginGLB({ klip, gecis = 0.28, tempo = 1 }: Props) {
  const grup = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(YOL);
  const { actions, mixer } = useAnimations(animations, grup);

  /** GLB klip adları → oyun klipleri */
  const sozluk = useMemo(
    () => klipSozlugu(animations.map((a) => a.name)),
    [animations]
  );

  /** Gölge ve malzeme ayarları — bir kez */
  const kopya = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const m = o as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
        m.frustumCulled = false;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat) {
          // Sahne ışığına uyum: aşırı parlaklık kırılır
          mat.roughness = Math.max(0.55, mat.roughness ?? 1);
          mat.metalness = Math.min(0.1, mat.metalness ?? 0);
          mat.envMapIntensity = 0.55;
        }
      }
    });
    return s;
  }, [scene]);

  const oncekiKlip = useRef<string | null>(null);

  useEffect(() => {
    const hedefAd = klipSec(sozluk, klip);
    if (!hedefAd || !actions[hedefAd]) return;
    const yeni = actions[hedefAd];

    if (oncekiKlip.current && oncekiKlip.current !== hedefAd) {
      const eski = actions[oncekiKlip.current];
      if (eski) {
        yeni.reset().setEffectiveWeight(1).play();
        eski.crossFadeTo(yeni, gecis, false);
      } else {
        yeni.reset().fadeIn(gecis).play();
      }
    } else if (!oncekiKlip.current) {
      yeni.reset().fadeIn(gecis).play();
    }
    oncekiKlip.current = hedefAd;
  }, [klip, actions, sozluk, gecis]);

  /** Yürüyüş temposu hıza göre ayarlanır — kayma hissi olmasın */
  useFrame(() => {
    const ad = oncekiKlip.current;
    if (!ad || !actions[ad]) return;
    const hareketli = klip === "walk" || klip === "run";
    actions[ad]!.timeScale = hareketli ? Math.max(0.4, tempo) : 1;
  });

  useEffect(() => () => { mixer.stopAllAction(); }, [mixer]);

  return (
    <group ref={grup} dispose={null}>
      <primitive object={kopya} />
    </group>
  );
}

useGLTF.preload(YOL);
