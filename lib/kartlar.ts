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

/** Keşif kartı — hotspot ve bonus keşiflerden üretilir */
export interface KesifKarti {
  id: string;
  baslik: string;
  altBaslik: string;
  metin: string;
  ikon: string;
  tur: "hotspot" | "bonus" | "kisi";
}

const IKONLAR: Record<string, string> = {
  hotspot: "🔍", bonus: "✨", kisi: "👤",
};

export function kesifKartiYap(
  id: string, baslik: string, altBaslik: string, metin: string,
  tur: KesifKarti["tur"] = "hotspot"
): KesifKarti {
  return { id, baslik, altBaslik, metin, ikon: IKONLAR[tur] ?? "🔍", tur };
}
