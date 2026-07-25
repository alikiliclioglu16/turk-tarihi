/**
 * VARLIK KAYIT DEFTERİ
 *
 * GLB dosyaları henüz üretilmediği için her varlığın bir "greybox" karşılığı var.
 * Bir GLB hazır olduğunda:
 *   1. dosyayı public/assets/d01/ içine koyun
 *   2. aşağıdaki kaydın path alanını doldurun ve hazir: true yapın
 * Kod hiçbir yerde değişmez; sahne otomatik olarak gerçek modeli yükler.
 */

import { DUNYA_OLCEK } from "./dunyaOlcek";

export type GreyboxSekil = "kutu" | "silindir" | "koni" | "kure" | "tas";

export interface VarlikTanimi {
  kod: string;
  ad: string;
  path: string | null;
  hazir: boolean;
  /** GLB yokken gösterilecek yer tutucu */
  greybox: {
    sekil: GreyboxSekil;
    boyut: [number, number, number]; // metre (genişlik, yükseklik, derinlik)
    renk: string;
  };
}

export const VARLIKLAR: Record<string, VarlikTanimi> = {
  A01: {
    kod: "A01", ad: "Dede Korkut", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [0.5, 1.75, 0.5], renk: "#EFE3C8" },
  },
  A02: {
    kod: "A02", ad: "Kopuz", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [0.28, 0.22, 0.95], renk: "#7A542F" },
  },
  A03: {
    kod: "A03", ad: "Tarih Sandığı", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.2, 0.85, 0.7], renk: "#6E4B26" },
  },
  A04: {
    kod: "A04", ad: "Büyük Otağ", path: null, hazir: false,
    greybox: { sekil: "koni", boyut: [5.2, 4.2, 5.2], renk: "#D9CBAA" },
  },
  A05: {
    kod: "A05", ad: "Ocak Seti", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [2.2, 0.35, 2.2], renk: "#3E4A5E" },
  },
  A06: {
    kod: "A06", ad: "Sacayak + Kazan", path: null, hazir: false,
    greybox: { sekil: "koni", boyut: [1.5, 2.4, 1.5], renk: "#2C2C34" },
  },
  A07: {
    kod: "A07", ad: "Balbal", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [0.6, 2.0, 0.45], renk: "#5A6474" },
  },
  A08: {
    kod: "A08", ad: "Yer Kilimi", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [2.8, 0.04, 1.9], renk: "#B8433A" },
  },
  C01: {
    kod: "C01", ad: "Kaya (küçük)", path: null, hazir: false,
    greybox: { sekil: "tas", boyut: [0.5, 0.4, 0.5], renk: "#4A5568" },
  },
  C05: {
    kod: "C05", ad: "Bozkır Çalısı", path: null, hazir: false,
    greybox: { sekil: "koni", boyut: [0.6, 0.7, 0.6], renk: "#28414A" },
  },
  H01: {
    kod: "H01", ad: "Patika", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.4, 0.02, 1.4], renk: "#3A3226" },
  },
  B06: {
    kod: "B06", ad: "Heybe", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [0.55, 0.4, 0.22], renk: "#A63A32" },
  },
  B07: {
    kod: "B07", ad: "Minder", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [0.75, 0.16, 0.6], renk: "#B8433A" },
  },
  B10: {
    kod: "B10", ad: "Ahşap Çanak", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [0.34, 0.14, 0.34], renk: "#8A6238" },
  },
  D01a: {
    kod: "D01a", ad: "Tomar / Mektup", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [0.1, 0.34, 0.1], renk: "#E4D4AE" },
  },
  D03a: {
    kod: "D03a", ad: "Deri Kese", path: null, hazir: false,
    greybox: { sekil: "kure", boyut: [0.24, 0.26, 0.24], renk: "#7A5A3A" },
  },
  D04a: {
    kod: "D04a", ad: "Bakır Ayna", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [0.22, 0.03, 0.22], renk: "#B08D57" },
  },
  D05a: {
    kod: "D05a", ad: "Kilim Parçası", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [0.5, 0.03, 0.36], renk: "#A63A32" },
  },
  /* --- oba genişlemesi --- */
  B13: { kod: "B13", ad: "Ağıl", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [6.4, 1.1, 6.4], renk: "#5A452C" } },
  B14: { kod: "B14", ad: "Koyun", path: null, hazir: false,
    greybox: { sekil: "kure", boyut: [0.6, 0.6, 0.6], renk: "#D8D2C4" } },
  B15: { kod: "B15", ad: "Kağnı", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [2.2, 1.0, 1.5], renk: "#6E4B26" } },
  B16: { kod: "B16", ad: "Dokuma Tezgâhı", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.9, 1.6, 0.3], renk: "#6E4B26" } },
  B17: { kod: "B17", ad: "Kurutma Sehpası", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [2.1, 1.3, 0.6], renk: "#5A4126" } },
  B18: { kod: "B18", ad: "Odun Yığını", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.2, 0.9, 1.1], renk: "#5A4126" } },
  B19: { kod: "B19", ad: "Tulum Sehpası", path: null, hazir: false,
    greybox: { sekil: "koni", boyut: [0.9, 1.6, 0.9], renk: "#6B4A2E" } },
  B20: { kod: "B20", ad: "Mızrak Rafı", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.5, 2.5, 0.3], renk: "#5A4126" } },
  B21: { kod: "B21", ad: "Tuğ Direği", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [0.15, 3.7, 0.15], renk: "#6E4B26" } },

  /* ---------- BALBAL SIRTI ---------- */
  E01: { kod: "E01", ad: "Büyük Balbal", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [0.82, 3.3, 0.56], renk: "#5A6474" } },
  E02: { kod: "E02", ad: "Devrik Balbal", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.9, 0.6, 0.42], renk: "#5A6474" } },
  E03: { kod: "E03", ad: "Yazıtlı Taş", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.15, 2.4, 0.45], renk: "#57606E" } },
  E04: { kod: "E04", ad: "Taş Dizisi", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [7.0, 0.4, 1.0], renk: "#4A5568" } },
  E05: { kod: "E05", ad: "Kayalık Yamaç", path: null, hazir: false,
    greybox: { sekil: "tas", boyut: [4.5, 2.0, 4.0], renk: "#3E4A5E" } },
  E06: { kod: "E06", ad: "Step Otu", path: null, hazir: false,
    greybox: { sekil: "koni", boyut: [0.7, 0.8, 0.7], renk: "#4A5548" } },

  /* ---------- SU BAŞI ---------- */
  F01: { kod: "F01", ad: "Söğüt", path: null, hazir: false,
    greybox: { sekil: "koni", boyut: [5.0, 6.5, 5.0], renk: "#334A3E" } },
  F02: { kod: "F02", ad: "Dere Taşları", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [5.5, 0.3, 2.5], renk: "#5A6470" } },
  F03: { kod: "F03", ad: "Sazlık", path: null, hazir: false,
    greybox: { sekil: "koni", boyut: [2.4, 1.8, 1.6], renk: "#6B7A52" } },
  F04: { kod: "F04", ad: "Su Sehpası", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.2, 1.2, 0.6], renk: "#6B4A2E" } },
  F05: { kod: "F05", ad: "Bağlama Direği", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [0.2, 1.5, 0.2], renk: "#6E4B26" } },
  F06: { kod: "F06", ad: "Otlayan At", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [2.4, 2.2, 1.0], renk: "#4A3826" } },
  F07: { kod: "F07", ad: "Ahşap Kova", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [0.4, 0.35, 0.4], renk: "#6E4B26" } },

  /* ---------- ESKİ YURT ---------- */
  G01: { kod: "G01", ad: "Otağ İskeleti", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [5.0, 2.4, 5.0], renk: "#4A3A26" } },
  G02: { kod: "G02", ad: "Sönmüş Ocak", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [2.2, 0.25, 2.2], renk: "#26221E" } },
  G03: { kod: "G03", ad: "Yıkık Duvar", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [3.6, 1.4, 0.5], renk: "#57606E" } },
  G04: { kod: "G04", ad: "Kırık Çanak", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.4, 0.15, 1.2], renk: "#9A6E4E" } },
  G05: { kod: "G05", ad: "Yarı Gömülü Kap", path: null, hazir: false,
    greybox: { sekil: "kure", boyut: [0.7, 0.5, 0.7], renk: "#8A6248" } },
  G06: { kod: "G06", ad: "Çürümüş Direk", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [0.26, 1.4, 0.26], renk: "#3E3020" } },
  G07: { kod: "G07", ad: "Höyük", path: null, hazir: false,
    greybox: { sekil: "kure", boyut: [10.0, 3.6, 10.0], renk: "#2E3630" } },
  G08: { kod: "G08", ad: "Solmuş Kilim", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.5, 0.03, 1.0], renk: "#8A8078" } },

  /* ---------- ORTAK ---------- */
  H04: { kod: "H04", ad: "Yön Direği", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [0.16, 2.2, 0.16], renk: "#6E4B26" } },
  P01: { kod: "P01", ad: "Pazar Tezgâhı", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [2.4, 2.3, 0.9], renk: "#6E4B26" } },
  P02: { kod: "P02", ad: "Demirci Ocağı", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [1.9, 1.0, 1.9], renk: "#4A4038" } },
  P03: { kod: "P03", ad: "Talim Hedefi", path: null, hazir: false,
    greybox: { sekil: "kutu", boyut: [1.2, 1.8, 0.3], renk: "#C9A863" } },
  P04: { kod: "P04", ad: "Aşık Oyunu", path: null, hazir: false,
    greybox: { sekil: "silindir", boyut: [2.2, 0.1, 2.2], renk: "#3A3226" } },

};

