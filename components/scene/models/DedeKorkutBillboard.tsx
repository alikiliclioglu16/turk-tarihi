"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import type { PozId } from "@/lib/pozSecici";

/**
 * DEDE KORKUT — 3B dünyada boyalı 2B karakter (billboard)
 *
 * Neden böyle: GLB üretimi darboğazdı, ama elimizde profesyonel kalitede
 * boyalı pozlar var. Bu teknik onları gerçek 3B dünyaya koyar — karakter
 * sahnenin ışığını alır, zemine gölge düşürür, derinlikte doğru yerde durur.
 * Klasik "2D-in-3D" yöntemi; birçok stilize oyun tam olarak bunu yapar.
 */

const POZ_DOSYA: Record<PozId, string> = {
  pose_01_karsilama: "/assets/d01/characters/dede-korkut/dedekorkut_pose_01_karsilama.webp",
  pose_02_anlatma: "/assets/d01/characters/dede-korkut/dedekorkut_pose_02_anlatma.webp",
  pose_03_isaret: "/assets/d01/characters/dede-korkut/dedekorkut_pose_03_isaret.webp",
  pose_04_dusunme: "/assets/d01/characters/dede-korkut/dedekorkut_pose_04_dusunme.webp",
  pose_05_dinleme: "/assets/d01/characters/dede-korkut/dedekorkut_pose_05_dinleme.webp",
  pose_06_onay: "/assets/d01/characters/dede-korkut/dedekorkut_pose_06_onay.webp",
  pose_07_yonlendirme: "/assets/d01/characters/dede-korkut/dedekorkut_pose_07_yonlendirme.webp",
  pose_08_veda: "/assets/d01/characters/dede-korkut/dedekorkut_pose_08_veda.webp",
};

const BOY = 1.85; // metre — 1024x1536 oranı korunur

interface Props {
  poz: PozId;
  yuruyor: boolean;
  /** karakterin baktığı yön (radyan) — billboard buna göre hafif yatar */
  yon: number;
}

export function DedeKorkutBillboard({ poz, yuruyor, yon }: Props) {
  const grup = useRef<THREE.Group>(null);
  const duzlem = useRef<THREE.Mesh>(null);
  const golge = useRef<THREE.Mesh>(null);

  const yollar = useMemo(() => Object.values(POZ_DOSYA), []);
  const dokular = useLoader(THREE.TextureLoader, yollar);

  const dokuHarita = useMemo(() => {
    const m = {} as Record<PozId, THREE.Texture>;
    (Object.keys(POZ_DOSYA) as PozId[]).forEach((k, i) => {
      const t = dokular[i];
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      m[k] = t;
    });
    return m;
  }, [dokular]);

  /* poz geçişinde yumuşak solma */
  const [gorunen, setGorunen] = useState<PozId>(poz);
  const gecis = useRef(1);
  useEffect(() => {
    if (poz !== gorunen) {
      gecis.current = 0;
      setGorunen(poz);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poz]);

  const en = BOY * (1024 / 1536);

  useFrame(({ camera, clock }, delta) => {
    const t = clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    if (grup.current) {
      // kameraya dön (yalnız Y ekseninde — dik durur)
      const k = camera.position;
      const g = grup.current.position;
      grup.current.rotation.y = Math.atan2(k.x - g.x, k.z - g.z);
    }

    if (duzlem.current) {
      const m = duzlem.current.material as THREE.MeshStandardMaterial;
      // poz geçişi
      gecis.current = Math.min(1, gecis.current + dt * 4.5);
      m.opacity = 0.25 + gecis.current * 0.75;

      // yürürken adım ritmi, dururken nefes
      const zipla = yuruyor ? Math.abs(Math.sin(t * 6.2)) * 0.045 : Math.sin(t * 1.4) * 0.012;
      duzlem.current.position.y = BOY / 2 + zipla;
      // yürüyüş yönüne hafif yatma
      duzlem.current.rotation.z = yuruyor ? Math.sin(t * 6.2) * 0.022 : Math.sin(t * 0.7) * 0.006;
      duzlem.current.scale.x = 1 + (yuruyor ? Math.sin(t * 6.2 + 1) * 0.012 : 0);
    }

    if (golge.current) {
      const s = yuruyor ? 1 + Math.abs(Math.sin(t * 6.2)) * 0.08 : 1;
      golge.current.scale.set(s, s, 1);
    }
  });

  return (
    <group ref={grup}>
      {/* zemin gölgesi — karakteri dünyaya oturtan şey */}
      <mesh ref={golge} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.42, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.42} depthWrite={false} />
      </mesh>

      <mesh ref={duzlem} position={[0, BOY / 2, 0]} castShadow>
        <planeGeometry args={[en, BOY]} />
        <meshStandardMaterial
          map={dokuHarita[gorunen]}
          transparent
          alphaTest={0.32}
          roughness={1}
          metalness={0}
          side={THREE.DoubleSide}
          emissive="#2a3348"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
}
