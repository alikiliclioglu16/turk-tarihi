"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { DUNYA_OLCEK as OL } from "@/lib/dunyaOlcek";
import { InekModel, EsekModel, KopekModel, KediModel, AhirModel, Kartal } from "./models/Hayvanlar";
import { KoyunModel } from "./models/Props";
import { AtModel } from "./models/BolgeProps";

/**
 * OBANIN CANLILARI
 *
 * Sürüler, iş hayvanları, köpekler, kediler ve gökyüzündeki kartallar.
 * Sürüler yavaşça otlayarak yer değiştirir; oba ölü durmaz.
 *
 * Görünürlük mesafeye bağlıdır — yakındakiler çizilir.
 */

type Tur = "koyun" | "inek" | "at" | "esek" | "kopek" | "kedi";

interface Canli {
  tur: Tur;
  x: number;
  z: number;
  olcek: number;
  yon: number;
  /** sürü merkezi çevresinde küçük gezinme */
  gezinme?: number;
}

/** Sürüler ve tekil hayvanlar — tasarım koordinatlarında */
function canlilariUret(): Canli[] {
  const liste: Canli[] = [];
  let tohum = 90210;
  const r = () => { tohum = (tohum * 1103515245 + 12345) & 0x7fffffff; return tohum / 0x7fffffff; };

  const suru = (tur: Tur, cx: number, cz: number, adet: number, yayilim: number, olcek = 1) => {
    for (let i = 0; i < adet; i++) {
      const a = r() * Math.PI * 2;
      const d = r() * yayilim;
      liste.push({
        tur,
        x: cx + Math.cos(a) * d,
        z: cz + Math.sin(a) * d,
        olcek: olcek * (0.85 + r() * 0.3),
        yon: r() * Math.PI * 2,
        gezinme: r() * Math.PI * 2,
      });
    }
  };

  // koyun sürüleri
  suru("koyun", 42, -6, 22, 11);
  suru("koyun", -36, 34, 16, 9);
  suru("koyun", 20, 44, 12, 8);
  // sığır sürüsü
  suru("inek", 54, 12, 14, 12, 1.05);
  suru("inek", -18, 44, 9, 9, 1.0);
  // at sürüleri
  suru("at", -30, 28, 10, 10);
  suru("at", 30, -34, 8, 9);
  suru("at", 62, 30, 6, 8);
  // eşekler — yük hayvanı, kamp içinde
  suru("esek", 22, 6, 3, 5);
  suru("esek", -22, -6, 2, 4);
  // köpekler — kampa dağılmış
  suru("kopek", 6, 18, 3, 14);
  suru("kopek", -12, 26, 2, 10);
  suru("kopek", 40, -2, 2, 8);
  // kediler — çadır aralarında
  suru("kedi", -8, 10, 3, 9);
  suru("kedi", 26, 22, 2, 7);

  // ---- BÖLGE SÜRÜLERİ ----
  // Pazaryeri: hayvan pazarı
  suru("at", 58, -50, 12, 8);
  suru("koyun", 63, -46, 20, 8);
  suru("inek", 66, -40, 10, 7, 1.05);
  suru("esek", 44, -44, 6, 7);
  suru("kopek", 46, -36, 4, 12);
  suru("kedi", 42, -32, 3, 8);
  // Balbal Sırtı: dağ keçisi yerine seyrek koyun ve at
  suru("koyun", -50, 54, 14, 14);
  suru("at", -62, 66, 8, 12);
  suru("kopek", -52, 58, 3, 10);
  // Su Başı: sulanan sürüler
  suru("inek", 66, 26, 16, 12, 1.05);
  suru("at", 70, 14, 12, 11);
  suru("koyun", 56, 30, 18, 11);
  suru("kopek", 62, 22, 3, 9);
  // Eski Yurt: az hayvan — terk edilmişlik
  suru("koyun", -32, -64, 8, 12);
  suru("kopek", -36, -70, 2, 10);
  suru("kedi", -34, -68, 3, 8);

  return liste;
}