export function varlik(kod: string): VarlikTanimi | null {
  return VARLIKLAR[kod] ?? null;
}

/** Sahnede hangi varlığın nerede duracağı — greybox yerleşim planı */
export interface Yerlesim {
  kod: string;
  pos: [number, number, number];
  rotY?: number;
  olcek?: number;
}

const HAM_YERLESIM: Yerlesim[] = [
  { kod: "A04", pos: [-6.5, 0, -3.2], rotY: 0.75 },
  { kod: "A04", pos: [8.5, 0, -6.5], rotY: -0.6, olcek: 0.8 },
  { kod: "A05", pos: [0, 0, 0] },
  { kod: "A06", pos: [0, 0, 0] },
  { kod: "A08", pos: [5.6, 0, 3.4], rotY: -0.3 },
  { kod: "A02", pos: [5.6, 0.3, 3.4], rotY: -0.6 },
  { kod: "A03", pos: [-3.2, 0, -4.6], rotY: 0.4 },
  { kod: "A07", pos: [-7.5, 0, 6.5], rotY: 0.3 },
  { kod: "A07", pos: [-8.6, 0, 7.6], rotY: 0.9, olcek: 0.8 },
  { kod: "C01", pos: [-1.8, 0, 9.4] },
  { kod: "C01", pos: [-0.9, 0, 10.6], olcek: 0.7 },
  { kod: "C01", pos: [-2.4, 0, 8.1], olcek: 0.85 },
  { kod: "B07", pos: [1.9, 0, 1.5], rotY: -0.5 },
  { kod: "B07", pos: [-1.6, 0, 1.9], rotY: 0.7 },
  { kod: "B10", pos: [1.4, 0, -1.4], rotY: 0.2 },
  { kod: "B06", pos: [-5.4, 0, -1.1], rotY: 0.9 },
  { kod: "D01a", pos: [-2.3, 0, -4.2], rotY: 0.4 },
  { kod: "D03a", pos: [-4.1, 0, -4.2], rotY: -0.3 },
  { kod: "D04a", pos: [-3.7, 0, -3.6], rotY: 0.8 },
  { kod: "D05a", pos: [-2.6, 0, -3.6], rotY: 0.2 },

  /* ---------- OBA GENİŞLEMESİ ---------- */
  /* Üçüncü ve dördüncü otağ — kamp büyüdü */
  { kod: "A04", pos: [-13.5, 0, 3.5], rotY: 1.8, olcek: 0.75 },
  { kod: "A04", pos: [12.5, 0, 5.5], rotY: -1.4, olcek: 0.68 },

  /* Tuğ direği — obanın merkezi işareti */
  { kod: "B21", pos: [-1.2, 0, -8.5] },

  /* Hayvan ağılı ve sürü */
  { kod: "B13", pos: [14.5, 0, -4.5], rotY: 2.4 },
  { kod: "B14", pos: [13.6, 0, -3.4], rotY: 0.6 },
  { kod: "B14", pos: [14.8, 0, -2.6], rotY: 2.1, olcek: 0.9 },
  { kod: "B14", pos: [15.6, 0, -4.2], rotY: -0.8, olcek: 1.05 },
  { kod: "B14", pos: [13.2, 0, -5.4], rotY: 1.2, olcek: 0.95 },

  /* Göç yükü: kağnı */
  { kod: "B15", pos: [-9.5, 0, -6.5], rotY: 0.5 },

  /* Dokuma alanı */
  { kod: "B16", pos: [-8.5, 0, 8.5], rotY: -0.35 },
  { kod: "A08", pos: [-7.4, 0, 9.6], rotY: 0.4 },
  { kod: "B07", pos: [-9.6, 0, 9.4], rotY: 0.8 },

  /* Erzak ve günlük hayat */
  { kod: "B17", pos: [7.5, 0, -2.5], rotY: 0.9 },
  { kod: "B18", pos: [3.5, 0, -6.2], rotY: 0.2 },
  { kod: "B18", pos: [4.6, 0, -6.9], rotY: 1.1, olcek: 0.8 },
  { kod: "B19", pos: [9.5, 0, 8.5], rotY: -0.6 },
  { kod: "B20", pos: [-4.5, 0, -7.4], rotY: 0.15 },

  /* Kamp çevresi taş ve dekor */
  { kod: "C01", pos: [11.5, 0, 11.5], olcek: 1.3 },
  { kod: "C01", pos: [-12.5, 0, -2.5], olcek: 1.1 },
  { kod: "C01", pos: [6.5, 0, 12.5], olcek: 0.9 },
  { kod: "C01", pos: [-6.5, 0, 12.8], olcek: 1.2 },

  /* ============================================================
     BALBAL SIRTI  (node 04–05)
     ============================================================ */
  { kod: "E01", pos: [-49, 0, 55], rotY: 0.25 },
  { kod: "E02", pos: [-41, 0, 57], rotY: 1.1 },
  { kod: "A07", pos: [-45.5, 0, 53], rotY: -0.4, olcek: 0.85 },
  { kod: "A07", pos: [-51.5, 0, 58.5], rotY: 0.7, olcek: 0.95 },
  { kod: "E04", pos: [-52, 0, 49], rotY: 0.55 },
  { kod: "E03", pos: [-69, 0, 73], rotY: -0.35 },
  { kod: "E05", pos: [-62, 0, 66], olcek: 1.2 },
  { kod: "E05", pos: [-72, 0, 66], olcek: 0.9, rotY: 1.4 },
  { kod: "E05", pos: [-38, 0, 62], olcek: 1.05, rotY: 2.2 },
  { kod: "H04", pos: [-30, 0, 34], rotY: 0.5 },
  { kod: "H04", pos: [-58, 0, 58], rotY: -0.7 },

  /* ============================================================
     SU BAŞI  (node 06–07)
     ============================================================ */
  { kod: "F01", pos: [51, 0, 35], olcek: 1.0 },
  { kod: "F01", pos: [46, 0, 41], olcek: 0.78, rotY: 1.2 },
  { kod: "F01", pos: [60, 0, 26], olcek: 0.88, rotY: 2.4 },
  { kod: "F02", pos: [56, 0, 33], rotY: 0.4 },
  { kod: "F02", pos: [64, 0, 23], rotY: 1.1, olcek: 0.8 },
  { kod: "F03", pos: [53, 0, 31], rotY: 0.2 },
  { kod: "F03", pos: [59, 0, 35], rotY: 1.5 },
  { kod: "F03", pos: [68, 0, 20], rotY: 0.8 },
  { kod: "F04", pos: [58, 0, 30], rotY: -0.5 },
  { kod: "F07", pos: [55, 0, 31.5], rotY: 0.9 },
  { kod: "F05", pos: [74, 0, 0.5], rotY: 0.3 },
  { kod: "F06", pos: [70, 0, 6], rotY: -1.1 },
  { kod: "H04", pos: [80, 0, -2], rotY: 0.9 },
  { kod: "C05", pos: [72, 0, 12], olcek: 1.2 },
  { kod: "C01", pos: [66, 0, 8], olcek: 1.1 },

  /* ============================================================
     ESKİ YURT YERİ  (node 08–10)
     ============================================================ */
  { kod: "G01", pos: [-37, 0, -57], rotY: 0.4 },
  { kod: "G02", pos: [-28, 0, -64], rotY: 0 },
  { kod: "G05", pos: [-34, 0, -62], rotY: 0.6 },
  { kod: "G04", pos: [-32.5, 0, -61], rotY: 1.2 },
  { kod: "G06", pos: [-56, 0, -76], rotY: 0.3 },
  { kod: "G06", pos: [-40, 0, -66], rotY: 1.4, olcek: 0.85 },
  { kod: "G03", pos: [-61, 0, -78], rotY: 0.5 },
  { kod: "G03", pos: [-53, 0, -81], rotY: 1.9, olcek: 0.8 },
  { kod: "G08", pos: [-59, 0, -71], rotY: 0.2 },
  { kod: "G07", pos: [-46, 0, -90], olcek: 1.1 },
  { kod: "G07", pos: [-14, 0, -70], olcek: 0.75 },
  { kod: "C01", pos: [-24, 0, -72], olcek: 1.3 },
  { kod: "C01", pos: [-48, 0, -62], olcek: 0.9 },
  { kod: "H04", pos: [-16, 0, -50], rotY: -0.4 },

  /* ---------- FİNAL AÇIKLIĞI (node 10) ---------- */
  { kod: "A03", pos: [0, 0, -91], rotY: 0 },
  { kod: "A08", pos: [-1.2, 0, -90.5], rotY: 0.3 },
  { kod: "E04", pos: [1.5, 0, -90], rotY: 1.2, olcek: 0.5 },
  { kod: "H04", pos: [0, 0, -96], rotY: 0 },
  { kod: "B21", pos: [-3.5, 0, -93], olcek: 0.9 },
  { kod: "B21", pos: [3.5, 0, -93], olcek: 0.9 },
];

