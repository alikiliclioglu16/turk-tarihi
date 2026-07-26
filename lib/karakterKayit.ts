import type { OyunKlibi } from "./klipEsleme";

/**
 * KARAKTER KAYDI
 *
 * Hangi aktivite hangi karakter modelini ve hangi klibi kullanır,
 * hangi renk varyantını alır — hepsi burada.
 *
 * Yeni bir karakter GLB'si geldiğinde yalnız bu dosyaya bir satır
 * eklenir; sahne kodu değişmez.
 */

export type KarakterTuru =
  | "gezgin" | "zanaatkar_erkek" | "kadin_zanaat" | "asker"
  | "yasli_erkek" | "yasli_kadin" | "cocuk_erkek" | "cocuk_kiz";

const KOK = "/assets/d01/characters/glb";
const DOKU_KOK = "/assets/d01/characters/doku";

/** Hangi karakter GLB'leri hazır — geldikçe true yapılır */
export const HAZIR_KARAKTERLER: Record<KarakterTuru, boolean> = {
  gezgin: true,
  zanaatkar_erkek: true,
  kadin_zanaat: false,
  asker: false,
  yasli_erkek: false,
  yasli_kadin: false,
  cocuk_erkek: false,
  cocuk_kiz: false,
};

/** Aktivite → hangi karakter modelini kullanır */
export const AKTIVITE_KARAKTER: Record<string, KarakterTuru> = {
  // zanaatkâr erkek — sekiz farklı iş, tek model
  demirci: "zanaatkar_erkek",
  okYapan: "zanaatkar_erkek",
  comlekci: "zanaatkar_erkek",
  deriGeren: "zanaatkar_erkek",
  ipBuken: "zanaatkar_erkek",
  keceBasan: "zanaatkar_erkek",
  avci: "zanaatkar_erkek",
  coban: "zanaatkar_erkek",
  pazarci: "zanaatkar_erkek",
  tartan: "zanaatkar_erkek",
  sohbet: "zanaatkar_erkek",
  bekleyen: "zanaatkar_erkek",
  // henüz modeli gelmeyenler
  // kadın modeli gelene kadar zanaatkâr modeli kullanılır
  dokumaci: "zanaatkar_erkek",
  asci: "zanaatkar_erkek",
  dansci: "kadin_zanaat",
  asker: "zanaatkar_erkek",
  guresci: "zanaatkar_erkek",
  atTerbiyecisi: "zanaatkar_erkek",
  ozan: "yasli_erkek",
  cocuk: "cocuk_erkek",
  asikAtan: "cocuk_erkek",
  asikIzleyen: "cocuk_erkek",
};

/** Aktivite → hangi taban klip */
export const AKTIVITE_KLIP: Record<string, OyunKlibi> = {
  demirci: "work_hammer",
  okYapan: "work_hammer",
  comlekci: "sit",
  ipBuken: "sit",
  ozan: "sit",
  dokumaci: "work_pull",
  deriGeren: "work_pull",
  keceBasan: "work_ground",
  asci: "work_ground",
  asikAtan: "work_ground",
  asikIzleyen: "work_ground",
  asker: "shoot_bow",
  guresci: "wrestle",
  atTerbiyecisi: "idle",
  dansci: "dance",
  pazarci: "talk",
  tartan: "talk",
  sohbet: "talk",
  bekleyen: "idle",
  coban: "walk",
  avci: "walk",
  cocuk: "jump",
};

/** Renk varyantları — koddan üretilenler */
export const DOKU_VARYANTLARI = ["kahve", "kiremit", "kum", "mavi", "mor", "yesil"] as const;

export function glbVarMi(aktivite: string): boolean {
  const t = AKTIVITE_KARAKTER[aktivite];
  return Boolean(t && HAZIR_KARAKTERLER[t]);
}

export function karakterYolu(aktivite: string): string {
  const t = AKTIVITE_KARAKTER[aktivite] ?? "zanaatkar_erkek";
  return `${KOK}/karakter_${t}.glb`;
}

/**
 * Kişi kimliğinden kararlı bir renk varyantı seçer.
 * Aynı kişi her açılışta aynı rengi alır; kalabalık ise çeşitlenir.
 */
export function dokuYolu(kisiId: string, aktivite: string): string | null {
  const t = AKTIVITE_KARAKTER[aktivite];
  if (!t || !HAZIR_KARAKTERLER[t]) return null;
  let h = 0;
  for (let i = 0; i < kisiId.length; i++) h = (h * 31 + kisiId.charCodeAt(i)) >>> 0;
  const v = DOKU_VARYANTLARI[h % DOKU_VARYANTLARI.length];
  return `${DOKU_KOK}/karakter_${t}_${v}.jpg`;
}

/** Kişi kimliğinden kararlı faz kayması — kalabalık senkron yürümesin */
export function fazHesapla(kisiId: string): number {
  let h = 7;
  for (let i = 0; i < kisiId.length; i++) h = (h * 131 + kisiId.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}
