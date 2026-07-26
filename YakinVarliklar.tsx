"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DUNYA_OLCEK as OL } from "@/lib/dunyaOlcek";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { mekanSesleriKur, sesKonumGuncelle, mekanSesleriKapat, type SesKaynagi } from "@/lib/audio";

/**
 * MEKÂN SESLERİ
 *
 * Obada demirci çekici, pazarda kalabalık uğultusu, dere kenarında akan
 * su, ocaklarda çıtırtı, otlakta hayvan sesleri. Hepsi konumlu:
 * yaklaştıkça yükselir, uzaklaştıkça kapanır.
 *
 * Ses artık düz bir fon değil, mekânın kendisi.
 */

const KAYNAKLAR: SesKaynagi[] = [
  { id: "demirci", tur: "demirci", x: -26 * OL, z: 6 * OL, menzil: 34, guc: 0.55 },
  { id: "meydan", tur: "meydan", x: 2 * OL, z: 29 * OL, menzil: 42, guc: 0.5 },
  { id: "pazar", tur: "pazar", x: 46 * OL, z: -34 * OL, menzil: 62, guc: 0.75 },
  { id: "pazar2", tur: "pazar", x: 58 * OL, z: -44 * OL, menzil: 40, guc: 0.5 },
  { id: "ates_oba", tur: "ates", x: 0, z: 0, menzil: 22, guc: 0.4 },
  { id: "su1", tur: "su", x: 58 * OL, z: 30 * OL, menzil: 55, guc: 0.7 },
  { id: "su2", tur: "su", x: 76 * OL, z: 8 * OL, menzil: 48, guc: 0.6 },
  { id: "suru_oba", tur: "suru", x: 42 * OL, z: -6 * OL, menzil: 44, guc: 0.55 },
  { id: "suru_su", tur: "suru", x: 66 * OL, z: 26 * OL, menzil: 42, guc: 0.5 },
  { id: "suru_pazar", tur: "suru", x: 62 * OL, z: -46 * OL, menzil: 40, guc: 0.55 },
  { id: "zanaat", tur: "meydan", x: -18 * OL, z: 16 * OL, menzil: 30, guc: 0.4 },
  { id: "talim", tur: "meydan", x: 16 * OL, z: -24 * OL, menzil: 32, guc: 0.35 },
];

export function MekanSesleri() {
  const son = useRef(0);

  useEffect(() => {
    // ses bağlamı ilk kullanıcı hareketinden sonra açıldığı için gecikmeli kur
    const z = window.setTimeout(() => mekanSesleriKur(KAYNAKLAR), 1200);
    return () => {
      window.clearTimeout(z);
      mekanSesleriKapat();
    };
  }, []);

  useFrame(({ clock }) => {
    if (clock.elapsedTime - son.current < 0.25) return;
    son.current = clock.elapsedTime;
    sesKonumGuncelle(oyuncuKonumu.x, oyuncuKonumu.z);
  });

  return null;
}
