"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SahneAtmosferi } from "./Environment";
import { Terrain } from "./Terrain";
import { Player } from "./Player";
import { AssetModel } from "./AssetModel";
import { HotspotMarker } from "./HotspotMarker";
import { HedefIsigi } from "./HedefIsigi";
import { Dekor } from "./Dekor";
import { AtesEfekti } from "./AtesEfekti";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
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
      camera={{ fov: 52, near: 0.1, far: 400, position: [0, 6, 20] }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.12 }}
    >
      <Suspense fallback={null}>
        <SahneAtmosferi />
        <Terrain />
        <Dekor />
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

        <EffectComposer>
          <Bloom intensity={0.85} luminanceThreshold={0.32} luminanceSmoothing={0.28} mipmapBlur />
          <Vignette offset={0.28} darkness={0.72} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
