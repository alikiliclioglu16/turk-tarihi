"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SoftShadows, AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, N8AO, Vignette, SMAA, GodRays } from "@react-three/postprocessing";

import { SahneAtmosferi } from "./Environment";
import { Terrain } from "./Terrain";
import { Player } from "./Player";
import { YakinVarliklar } from "./YakinVarliklar";
import { UzakSiluetler } from "./UzakSiluetler";
import { Halk } from "./Halk";
import { BuyukOba } from "./BuyukOba";
import { GirilebilirOtag } from "./GirilebilirOtag";
import { Suru } from "./Suru";
import { Canlilar } from "./Canlilar";
import { SinirKusagi } from "./SinirKusagi";
import { CarpismaKurulumu } from "./CarpismaKurulumu";
import { ZeminGolgeleri } from "./ZeminGolgeleri";
import { YakinBitkiler } from "./YakinBitkiler";
import { MekanSesleri } from "./MekanSesleri";
import { HotspotMarker } from "./HotspotMarker";
import { DurakIsigi } from "./DurakIsigi";
import { AltinYol } from "./AltinYol";
import { AcilisUcusu } from "./AcilisUcusu";
import { Dekor } from "./Dekor";
import { AtesEfekti } from "./AtesEfekti";
import { IBL } from "./IBL";
import { Sis } from "./Sis";
import { BonusKesifler } from "./BonusKesifler";
import { BolgeAtmosferi } from "./BolgeAtmosferi";
import { Dere } from "./Dere";
import { RenkDerecelendirme } from "./RenkDerecelendirme";
import { useOyun } from "@/lib/store";
import { kaliteDurumu, kaliteYukle } from "@/components/ui/KaliteAyari";

export function D01Scene() {
  const kalite = typeof window !== "undefined" ? kaliteYukle() : "yuksek";
  const dusuk = kalite === "dusuk";
  void kaliteDurumu;
  const gunesKursu = useRef<THREE.Mesh>(null);
  const [gunesHazir, setGunesHazir] = useState(false);
  useEffect(() => {
    const z = setTimeout(() => setGunesHazir(true), 400);
    return () => clearTimeout(z);
  }, []);
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const faz = useOyun((s) => s.faz);
  const gezilen = useOyun((s) => s.gezilenHotspotlar);
  const tamamlanan = useOyun((s) => s.tamamlananNodIndexleri);
  const nod = nodlar[aktifIndex];

  return (
    <Canvas
      shadows={kalite !== "dusuk"}
      dpr={kalite === "dusuk" ? [1, 1] : kalite === "orta" ? [1, 1.3] : [1, 1.6]}
      camera={{ fov: 54, near: 0.1, far: 900, position: [0, 6, 20] }}
      gl={{
        antialias: false, // SMAA devrede
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        powerPreference: "high-performance",
      }}
    >
      <PerformanceMonitor onDecline={() => { /* düşük başarımda dpr otomatik iner */ }} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <CarpismaKurulumu />
        <MekanSesleri />
        <IBL />
        {/* PCSS yumuşak gölgeler: temasta keskin, uzaklaştıkça yumuşayan */}
        {kalite === "yuksek" && <SoftShadows size={9} samples={8} focus={0.75} />}
        <SahneAtmosferi gunesKursu={gunesKursu} />
        <BolgeAtmosferi />
        <Dere />
        <Terrain />
        <ZeminGolgeleri />
        {kalite !== "dusuk" && <YakinBitkiler />}
        <Dekor />
        <Sis />
        <AtesEfekti pos={[0, 0, 0]} />

        <YakinVarliklar />
        <UzakSiluetler />
        <BuyukOba />
        <Halk />
        {/* girilebilir otağlar — kapıdan içeri girilir, çatı saydamlaşır */}
        <GirilebilirOtag pos={[-27, -14]} rotY={0.75} olcek={1.5} tur="bey" />
        <GirilebilirOtag pos={[36, 23]} rotY={-0.6} olcek={1.25} tur="aile" />
        <GirilebilirOtag pos={[-84, 52]} rotY={2.0} olcek={1.2} tur="usta" />
        <GirilebilirOtag pos={[52, -76]} rotY={1.4} olcek={1.2} tur="aile" />
        {/* ileri gelenlerin otağları — dördü de gezilebilir */}
        <GirilebilirOtag pos={[0, 20]} rotY={0.2} olcek={1.8} tur="hakan" />
        <GirilebilirOtag pos={[46, -30]} rotY={-1.1} olcek={1.45} tur="bey" />
        <GirilebilirOtag pos={[-44, 72]} rotY={2.4} olcek={1.35} tur="bey" />
        <GirilebilirOtag pos={[70, 26]} rotY={0.9} olcek={1.35} tur="usta" />
        <Suru />
        <Canlilar />
        <SinirKusagi />

        <Player baslangic={[0, 0, 46]} />
        <BonusKesifler />

        <AcilisUcusu />
        <AltinYol />
        {/* SERBEST TUR: tamamlanmamış tüm durakların ışığı görünür */}
        {(faz === "gezinti" || faz === "acilis") &&
          nodlar.map((n, i) =>
            tamamlanan.includes(i) ? null : (
              <DurakIsigi key={n.nodeId} pos={n.world.guidePosition} />
            )
          )}
        {(faz === "kesif" || faz === "anlati") && nod && (
          <DurakIsigi pos={nod.world.guidePosition} />
        )}
        {faz === "kesif" &&
          nod?.hotspots.map((h) => (
            <HotspotMarker key={h.id} hotspot={h} gezildi={gezilen.includes(h.id)} />
          ))}

        {/* ---------- SİNEMATİK BORU HATTI ---------- */}
        {/* Sinematik boru hattı — kaliteye göre iki ayrı zincir */}
        {kalite === "yuksek" && (
          <EffectComposer multisampling={0}>
            <N8AO aoRadius={1.6} intensity={1.5} distanceFalloff={1.0} color="#2a2418" halfRes quality="low" />
            <Bloom intensity={0.35} luminanceThreshold={0.72} luminanceSmoothing={0.3} mipmapBlur />
            <RenkDerecelendirme golgeMavi={1.0} isikSicak={1.0} kontrast={1.07} gren={0.012} doygunluk={1.1} />
            <Vignette offset={0.32} darkness={0.45} />
            <SMAA />
          </EffectComposer>
        )}
        {kalite === "yuksek" && gunesHazir && gunesKursu.current && (
          <EffectComposer multisampling={0}>
            <GodRays
              sun={gunesKursu.current}
              samples={28}
              density={0.93}
              decay={0.92}
              weight={0.28}
              exposure={0.24}
              clampMax={0.9}
              blur
            />
          </EffectComposer>
        )}
        {kalite === "orta" && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.3} luminanceThreshold={0.75} luminanceSmoothing={0.3} mipmapBlur />
            <RenkDerecelendirme golgeMavi={1.0} isikSicak={1.0} kontrast={1.06} gren={0.01} doygunluk={1.08} />
            <Vignette offset={0.34} darkness={0.4} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
