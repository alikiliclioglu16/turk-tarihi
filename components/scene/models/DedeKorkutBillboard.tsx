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

/**
 * Boyalı görselden sahte normal haritası üretir.
 * Parlaklık farkları yükseklik gibi okunur; düz düzlem ışığa hacimliymiş
 * gibi tepki verir. Ateşin yanından geçerken yüzü ve cübbesi gerçekten
 * gölgelenir — düz bir çıkartma gibi durmaz.
 */
function normalHaritasiUret(kaynak: THREE.Texture): THREE.Texture | null {
  const img = kaynak.image as HTMLImageElement | undefined;
  if (!img || !img.width) return null;
  const B = 256;
  const c = document.createElement("canvas");
  c.width = c.height = B;
  const g = c.getContext("2d");
  if (!g) return null;
  g.drawImage(img, 0, 0, B, B);
  const veri = g.getImageData(0, 0, B, B);
  const px = veri.data;

  const yuk = new Float32Array(B * B);
  for (let i = 0; i < B * B; i++) {
    const a = px[i * 4 + 3] / 255;
    const l = (px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114) / 255;
    yuk[i] = a * (0.35 + l * 0.65);
  }

  const cikti = g.createImageData(B, B);
  const kuvvet = 2.4;
  for (let y = 0; y < B; y++) {
    for (let x = 0; x < B; x++) {
      const i = y * B + x;
      const sol = yuk[y * B + Math.max(0, x - 1)];
      const sag = yuk[y * B + Math.min(B - 1, x + 1)];
      const ust = yuk[Math.max(0, y - 1) * B + x];
      const alt = yuk[Math.min(B - 1, y + 1) * B + x];
      const dx = (sol - sag) * kuvvet;
      const dy = (ust - alt) * kuvvet;
      const uz = Math.hypot(dx, dy, 1);
      cikti.data[i * 4] = ((dx / uz) * 0.5 + 0.5) * 255;
      cikti.data[i * 4 + 1] = ((dy / uz) * 0.5 + 0.5) * 255;
      cikti.data[i * 4 + 2] = ((1 / uz) * 0.5 + 0.5) * 255;
      cikti.data[i * 4 + 3] = 255;
    }
  }
  g.putImageData(cikti, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

/** Hafif silindirik bükülmüş düzlem — kenarlar geriye kıvrılır, hacim hissi verir */
function bukukDuzlem(en: number, boy: number): THREE.BufferGeometry {
  const g = new THREE.PlaneGeometry(en, boy, 12, 1);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const n = x / (en / 2); // -1..1
    pos.setZ(i, -(n * n) * en * 0.16);
  }
  g.computeVertexNormals();
  return g;
}

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
  const geometri = useMemo(() => bukukDuzlem(en, BOY), [en]);
  const normalHaritalari = useMemo(() => {
    const m = {} as Record<PozId, THREE.Texture | null>;
    (Object.keys(POZ_DOSYA) as PozId[]).forEach((k) => {
      m[k] = normalHaritasiUret(dokuHarita[k]);
    });
    return m;
  }, [dokuHarita]);

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

      <mesh ref={duzlem} position={[0, BOY / 2, 0]} geometry={geometri} castShadow>
        <meshStandardMaterial
          map={dokuHarita[gorunen]}
          normalMap={normalHaritalari[gorunen] ?? undefined}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          transparent
          alphaTest={0.32}
          roughness={0.92}
          metalness={0}
          side={THREE.DoubleSide}
          emissive="#233047"
          emissiveIntensity={0.28}
        />
      </mesh>
    </group>
  );
}
