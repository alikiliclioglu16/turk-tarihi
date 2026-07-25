/**
 * VARLIK MANİFESTİ
 *
 * Görsel dosya yolları hiçbir bileşene gömülmez; hepsi buradan çözülür.
 * ChatGPT bir WebP teslim ettiğinde yalnızca bu dosyadaki kaydın `hazir`
 * alanı true yapılır — başka hiçbir yerde değişiklik gerekmez.
 *
 * Dosya yoksa bileşenler sessizce kontrollü yer tutucuya düşer.
 */

export type VarlikSinifi = "zone" | "hotspot" | "guide" | "card" | "ui";

export interface VarlikKaydi {
  id: string;
  sinif: VarlikSinifi;
  path: string;
  hazir: boolean;
  /** Yer tutucu için ipucu: nesnenin ne olduğu (SVG silueti seçer) */
  tur?: "kopuz" | "ates" | "otag" | "sandik" | "balbal" | "tas" | "kilim" | "kap" | "genel";
  /** Sahne katmanı için derinlik (0 = sabit arka plan, 1 = en öndeki) */
  derinlik?: number;
  alt?: string;
}

const K = (
  id: string,
  sinif: VarlikSinifi,
  path: string,
  ekstra: Partial<VarlikKaydi> = {}
): VarlikKaydi => ({ id, sinif, path, hazir: false, ...ekstra });

