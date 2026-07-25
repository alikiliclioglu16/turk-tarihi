import type { TourNode, Hotspot } from "./types";

/**
 * KOORDİNAT ADAPTERİ
 *
 * Node JSON'ları 3B dünya koordinatlarıyla yazıldı (world.guidePosition,
 * hotspot.position). 2.5D sahne ise yüzde tabanlı çalışır.
 *
 * Bu adapter ikisini birbirine çevirir; JSON'a dokunmaya gerek kalmaz.
 * İleride JSON'a opsiyonel `visual` alanı eklenirse önce o okunur.
 */

export interface SahneKonum {
  x: number; // 0-100, sahnenin solundan yüzde
  y: number; // 0-100, sahnenin üstünden yüzde
}

/** Bölgenin dünya sınırları — 3B koordinatları sahneye oturtmak için */
const BOLGE_SINIRLARI: Record<string, { xMin: number; xMax: number; zMin: number; zMax: number }> = {
  oba: { xMin: -11, xMax: 11, zMin: -7, zMax: 13 },
  balbal_sirti: { xMin: -12, xMax: 2, zMin: 2, zMax: 12 },
  su_basi: { xMin: -4, xMax: 14, zMin: -2, zMax: 12 },
  eski_yurt: { xMin: -10, xMax: 6, zMin: -12, zMax: 2 },
};

interface GorselAlan {
  hotspots?: Record<string, SahneKonum>;
  camera?: { x: number; y: number; zoom: number };
  guidePose?: string;
}

function gorsel(nod: TourNode): GorselAlan | undefined {
  return (nod as TourNode & { visual?: GorselAlan }).visual;
}

/**
 * Dünya koordinatını sahne yüzdesine çevirir.
 * X ekranın yatayına, Z derinliğe (ekranda dikey konum) eşlenir.
 * Uzaktaki nesneler yukarıda ve merkeze yakın görünür — perspektif hissi.
 */
export function dunyadanSahneye(
  zoneId: string,
  pos: [number, number, number]
): SahneKonum {
  const s = BOLGE_SINIRLARI[zoneId] ?? BOLGE_SINIRLARI.oba;
  const [wx, wy, wz] = pos;

  // derinlik: zMin (uzak) → 0, zMax (yakın) → 1
  const derinlik = Math.min(1, Math.max(0, (wz - s.zMin) / (s.zMax - s.zMin)));

  // uzaktaki nesneler yatayda merkeze doğru toplanır
  const yatayGenislik = 0.42 + derinlik * 0.5;
  const xNorm = (wx - s.xMin) / (s.xMax - s.xMin); // 0-1
  const x = 50 + (xNorm - 0.5) * 100 * yatayGenislik;

  // dikey: uzak yukarıda, yakın aşağıda; nesne yüksekliği yukarı iter
  const ufuk = 46;
  const zemin = 92;
  const y = ufuk + (zemin - ufuk) * derinlik - wy * 3.4;

  return {
    x: Math.min(97, Math.max(3, x)),
    y: Math.min(97, Math.max(6, y)),
  };
}

/** Hotspotun sahne konumu — önce visual alanı, yoksa adapter */
export function hotspotKonum(nod: TourNode, h: Hotspot): SahneKonum {
  const v = gorsel(nod)?.hotspots?.[h.id];
  if (v) return v;
  return dunyadanSahneye(nod.zoneId, h.position);
}

/** Durağın kamera hedefi: zorunlu hotspotların ortalaması */
export function kameraPreset(nod: TourNode): { x: number; y: number; zoom: number } {
  const v = gorsel(nod)?.camera;
  if (v) return v;

  const zorunlu = nod.hotspots.filter((h) => nod.completion.requiredHotspots.includes(h.id));
  const liste = (zorunlu.length ? zorunlu : nod.hotspots).map((h) => hotspotKonum(nod, h));
  if (!liste.length) return { x: 50, y: 55, zoom: 1 };

  const x = liste.reduce((a, k) => a + k.x, 0) / liste.length;
  const y = liste.reduce((a, k) => a + k.y, 0) / liste.length;

  // hotspotların yayılımı geniş ise daha az yakınlaş
  const yayilim = Math.max(
    ...liste.map((k) => Math.hypot(k.x - x, k.y - y))
  );
  const zoom = yayilim > 26 ? 1.08 : yayilim > 15 ? 1.18 : 1.3;

  return { x, y, zoom };
}

/** Dede Korkut'un sahnedeki tarafı — hotspotların ağırlık merkezine göre */
export function rehberTarafi(nod: TourNode): "sol" | "sag" {
  const k = kameraPreset(nod);
  return k.x > 52 ? "sol" : "sag";
}
