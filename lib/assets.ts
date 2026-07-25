/**
 * VARLIK KAYIT DEFTERİ
 *
 * GLB dosyaları henüz üretilmediği için her varlığın bir "greybox" karşılığı var.
 * Bir GLB hazır olduğunda:
 *   1. dosyayı public/assets/d01/ içine koyun
 *   2. aşağıdaki kaydın path alanını doldurun ve hazir: true yapın
 * Kod hiçbir yerde değişmez; sahne otomatik olarak gerçek modeli yükler.
 */

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

export const D01_YERLESIM: Yerlesim[] = [
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
];