const GORUNUR = 95;

export function Canlilar() {
  const hepsi = useMemo(canlilariUret, []);
  const [yakin, setYakin] = useState<number[]>([]);
  const son = useRef(0);
  const anahtar = useRef("");

  useFrame(({ clock }) => {
    if (clock.elapsedTime - son.current < 0.7) return;
    son.current = clock.elapsedTime;
    const liste: number[] = [];
    hepsi.forEach((c, i) => {
      if (Math.hypot(c.x * OL - oyuncuKonumu.x, c.z * OL - oyuncuKonumu.z) < GORUNUR) liste.push(i);
    });
    const a = liste.join(",");
    if (a !== anahtar.current) { anahtar.current = a; setYakin(liste); }
  });

  return (
    <>
      {yakin.map((i) => (
        <TekCanli key={i} c={hepsi[i]} tohum={i} />
      ))}

      {/* ahırlar */}
      <Yerlesik x={46} z={-14} rot={0.4}><AhirModel /></Yerlesik>
      <Yerlesik x={-40} z={38} rot={2.1}><AhirModel /></Yerlesik>
      <Yerlesik x={62} z={-44} rot={1.2}><AhirModel /></Yerlesik>
      <Yerlesik x={68} z={24} rot={0.6}><AhirModel /></Yerlesik>
      <Yerlesik x={-58} z={64} rot={2.6}><AhirModel /></Yerlesik>

      {/* gökyüzünde kartallar */}
      <Kartal merkez={[0, 30 * OL]} yaricap={60} yukseklik={46} hiz={0.09} />
      <Kartal merkez={[-40 * OL, 50 * OL]} yaricap={48} yukseklik={62} hiz={0.13} />
      <Kartal merkez={[55 * OL, 10 * OL]} yaricap={54} yukseklik={40} hiz={-0.11} />
      <Kartal merkez={[-55 * OL, 60 * OL]} yaricap={70} yukseklik={70} hiz={0.07} />
      <Kartal merkez={[46 * OL, -34 * OL]} yaricap={58} yukseklik={52} hiz={-0.1} />
    </>
  );
}

function Yerlesik({ x, z, rot = 0, children }: { x: number; z: number; rot?: number; children: React.ReactNode }) {
  const gx = x * OL, gz = z * OL;
  return <group position={[gx, araziYukseklik(gx, gz), gz]} rotation={[0, rot, 0]}>{children}</group>;
}

/** Tek hayvan — sürü içinde yavaşça gezinir */
function TekCanli({ c, tohum }: { c: Canli; tohum: number }) {
  const grup = useRef<THREE.Group>(null);
  const temelX = c.x * OL;
  const temelZ = c.z * OL;

  useFrame(({ clock }) => {
    const g = grup.current;
    if (!g) return;
    const t = clock.elapsedTime * 0.06 + (c.gezinme ?? 0);
    // küçük daireler çizerek otlama gezinmesi
    const gx = temelX + Math.cos(t) * 3.2;
    const gz = temelZ + Math.sin(t * 0.8) * 3.2;
    g.position.set(gx, araziYukseklik(gx, gz), gz);
    g.rotation.y = c.yon + Math.sin(t * 0.5) * 0.6;
  });

  const govde = () => {
    switch (c.tur) {
      case "koyun": return <KoyunModel olcek={c.olcek} />;
      case "inek": return <InekModel olcek={c.olcek} renk={tohum % 3 === 0 ? "#3E3228" : tohum % 3 === 1 ? "#8A7458" : "#6B4A32"} />;
      case "at": return <AtModel olcek={c.olcek * 0.95} />;
      case "esek": return <EsekModel olcek={c.olcek} />;
      case "kopek": return <KopekModel olcek={c.olcek} />;
      case "kedi": return <KediModel olcek={c.olcek} />;
    }
  };

  return <group ref={grup}>{govde()}</group>;
}
