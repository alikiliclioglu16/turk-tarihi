import { DUNYA_OLCEK } from "./dunyaOlcek";

/**
 * ARAZİ
 *
 * Yükseklikler node JSON'larındaki world3d koordinatlarından türetildi:
 *   Oba          y ≈  0   (düz kamp alanı)
 *   Balbal Sırtı y ≈  7 → 12  (kuzeybatıya tırmanan sırt)
 *   Su Başı      y ≈ -2 → 0   (doğuda alçalan dere yatağı)
 *   Eski Yurt    y ≈ -1 → 2   (güneybatıda hafif yükselen düzlük)
 *
 * Zemin mesh'i, oyuncu kontrolcüsü ve varlık yerleştirici AYNI fonksiyonu
 * kullanır; hiçbir şey havada kalmaz veya toprağa gömülmez.
 */

interface YukseklikNoktasi {
  x: number;
  z: number;
  h: number;
  r: number;
}

/** Arazi kontrol noktaları — node koordinatlarıyla eşleşir */
const NOKTALAR: YukseklikNoktasi[] = [
  { x: 0, z: 4, h: 0, r: 30 },        // Oba merkezi
  { x: -44, z: 50, h: 7, r: 26 },     // Balbal sırtı girişi
  { x: -66, z: 70, h: 12, r: 26 },    // Balbal sırtı tepesi
  { x: -52, z: 49, h: 7.3, r: 18 },   // taş dizisi
  { x: 52, z: 30, h: -2, r: 24 },     // Su başı girişi
  { x: 76, z: 4, h: 0, r: 26 },       // Göç yolu
  { x: -30, z: -58, h: -1, r: 24 },   // Eski yurt girişi
  { x: -58, z: -74, h: 0, r: 26 },    // Eski yurt derinliği
  { x: 0, z: -86, h: 2, r: 28 },      // Final açıklığı
];

/** Dere yatağı — su başında araziyi oyar */
const DERE: [number, number][] = [
  [86, -8], [80, 6], [70, 18], [60, 28], [52, 34], [44, 40],
];

function dereyeUzaklik(x: number, z: number): number {
  let en = Infinity;
  for (let i = 0; i < DERE.length - 1; i++) {
    const [ax, az] = DERE[i];
    const [bx, bz] = DERE[i + 1];
    const dx = bx - ax, dz = bz - az;
    const uz2 = dx * dx + dz * dz;
    let t = uz2 ? ((x - ax) * dx + (z - az) * dz) / uz2 : 0;
    t = Math.max(0, Math.min(1, t));
    const px = ax + dx * t, pz = az + dz * t;
    en = Math.min(en, Math.hypot(x - px, z - pz));
  }
  return en;
}

export function araziYukseklik(gx: number, gz: number): number {
  // dünya ölçeğinden tasarım ölçeğine dön
  const x = gx / DUNYA_OLCEK;
  const z = gz / DUNYA_OLCEK;
  // temel dalgalı bozkır
  const temel =
    Math.sin(x * 0.032) * Math.cos(z * 0.026) * 2.4 +
    Math.sin(x * 0.085 + 2.1) * Math.sin(z * 0.07) * 1.05 +
    Math.sin(x * 0.19 + 1.1) * Math.cos(z * 0.16) * 0.35;

  // bölge yükseklik hedefleri
  let agirlik = 0;
  let hedef = 0;
  for (const n of NOKTALAR) {
    const d = Math.hypot(x - n.x, z - n.z);
    const t = Math.max(0, 1 - d / n.r);
    const w = t * t * (3 - 2 * t); // smoothstep
    agirlik += w;
    hedef += w * n.h;
  }
  const etki = Math.min(1, agirlik);
  const ortalama = agirlik > 0 ? hedef / agirlik : 0;

  let y = temel * (1 - etki * 0.82) + ortalama * etki;

  // dere yatağını oy
  const dd = dereyeUzaklik(x, z);
  if (dd < 9) {
    const k = 1 - dd / 9;
    y -= k * k * 2.6;
  }

  // ---- DÜNYA SINIRI ----
  // Belirli bir yarıçaptan sonra arazi hızla yükselir: dünyayı çevreleyen
  // doğal bir tepe kuşağı. Oyuncu buranın ötesine geçemez; sonsuz boş
  // ova yerine kapalı ve okunabilir bir dünya olur.
  const merkezUz = Math.hypot(x, z);
  if (merkezUz > SINIR_IC) {
    const k = Math.min(1, (merkezUz - SINIR_IC) / (SINIR_DIS - SINIR_IC));
    const yumusak = k * k * (3 - 2 * k);
    y += yumusak * 13;
    // tepe sırtında dalgalanma
    y += yumusak * Math.sin(Math.atan2(z, x) * 7) * 2.4;
  }

  // kamp alanı tamamen düz olsun
  const dOba = Math.hypot(x, z - 4);
  if (dOba < 15) {
    const k = 1 - dOba / 15;
    y *= 1 - k * k * 0.95;
  }

  return y * DUNYA_OLCEK;
}

/** Dünya sınırı — tasarım biriminde (× DUNYA_OLCEK = metre) */
export const SINIR_IC = 108;   // tepeler burada yükselmeye başlar
export const SINIR_DIS = 132;  // tepe zirvesi

/** Su yüzeyi kotu — dere bu seviyede akar */
export const SU_KOTU = -3.4 * DUNYA_OLCEK;

export function dereIcindeMi(gx: number, gz: number): boolean {
  return dereyeUzaklik(gx / DUNYA_OLCEK, gz / DUNYA_OLCEK) < 4.2;
}

/** Dünya sınırı (metre) */
/**
 * Oyuncunun gidebileceği en uzak nokta.
 * En uzak durak (node 05) merkeze 96 birim; sınır 118 birim —
 * yani bölgelerin ~15 saniye ötesine kadar gidilebilir.
 */
export const DUNYA_YARICAP = 118 * DUNYA_OLCEK;
