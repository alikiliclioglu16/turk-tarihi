"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { SoftShadows, AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, N8AO, Vignette, SMAA } from "@react-three/postprocessing";

import { SahneAtmosferi } from "./Environment";
import { Terrain } from "./Terrain";
import { Player } from "./Player";
import { YakinVarliklar } from "./YakinVarliklar";
import { Halk } from "./Halk";
import { BuyukOba } from "./BuyukOba";
import { GirilebilirOtag } from "./GirilebilirOtag";
import { Suru } from "./Suru";
import { HotspotMarker } from "./HotspotMarker";
import { HedefIsigi } from "./HedefIsigi";
import { Dekor } from "./Dekor";
import { AtesEfekti } from "./AtesEfekti";
import { IBL } from "./IBL";
import { Sis } from "./Sis";
import { BonusKesifler } from "./BonusKesifler";
import { BolgeAtmosferi } from "./BolgeAtmosferi";
import { Dere } from "./Dere";
import { RenkDerecelendirme } from "./RenkDerecelendirme";
import { useOyun } from "@/lib/store";

export function D01Scene() {
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const faz = useOyun((s) => s.faz);
  const gezilen = useOyun((s) => s.gezilenHotspotlar);
  const nod = nodlar[aktifIndex];

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ fov: 54, near: 0.1, far: 900, position: [0, 6, 20] }}
      gl={{
        antialias: false, // SMAA devrede
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        powerPreference: "high-performance",
      }}
    >
      <PerformanceMonitor onDecline={() => { /* düşük başarımda dpr otomatik iner */ }} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <IBL />
        {/* PCSS yumuşak gölgeler: temasta keskin, uzaklaştıkça yumuşayan */}
        <SoftShadows size={9} samples={8} focus={0.75} />
        <SahneAtmosferi />
        <BolgeAtmosferi />
        <Dere />
        <Terrain />
        <Dekor />
        <Sis />
        <AtesEfekti pos={[0, 0, 0]} />

        <YakinVarliklar />
        <BuyukOba />
        <Halk />
        {/* girilebilir otağlar — kapıdan içeri girilir, çatı saydamlaşır */}
        <GirilebilirOtag pos={[-27, -14]} rotY={0.75} olcek={1.5} tur="bey" />
        <GirilebilirOtag pos={[36, 23]} rotY={-0.6} olcek={1.25} tur="aile" />
        <GirilebilirOtag pos={[-84, 52]} rotY={2.0} olcek={1.2} tur="usta" />
        <GirilebilirOtag pos={[52, -76]} rotY={1.4} olcek={1.2} tur="aile" />
        <Suru />

        <Player baslangic={[0, 0, 46]} />
        <BonusKesifler />

        {faz === "gezinti" && nod && <HedefIsigi pos={nod.world.guidePosition} />}
        {faz === "kesif" &&
          nod?.hotspots.map((h) => (
            <HotspotMarker key={h.id} hotspot={h} gezildi={gezilen.includes(h.id)} />
          ))}

        {/* ---------- SİNEMATİK BORU HATTI ---------- */}
        <EffectComposer multisampling={0}>
          {/* ortam örtüşmesi: nesneleri zemine oturtur, köşelere derinlik verir */}
          <N8AO aoRadius={1.1} intensity={2.0} distanceFalloff={1.0} color="#0a1020" halfRes quality="low" />
          {/* ateş, ay ve ışık sütunlarının halelenmesi */}
          <Bloom
            intensity={0.95}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
          {/* gece derecelendirmesi + film greni */}
          <RenkDerecelendirme golgeMavi={1.0} isikSicak={1.0} kontrast={1.13} gren={0.028} doygunluk={1.07} />
          <Vignette offset={0.26} darkness={0.78} />
          <SMAA />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
