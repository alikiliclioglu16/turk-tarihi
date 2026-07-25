"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BOLGELER, BOLGE_SIRASI, bolgeAgirliklari } from "@/lib/bolgeler";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";

/**
 * BÖLGE ATMOSFERİ
 *
 * Oyuncu bölgeler arasında yürürken sis rengi, yoğunluğu, ortam ışığı ve
 * ay gücü yumuşakça harmanlanır. Sert bir "bölge değişti" anı yoktur;
 * manzara yürüdükçe kendiliğinden dönüşür.
 */
export function BolgeAtmosferi() {
  const { scene } = useThree();
  const ortam = useRef<THREE.AmbientLight>(null);
  const ay = useRef<THREE.DirectionalLight>(null);
  const gecici = useRef(new THREE.Color());
  const hedefSis = useRef(new THREE.Color("#0b1322"));
  const hedefOrtam = useRef(new THREE.Color("#2c3d63"));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const p = oyuncuKonumu;
    const w = bolgeAgirliklari(p.x, p.z);

    let sisY = 0, ortamG = 0, ayG = 0;
    hedefSis.current.setRGB(0, 0, 0);
    hedefOrtam.current.setRGB(0, 0, 0);

    for (const id of BOLGE_SIRASI) {
      const b = BOLGELER[id];
      const k = w[id];
      gecici.current.set(b.sisRenk);
      hedefSis.current.r += gecici.current.r * k;
      hedefSis.current.g += gecici.current.g * k;
      hedefSis.current.b += gecici.current.b * k;
      gecici.current.set(b.ortamRenk);
      hedefOrtam.current.r += gecici.current.r * k;
      hedefOrtam.current.g += gecici.current.g * k;
      hedefOrtam.current.b += gecici.current.b * k;
      sisY += b.sisYogunluk * k;
      ortamG += b.ortamGuc * k;
      ayG += b.ayGuc * k;
    }

    const sis = scene.fog as THREE.FogExp2 | null;
    if (sis) {
      sis.color.lerp(hedefSis.current, dt * 1.6);
      sis.density += (sisY - sis.density) * dt * 1.6;
    }
    if (ortam.current) {
      ortam.current.color.lerp(hedefOrtam.current, dt * 1.6);
      ortam.current.intensity += (ortamG - ortam.current.intensity) * dt * 1.6;
    }
    if (ay.current) {
      ay.current.intensity += (ayG - ay.current.intensity) * dt * 1.6;
    }
  });

  return (
    <>
      <ambientLight ref={ortam} color="#2c3d63" intensity={0.35} />
      <directionalLight
        ref={ay}
        color="#93abda"
        intensity={0.6}
        position={[-45, 55, -35]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-bias={-0.0004}
        shadow-normalBias={0.022}
      />
    </>
  );
}
