/**
 * D01 BÖLGE TANIMLARI
 *
 * Koordinatlar node JSON'larındaki `world3d` alanlarından alındı.
 * Dünya yaklaşık 160 × 180 metre, dört bölge tek kesintisiz arazide.
 */

import { DUNYA_OLCEK } from "./dunyaOlcek";

export type BolgeId = "oba" | "balbal_sirti" | "su_basi" | "eski_yurt";

export interface Bolge {
  id: BolgeId;
  ad: string;
  merkez: [number, number];      // x, z
  yaricap: number;               // etki alanı (m)
  duygu: string;
  /** atmosfer */
  sisRenk: string;
  sisYogunluk: number;
  ortamRenk: string;
  ortamGuc: number;
  ayGuc: number;
  gokUst: string;
  gokUfuk: string;
}

export const BOLGELER: Record<BolgeId, Bolge> = {
  oba: {
    id: "oba", ad: "Oba", merkez: [0, 4], yaricap: 34, duygu: "sıcak",
    sisRenk: "#0b1322", sisYogunluk: 0.014,
    ortamRenk: "#2c3d63", ortamGuc: 0.35, ayGuc: 0.6,
    gokUst: "#050a16", gokUfuk: "#2a3f6a",
  },
  balbal_sirti: {
    id: "balbal_sirti", ad: "Balbal Sırtı", merkez: [-57, 62], yaricap: 40, duygu: "saygılı",
    sisRenk: "#0d1526", sisYogunluk: 0.010,
    ortamRenk: "#33456e", ortamGuc: 0.5, ayGuc: 1.05,
    gokUst: "#04091a", gokUfuk: "#33518c",
  },
  su_basi: {
    id: "su_basi", ad: "Su Başı", merkez: [65, 17], yaricap: 42, duygu: "sakin",
    sisRenk: "#101d26", sisYogunluk: 0.020,
    ortamRenk: "#2b4a5e", ortamGuc: 0.46, ayGuc: 0.75,
    gokUst: "#050d1a", gokUfuk: "#2c5470",
  },
  eski_yurt: {
    id: "eski_yurt", ad: "Eski Yurt Yeri", merkez: [-31, -75], yaricap: 40, duygu: "düşünceli",
    sisRenk: "#141422", sisYogunluk: 0.024,
    ortamRenk: "#3a3550", ortamGuc: 0.4, ayGuc: 0.5,
    gokUst: "#0a0812", gokUfuk: "#4a4058",
  },
};

export const BOLGE_SIRASI: BolgeId[] = ["oba", "balbal_sirti", "su_basi", "eski_yurt"];

/** Oyuncunun hangi bölgede olduğunu bulur (en yakın merkez) */
function m(b: Bolge): [number, number] {
  return [b.merkez[0] * DUNYA_OLCEK, b.merkez[1] * DUNYA_OLCEK];
}

export function bolgeBul(x: number, z: number): BolgeId {
  let enIyi: BolgeId = "oba";
  let enKisa = Infinity;
  for (const id of BOLGE_SIRASI) {
    const b = BOLGELER[id];
    const [mx, mz] = m(b);
    const d = Math.hypot(x - mx, z - mz);
    if (d < enKisa) { enKisa = d; enIyi = id; }
  }
  return enIyi;
}

/** İki bölge arasındaki geçiş yumuşaklığı (0-1) — atmosfer harmanı için */
export function bolgeAgirliklari(x: number, z: number): Record<BolgeId, number> {
  const ham: Record<string, number> = {};
  let toplam = 0;
  for (const id of BOLGE_SIRASI) {
    const b = BOLGELER[id];
    const [mx, mz] = m(b);
    const d = Math.hypot(x - mx, z - mz);
    const w = 1 / (1 + Math.pow(d / (b.yaricap * DUNYA_OLCEK), 3));
    ham[id] = w;
    toplam += w;
  }
  const sonuc = {} as Record<BolgeId, number>;
  for (const id of BOLGE_SIRASI) sonuc[id] = ham[id] / toplam;
  return sonuc;
}