export const MANIFEST: Record<string, VarlikKaydi> = {
  /* ---------- OBA BÖLGESİ SAHNE KATMANLARI ---------- */
  "zone.oba.sky": K("zone.oba.sky", "zone", "/assets/d01/zones/oba/d01_zone_oba_sky.webp", {
    derinlik: 0.0, alt: "Yıldızlı gece gökyüzü",
  }),
  "zone.oba.bg": K("zone.oba.bg", "zone", "/assets/d01/zones/oba/d01_zone_oba_bg.webp", {
    derinlik: 0.12, alt: "Uzak dağlar ve bozkır ufku",
  }),
  "zone.oba.mid": K("zone.oba.mid", "zone", "/assets/d01/zones/oba/d01_zone_oba_mid.webp", {
    derinlik: 0.42, alt: "Otağlar ve oba yerleşimi",
  }),
  "zone.oba.mid2": K("zone.oba.mid2", "zone", "/assets/d01/zones/oba/d01_zone_oba_mid2.webp", {
    derinlik: 0.62, alt: "Ocak alanı ve yakın çevre",
  }),
  "zone.oba.fg": K("zone.oba.fg", "zone", "/assets/d01/zones/oba/d01_zone_oba_fg.webp", {
    derinlik: 1.0, alt: "Ön plan çalıları ve taşlar",
  }),

  /* ---------- NODE 01 HOTSPOTLARI ---------- */
  "hs.d01_n01.hs_yol_taslari": K("hs.d01_n01.hs_yol_taslari", "hotspot",
    "/assets/d01/hotspots/d01_n01_hs_yol_taslari.webp", { tur: "tas", alt: "Yere dizilmiş yol taşları" }),
  "hs.d01_n01.hs_ates_isigi": K("hs.d01_n01.hs_ates_isigi", "hotspot",
    "/assets/d01/hotspots/d01_n01_hs_ates_isigi.webp", { tur: "ates", alt: "Ocak ateşi" }),
  "hs.d01_n01.hs_kopuz": K("hs.d01_n01.hs_kopuz", "hotspot",
    "/assets/d01/hotspots/d01_n01_hs_kopuz.webp", { tur: "kopuz", alt: "Kopuz" }),
  "hs.d01_n01.hs_otag_kapisi": K("hs.d01_n01.hs_otag_kapisi", "hotspot",
    "/assets/d01/hotspots/d01_n01_hs_otag_kapisi.webp", { tur: "otag", alt: "Otağın kapısı" }),

  /* ---------- NODE 02 ---------- */
  "hs.d01_n02.hs_ocak": K("hs.d01_n02.hs_ocak", "hotspot",
    "/assets/d01/hotspots/d01_n02_hs_ocak.webp", { tur: "ates", alt: "Ocak taşları" }),
  "hs.d01_n02.hs_sacayak_kazan": K("hs.d01_n02.hs_sacayak_kazan", "hotspot",
    "/assets/d01/hotspots/d01_n02_hs_sacayak_kazan.webp", { tur: "kap", alt: "Sacayak ve kazan" }),
  "hs.d01_n02.hs_ahsap_canak": K("hs.d01_n02.hs_ahsap_canak", "hotspot",
    "/assets/d01/hotspots/d01_n02_hs_ahsap_canak.webp", { tur: "kap", alt: "Ahşap çanak" }),
  "hs.d01_n02.hs_minder": K("hs.d01_n02.hs_minder", "hotspot",
    "/assets/d01/hotspots/d01_n02_hs_minder.webp", { tur: "kilim", alt: "Minder" }),
  "hs.d01_n02.hs_heybe": K("hs.d01_n02.hs_heybe", "hotspot",
    "/assets/d01/hotspots/d01_n02_hs_heybe.webp", { tur: "kilim", alt: "Heybe" }),

  /* ---------- NODE 03 ---------- */
  "hs.d01_n03.hs_sandik_kilidi": K("hs.d01_n03.hs_sandik_kilidi", "hotspot",
    "/assets/d01/hotspots/d01_n03_hs_sandik_kilidi.webp", { tur: "sandik", alt: "Sandığın kilidi" }),
  "hs.d01_n03.hs_tomar": K("hs.d01_n03.hs_tomar", "hotspot",
    "/assets/d01/hotspots/d01_n03_hs_tomar.webp", { tur: "genel", alt: "Tomar" }),
  "hs.d01_n03.hs_deri_kese": K("hs.d01_n03.hs_deri_kese", "hotspot",
    "/assets/d01/hotspots/d01_n03_hs_deri_kese.webp", { tur: "genel", alt: "Deri kese" }),
  "hs.d01_n03.hs_bakir_ayna": K("hs.d01_n03.hs_bakir_ayna", "hotspot",
    "/assets/d01/hotspots/d01_n03_hs_bakir_ayna.webp", { tur: "genel", alt: "Bakır ayna" }),
  "hs.d01_n03.hs_kilim_parcasi": K("hs.d01_n03.hs_kilim_parcasi", "hotspot",
    "/assets/d01/hotspots/d01_n03_hs_kilim_parcasi.webp", { tur: "kilim", alt: "Kilim parçası" }),

  /* ---------- DEDE KORKUT POZLARI ---------- */
  "dk.DK01": K("dk.DK01", "guide", "/assets/d01/dede-korkut/dede_korkut_idle.webp", { alt: "Dede Korkut, sakin bekleyiş" }),
  "dk.DK02": K("dk.DK02", "guide", "/assets/d01/dede-korkut/dede_korkut_point_right.webp", { alt: "Dede Korkut sağa işaret ediyor" }),
  "dk.DK03": K("dk.DK03", "guide", "/assets/d01/dede-korkut/dede_korkut_point_left.webp", { alt: "Dede Korkut sola işaret ediyor" }),
  "dk.DK04": K("dk.DK04", "guide", "/assets/d01/dede-korkut/dede_korkut_talk.webp", { alt: "Dede Korkut anlatıyor" }),
  "dk.DK05": K("dk.DK05", "guide", "/assets/d01/dede-korkut/dede_korkut_think.webp", { alt: "Dede Korkut düşünüyor" }),
  "dk.DK06": K("dk.DK06", "guide", "/assets/d01/dede-korkut/dede_korkut_approve.webp", { alt: "Dede Korkut onaylıyor" }),
  "dk.DK07": K("dk.DK07", "guide", "/assets/d01/dede-korkut/dede_korkut_guide.webp", { alt: "Dede Korkut yönlendiriyor" }),
  "dk.DK08": K("dk.DK08", "guide", "/assets/d01/dede-korkut/dede_korkut_final.webp", { alt: "Dede Korkut törensel kapanış" }),

  /* ---------- KARTLAR ---------- */
  "card.card_01": K("card.card_01", "card", "/assets/d01/cards/d01_card_01.webp"),
  "card.card_02": K("card.card_02", "card", "/assets/d01/cards/d01_card_02.webp"),
  "card.card_03": K("card.card_03", "card", "/assets/d01/cards/d01_card_03.webp"),
};

export function varlikCoz(id: string): VarlikKaydi | null {
  return MANIFEST[id] ?? null;
}

/** Hotspot görseli için manifest anahtarı */
export function hotspotAnahtar(nodeId: string, hotspotId: string): string {
  return `hs.${nodeId}.${hotspotId}`;
}

/** Hazır olan varlığın yolu, yoksa null (bileşen yer tutucuya düşer) */
export function varlikYolu(id: string): string | null {
  const v = MANIFEST[id];
  return v && v.hazir ? v.path : null;
}

/** Bölgenin katman listesi — arkadan öne sıralı */
export function bolgeKatmanlari(zoneId: string): VarlikKaydi[] {
  const sira = ["sky", "bg", "mid", "mid2", "fg"];
  return sira
    .map((k) => MANIFEST[`zone.${zoneId}.${k}`])
    .filter((v): v is VarlikKaydi => Boolean(v));
}