/** Tasarım koordinatlarını dünya ölçeğine çevir */
const OLCEKLI: Yerlesim[] = HAM_YERLESIM.map((y) => ({
  ...y,
  pos: [y.pos[0] * DUNYA_OLCEK, y.pos[1] * DUNYA_OLCEK, y.pos[2] * DUNYA_OLCEK],
}));

/**
 * OBA MAHALLELERİ — doğrudan dünya koordinatlarında yazıldı.
 * Oba artık dört mahalleye yayılıyor; alan yaklaşık 130×130 metre.
 */
const MAHALLELER: Yerlesim[] = [
  /* --- MEYDAN (ozan, dans, sohbet) --- */
  { kod: "A08", pos: [3, 0, 28], rotY: 0.3 },
  { kod: "A08", pos: [-3, 0, 30], rotY: 1.2 },
  { kod: "B07", pos: [1, 0, 30.5], rotY: 0.6 },
  { kod: "B07", pos: [6, 0, 28], rotY: 2.1 },
  { kod: "B21", pos: [0, 0, 24], olcek: 1.1 },
  { kod: "A05", pos: [0, 0, 33] },

  /* --- ZANAAT SOKAĞI --- */
  { kod: "P02", pos: [-26, 0, 6], rotY: 1.2 },
  { kod: "A04", pos: [-30, 0, 12], rotY: 2.0, olcek: 0.85 },
  { kod: "B16", pos: [-20, 0, 22], rotY: -0.35 },
  { kod: "B16", pos: [-23, 0, 25], rotY: 0.4 },
  { kod: "A08", pos: [-18, 0, 20], rotY: 0.2 },
  { kod: "B18", pos: [-24, 0, 3], rotY: 0.4 },
  { kod: "B17", pos: [-14, 0, 12], rotY: 1.0 },
  { kod: "B06", pos: [-17, 0, 16], rotY: 0.7 },
  { kod: "A06", pos: [-11, 0, 2] },
  { kod: "A05", pos: [-11, 0, 2] },

  /* --- PAZAR YERİ --- */
  { kod: "P01", pos: [24, 0, 20], rotY: 3.4 },
  { kod: "P01", pos: [29, 0, 23], rotY: 3.7 },
  { kod: "P01", pos: [33, 0, 18], rotY: 2.6 },
  { kod: "P01", pos: [27, 0, 14], rotY: 0.4 },
  { kod: "B15", pos: [36, 0, 26], rotY: 1.1 },
  { kod: "A04", pos: [32, 0, 30], rotY: -0.8, olcek: 0.8 },
  { kod: "B06", pos: [25, 0, 17], rotY: 1.4 },
  { kod: "B19", pos: [31, 0, 12], rotY: 0.3 },

  /* --- TALİM ALANI --- */
  { kod: "P03", pos: [16, 0, -30], rotY: 0 },
  { kod: "P03", pos: [20, 0, -30], rotY: 0 },
  { kod: "P03", pos: [12, 0, -30], rotY: 0 },
  { kod: "B20", pos: [17, 0, -14], rotY: 0.2 },
  { kod: "B20", pos: [21, 0, -15], rotY: 0.5 },
  { kod: "A04", pos: [26, 0, -18], rotY: 1.6, olcek: 0.75 },

  /* --- ÇOCUK OYUN ALANI --- */
  { kod: "P04", pos: [10.5, 0, 13.5] },
  { kod: "C01", pos: [13, 0, 11], olcek: 1.2 },

  /* --- OTLAK VE AĞILLAR --- */
  { kod: "B13", pos: [42, 0, -4], rotY: 2.4 },
  { kod: "B13", pos: [-32, 0, 32], rotY: 0.8 },
  { kod: "B19", pos: [40, 0, 6], rotY: 0.9 },

  /* --- AV DÖNÜŞ YOLU --- */
  { kod: "H04", pos: [-30, 0, -20], rotY: 0.5 },
  { kod: "H04", pos: [-18, 0, -12], rotY: 0.9 },
  { kod: "B17", pos: [-26, 0, -14], rotY: 1.3 },
];

export const D01_YERLESIM: Yerlesim[] = [...OLCEKLI, ...MAHALLELER];
