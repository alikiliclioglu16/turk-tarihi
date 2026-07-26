"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense } from "react";
import { SAHNELER, type SahneFiguru, type EtkinlikSahnesi } from "@/lib/sahneler";
import { araziYukseklik } from "@/lib/terrain";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { DUNYA_OLCEK as OL } from "@/lib/dunyaOlcek";
import { InsanModel } from "./models/InsanModel";
import { KarakterGLB } from "./models/KarakterGLB";
import { ElNesnesi } from "./models/ElNesnesi";
import { AtModel } from "./models/BolgeProps";
import { ZANAAT_DUZELTMELERI } from "@/lib/zanaatDuzeltmeleri";
import {
  AKTIVITE_KLIP, karakterYolu, dokuYolu, glbVarMi, fazHesapla,
} from "@/lib/karakterKayit";

/**
 * ETKİNLİK SAHNELERİ
 *
 * Elle kurgulanmış tablolar. Rastgele dağıtılmış figürlerden farkı:
 * burada kim nerede duruyor, neye dönük, hangi nesnenin kaç santim
 * uzağında — hepsi bilinçli.
 *
 * Demirci örsün 2,3 metre yanında ve ÖRSE DÖNÜK duruyor.
 * Güreşçiler 1,6 metre arayla KARŞILIKLI.
 * At, eğitim çemberinin İÇİNDE dönüyor.
 */

const GORUNUR = 95;
const GLB_MESAFE = 34;

function SahneFiguruBileseni({
  f, mx, mz,
}: { f: SahneFiguru; mx: number; mz: number }) {
  const grup = useRef<THREE.Group>(null);
  const [yakin, setYakin] = useState(false);
  const faz = useMemo(() => fazHesapla(f.id), [f.id]);
  const tohum = useMemo(() => Math.random() * 10, []);

  const x = (mx + f.dx) * OL;
  const z = (mz + f.dz) * OL;
  const y = araziYukseklik(x, z);
  // yon null ise sahne merkezine bak
  const yon = f.yon ?? Math.atan2(-f.dx, -f.dz);

  useFrame(() => {
    const d = Math.hypot(oyuncuKonumu.x - x, oyuncuKonumu.z - z);
    const esik = yakin ? GLB_MESAFE + 5 : GLB_MESAFE;
    if (d < esik !== yakin) setYakin(d < esik);
  });

  return (
    <group ref={grup} position={[x, y, z]} rotation={[0, yon, 0]}>
      {yakin && glbVarMi(f.aktivite) ? (
        <Suspense fallback={null}>
          <KarakterGLB
            yol={karakterYolu(f.aktivite)}
            klip={AKTIVITE_KLIP[f.aktivite] ?? "idle"}
            faz={faz}
            olcek={(f.boy ?? 1.72) / 1.7}
            doku={dokuYolu(f.id, f.aktivite)}
            duzeltme={ZANAAT_DUZELTMELERI[f.aktivite] ?? null}
          />
        </Suspense>
      ) : (
        <InsanModel
          aktivite={f.aktivite as never}
          renk="#C4B292"
          kusakRenk="#8A6A24"
          boy={f.boy ?? 1.72}
          tohum={tohum}
        />
      )}
      {f.elde && <ElNesnesi kod={f.elde} />}
    </group>
  );
}

/** Eğitim çemberinde dönen at */
function DonenAt({ mx, mz, yaricap, hiz }: { mx: number; mz: number; yaricap: number; hiz: number }) {
  const grup = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const g = grup.current;
    if (!g) return;
    const a = clock.elapsedTime * hiz;
    const x = (mx + Math.cos(a) * yaricap) * OL;
    const z = (mz + Math.sin(a) * yaricap) * OL;
    g.position.set(x, araziYukseklik(x, z), z);
    g.rotation.y = -a + Math.PI / 2;   // teğet yönde ilerle
  });
  return (
    <group ref={grup}>
      <AtModel />
    </group>
  );
}

function Sahne({ s }: { s: EtkinlikSahnesi }) {
  const [mx, mz] = s.merkez;
  const [gorunur, setGorunur] = useState(false);

  useFrame(() => {
    const d = Math.hypot(oyuncuKonumu.x - mx * OL, oyuncuKonumu.z - mz * OL);
    const g = d < GORUNUR;
    if (g !== gorunur) setGorunur(g);
  });

  if (!gorunur) return null;

  return (
    <group>
      {s.figurler.map((f) => (
        <SahneFiguruBileseni key={f.id} f={f} mx={mx} mz={mz} />
      ))}
      {s.hayvanlar?.map((h, i) =>
        h.dairesel ? (
          <DonenAt
            key={i}
            mx={mx + h.dx}
            mz={mz + h.dz}
            yaricap={h.dairesel.yaricap}
            hiz={h.dairesel.hiz}
          />
        ) : (
          <group
            key={i}
            position={[
              (mx + h.dx) * OL,
              araziYukseklik((mx + h.dx) * OL, (mz + h.dz) * OL),
              (mz + h.dz) * OL,
            ]}
            rotation={[0, Math.atan2(-h.dx, -h.dz), 0]}
          >
            <AtModel />
          </group>
        )
      )}
    </group>
  );
}

export function EtkinlikSahneleri() {
  return (
    <group>
      {SAHNELER.map((s) => (
        <Sahne key={s.id} s={s} />
      ))}
    </group>
  );
}
