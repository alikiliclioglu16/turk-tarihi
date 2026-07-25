/**
 * KART SİSTEMİ
 *
 * İki tür kart var:
 *  1. Durak kartları (card_01…card_10) — ChatGPT'nin ön/arka yüz görselleri
 *  2. Keşif kartları — her hotspot keşfinde üretilen küçük bilgi kartı
 *
 * Keşfedilen her şey bir karta dönüşür; koleksiyon öğrenmeyi pekiştirir.
 */

export interface DurakKarti {
  cardId: string;
  title: string;
  concept: string;
  frontImage: string;
  backImage: string;
}

const KOK = "/assets/d01/cards";

export const DURAK_KARTLARI: DurakKarti[] = [
  { cardId: "card_01", title: "Kopuzun Sesi", concept: "İz" },
  { cardId: "card_02", title: "Obanın Düzeni", concept: "Düzen" },
  { cardId: "card_03", title: "Tarih Sandığı", concept: "Hatıra" },
  { cardId: "card_04", title: "Taştaki İzler", concept: "Gözlem" },
  { cardId: "card_05", title: "Bilmiyoruz Demek", concept: "Sınır" },
  { cardId: "card_06", title: "Suyun Rehberliği", concept: "Çevre" },
  { cardId: "card_07", title: "Göçün Yolu", concept: "Hareket" },
  { cardId: "card_08", title: "Yerinde Kalan Buluntu", concept: "Bağlam" },
  { cardId: "card_09", title: "Değişen ve Süren", concept: "Süreklilik" },
  { cardId: "card_10", title: "İlk Sandık Açılıyor", concept: "Sentez" },
].map((k) => ({
  ...k,
  frontImage: `${KOK}/${k.cardId}_front.webp`,
  backImage: `${KOK}/${k.cardId}_back.webp`,
}));

export function durakKarti(cardId: string): DurakKarti | null {
  return DURAK_KARTLARI.find((k) => k.cardId === cardId) ?? null;
}

/** Keşif kartı — hotspot, bonus ve öğrenme noktalarından üretilir */
export interface KesifKarti {
  id: string;
  baslik: string;
  altBaslik: string;
  /** ön yüz: kısa tanım */
  metin: string;
  /** arka yüz: açıklama ve kaynak (varsa) */
  aciklama?: string | null;
  kaynak?: string | null;
  ikon: string;
  tur: "hotspot" | "bonus" | "kisi" | "ogrenme";
  /** görsel hazırsa yolu; yoksa null */
  gorsel?: string | null;
}

/**
 * Keşif kartı görseli.
 * ChatGPT görselleri `public/assets/d01/kesif/` klasörüne kimlikle
 * kaydedildiğinde otomatik devreye girer: `<id>_on.webp` / `<id>_arka.webp`
 */
export const KESIF_GORSEL_KOK = "/assets/d01/kesif";
export const HAZIR_KESIF_GORSELLERI = new Set<string>([
  // görseller geldikçe buraya kimlik eklenir, örn: "og_ok"
]);

export function kesifGorseli(id: string, yuz: "on" | "arka"): string | null {
  if (!HAZIR_KESIF_GORSELLERI.has(id)) return null;
  return `${KESIF_GORSEL_KOK}/${id}_${yuz}.webp`;
}

const IKONLAR: Record<string, string> = {
  hotspot: "🔍", bonus: "✨", kisi: "👤", ogrenme: "📜",
};

export function kesifKartiYap(
  id: string, baslik: string, altBaslik: string, metin: string,
  tur: KesifKarti["tur"] = "hotspot",
  aciklama: string | null = null,
  kaynak: string | null = null
): KesifKarti {
  return {
    id, baslik, altBaslik, metin, aciklama, kaynak,
    ikon: IKONLAR[tur] ?? "🔍", tur,
    gorsel: kesifGorseli(id, "on"),
  };
}
