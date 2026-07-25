"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GUN, gunesKonumu } from "@/lib/gunIsigi";
import { BOLGELER, BOLGE_SIRASI, bolgeAgirliklari } from "@/lib/bolgeler";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";

/**
 * IŞIK VE ATMOSFER — öğlen
 *
 * Ana güneş yukarıdan, gökyüzü ışığı (hemisphere) yumuşak dolgu yapar.
 * Bölgeler arası geçişte yalnız sis yoğunluğu ve tonu değişir; ışık
 * gün boyu tutarlı kalır.
 */
export function BolgeAtmosferi() {
  const { scene } = useThreeScene();
  const gunes = useRef<THREE.DirectionalLight>(null);
  const hedefSis = useRef(new THREE.Color(GUN.sisRenk));
  const gecici = useRef(new THREE.Color());
  const konum = useMemo(() => gunesKonumu(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const p = oyuncuKonumu;
    const w = bolgeAgirliklari(p.x, p.z);

    let sisY = 0;
    hedefSis.current.setRGB(0, 0, 0);
    for (const id of BOLGE_SIRASI) {
      const b = BOLGELER[id];
      const k = w[id];
      gecici.current.set(b.sisRenk);
      hedefSis.current.r += gecici.current.r * k;
      hedefSis.current.g += gecici.current.g * k;
      hedefSis.current.b += gecici.current.b * k;
      sisY += b.sisYogunluk * k;
    }

    const sis = scene.fog as THREE.FogExp2 | null;
    if (sis) {
      sis.color.lerp(hedefSis.current, dt * 1.4);
      sis.density += (sisY - sis.density) * dt * 1.4;
    }

    // güneş gölge kamerası oyuncuyu takip etsin
    if (gunes.current) {
      // gölge kamerası oyuncuyu takip eder; kapsamın merkezinde kalır
      gunes.current.position.set(p.x + konum[0] * 0.42, konum[1] * 0.42, p.z + konum[2] * 0.42);
      gunes.current.target.position.set(p.x, p.y, p.z);
      gunes.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <hemisphereLight
        color={GUN.gokIsigiUst}
        groundColor={GUN.gokIsigiZemin}
        intensity={GUN.gokIsigiGuc}
      />
      <directionalLight
        ref={gunes}
        color={GUN.gunesRenk}
        intensity={GUN.gunesGuc}
        castShadow
        /* Geniş kapsam + yüksek çözünürlük: uzaktaki nesneler de gölge düşürür.
           180 m genişlik / 4096 doku = 4,4 cm texel — yakın gölgeler hâlâ keskin. */
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-camera-near={1}
        shadow-camera-far={420}
        shadow-bias={-0.0009}
        shadow-normalBias={0.05}
      />
    </>
  );
}

/* useThree'yi ayrı sarmalıyoruz ki dosya başında import karmaşası olmasın */
import { useThree } from "@react-three/fiber";
function useThreeScene() {
  const { scene } = useThree();
  return { scene };
}
