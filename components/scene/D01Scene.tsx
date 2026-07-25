"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { SoftShadows } from "@react-three/drei";
import {
  EffectComposer, Bloom, N8AO, ChromaticAberration,
  DepthOfField, Vignette, SMAA,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

import { SahneAtmosferi } from "./Environment";
import { Terrain } from "./Terrain";
import { Player } from "./Player";
import { AssetModel } from "./AssetModel";
import { HotspotMarker } from "./HotspotMarker";
import { HedefIsigi } from "./HedefIsigi";
import { Dekor } from "./Dekor";
import { AtesEfekti } from "./AtesEfekti";
import { IBL } from "./IBL";
import { Sis } from "./Sis";
import { RenkDerecelendirme } from "./RenkDerecelendirme";
import { D01_YERLESIM } from "@/lib/assets";
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
      dpr={[1, 2]}
      camera={{ fov: 50, near: 0.1, far: 400, position: [0, 6, 20] }}
      gl={{
        antialias: false, // SMAA devrede
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        powerPreference: "high-performance",
      }}
    >
      <Suspense fallback={null}>
        <IBL />
        {/* PCSS yumuşak gölgeler: temasta keskin, uzaklaştıkça yumuşayan */}
        <SoftShadows size={12} samples={14} focus={0.7} />
        <SahneAtmosferi />
        <Terrain />
        <Dekor />
        <Sis />
        <AtesEfekti pos={[0, 0, 0]} />

        {D01_YERLESIM.map((y, i) => (
          <AssetModel key={`${y.kod}-${i}`} kod={y.kod} pos={y.pos} rotY={y.rotY} olcek={y.olcek} />
        ))}

        <Player baslangic={[0, 0, 14]} />

        {faz === "gezinti" && nod && <HedefIsigi pos={nod.world.guidePosition} />}
        {faz === "kesif" &&
          nod?.hotspots.map((h) => (
            <HotspotMarker key={h.id} hotspot={h} gezildi={gezilen.includes(h.id)} />
          ))}

        {/* ---------- SİNEMATİK BORU HATTI ---------- */}
        <EffectComposer multisampling={0}>
          {/* ortam örtüşmesi: nesneleri zemine oturtur, köşelere derinlik verir */}
          <N8AO
            aoRadius={1.4}
            intensity={2.6}
            distanceFalloff={0.9}
            color="#0a1020"
            halfRes
          />
          {/* ateş, ay ve ışık sütunlarının halelenmesi */}
          <Bloom
            intensity={0.95}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
          {/* çok hafif alan derinliği — karakter net, ufuk yumuşak */}
          <DepthOfField focusDistance={0.014} focalLength={0.06} bokehScale={1.5} height={480} />
          {/* lens karakteri */}
          <ChromaticAberration
            offset={[0.0006, 0.0006]}
            radialModulation
            modulationOffset={0.35}
            blendFunction={BlendFunction.NORMAL}
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
