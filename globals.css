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

/* ============================================================
   MÜZE REFERANSLARI
   "Bu bilgi nereden geliyor?" sorusunun görsel cevabı.
   Discovery Tour'da her durakta gerçek müze eseri gösterilir.
   ============================================================ */

export interface MuzeReferansi {
  hedefId: string;
  gorsel: string;
  baslik: string;
  kurum: string;
  envanter?: string;
  yil?: string;
  lisans?: string;
  /** kurumun kayıt sayfası */
  bag?: string;
  /** açık erişim görsel ucu — yerel dosya yoksa buradan gösterilir */
  gorselBag?: string;
  aciklama?: string;
  /**
   * Eserin D01 dönemine uygunluk derecesi.
   * Sonraki dönem eserleri KARŞILAŞTIRMA amaçlıdır, doğrudan kanıt değildir;
   * arayüz bunu öğrenciye açıkça bildirir.
   */
  uygunluk?: string;
  dogrudanKanit?: boolean;
}

export const MUZE_REFERANS_KOK = "/assets/d01/muze";

/**
 * Referanslar geldikçe buraya eklenir. Kart arka yüzünde
 * "gerçek kaynak" bölümü olarak görünür.
 */
export const MUZE_REFERANSLARI: MuzeReferansi[] = [
  {
    hedefId: "hs_yari_gomulu_kap",
    gorsel: `${MUZE_REFERANS_KOK}/met_451667.jpg`,
    baslik: "Samarqand yapımı toprak kap",
    kurum: "The Metropolitan Museum of Art",
    envanter: "61.217",
    yil: "10. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/451667",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/451667/875178/main-image",
    aciklama: "Kap, dönemsel seramik biçimini ve üretim izlerini karşılaştırmaya yardım eder.",
    uygunluk: "Dönemsel kanıt",
    dogrudanKanit: true,
  },
  {
    hedefId: "og_comlek",
    gorsel: `${MUZE_REFERANS_KOK}/met_451649.jpg`,
    baslik: "Rozet bezemeli Samarqand kâsesi",
    kurum: "The Metropolitan Museum of Art",
    envanter: "61.144",
    yil: "10. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/451649",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/451649/886389/main-image",
    aciklama: "Kâse, kil biçimlendirme ve yüzey bezemesini birlikte gösterir.",
    uygunluk: "Dönemsel kanıt",
    dogrudanKanit: true,
  },
  {
    hedefId: "hs_canak_parcalari",
    gorsel: `${MUZE_REFERANS_KOK}/met_454607.jpg`,
    baslik: "Bezemeli Özbekistan kâsesi",
    kurum: "The Metropolitan Museum of Art",
    envanter: "2003.415",
    yil: "10. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/454607",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/454607/866197/main-image",
    aciklama: "Kâse, seramik parçalarının özgün kabı düşündürmesine örnek sağlar.",
    uygunluk: "Dönemsel kanıt",
    dogrudanKanit: true,
  },
  {
    hedefId: "hs_kilim_parcasi",
    gorsel: `${MUZE_REFERANS_KOK}/met_44930.jpg`,
    baslik: "Metal iplikli Orta Asya dokuması",
    kurum: "The Metropolitan Museum of Art",
    envanter: "24.166.33",
    yil: "11. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/44930",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/44930/128914/main-image",
    aciklama: "Parça, dokuma yüzeyi ve metal iplik kullanımını karşılaştırır.",
    uygunluk: "Dönemsel kanıt",
    dogrudanKanit: true,
  },
  {
    hedefId: "hs_solmus_kilim",
    gorsel: `${MUZE_REFERANS_KOK}/met_73207.jpg`,
    baslik: "At figürlü Orta Asya ipeği",
    kurum: "The Metropolitan Museum of Art",
    envanter: "2006.173",
    yil: "8.–9. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/73207",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/73207/135261/main-image",
    aciklama: "Dokuma, renk ve hayvan düzeninin zamanla aşınmasını düşündürür.",
    uygunluk: "Yakın dönem",
    dogrudanKanit: true,
  },
  {
    hedefId: "og_pz_ipek",
    gorsel: `${MUZE_REFERANS_KOK}/met_39733.jpg`,
    baslik: "Çiçekli ejderha duvar dokuması",
    kurum: "The Metropolitan Museum of Art",
    envanter: "1987.275",
    yil: "11.–12. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/39733",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/39733/147899/main-image",
    aciklama: "İpek dokuma, uzak bölgeler arasında taşınan teknikleri görünür kılar.",
    uygunluk: "Sınır dönem",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_ip",
    gorsel: `${MUZE_REFERANS_KOK}/met_40108.jpg`,
    baslik: "Yuvarlak desenli ipek dokuma",
    kurum: "The Metropolitan Museum of Art",
    envanter: "1998.147",
    yil: "8. sonu–9. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40108",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40108/154183/main-image",
    aciklama: "Dokuma, ince ipliklerin düzenli desenlere nasıl dönüştüğünü gösterir.",
    uygunluk: "Yakın dönem",
    dogrudanKanit: true,
  },
  {
    hedefId: "og_pz_kervan",
    gorsel: `${MUZE_REFERANS_KOK}/met_39598.jpg`,
    baslik: "Boynuzlu hayvanlı Orta Asya dokuması",
    kurum: "The Metropolitan Museum of Art",
    envanter: "1996.1a, b",
    yil: "7.–9. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/39598",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/39598/197539/main-image",
    aciklama: "Dokuma, ticaret yollarında taşınan desen anlayışına örnek oluşturur.",
    uygunluk: "Yakın dönem",
    dogrudanKanit: true,
  },
  {
    hedefId: "og_pz_takas",
    gorsel: `${MUZE_REFERANS_KOK}/met_327824.jpg`,
    baslik: "Ördekli ipek dokuma parçası",
    kurum: "The Metropolitan Museum of Art",
    envanter: "1999.325.229",
    yil: "8.–9. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/327824",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/327824/699839/main-image",
    aciklama: "Küçük parça, değerli kumaşların taşınabilir mal olabileceğini gösterir.",
    uygunluk: "Yakın dönem",
    dogrudanKanit: true,
  },
  {
    hedefId: "og_ot_ic",
    gorsel: `${MUZE_REFERANS_KOK}/met_327825.jpg`,
    baslik: "Ördek desenli ipek parçası",
    kurum: "The Metropolitan Museum of Art",
    envanter: "1999.325.230",
    yil: "8.–9. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/327825",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/327825/699840/main-image",
    aciklama: "Parça, dokumaların yaşam alanlarında taşınabilir süs olabileceğini düşündürür.",
    uygunluk: "Yakın dönem",
    dogrudanKanit: true,
  },
  {
    hedefId: "og_kosum",
    gorsel: `${MUZE_REFERANS_KOK}/met_65323.jpg`,
    baslik: "Ajurlu altın koşum bağlantısı",
    kurum: "The Metropolitan Museum of Art",
    envanter: "2003.24.10",
    yil: "7.–9. yüzyıl",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/65323",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/65323/102008/main-image",
    aciklama: "Bağlantı, taşınabilir metal parçaların koşumda kullanılmasını gösterir.",
    uygunluk: "Yakın dönem",
    dogrudanKanit: true,
  },
  {
    hedefId: "og_gures",
    gorsel: `${MUZE_REFERANS_KOK}/met_39990.jpg`,
    baslik: "İki güreşçili seramik parçası",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.48",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/39990",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/39990/2304629/main-image",
    aciklama: "Parça, güreş hareketinin görsel anlatımına yakın bir karşılaştırma sunar.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_ategitim",
    gorsel: `${MUZE_REFERANS_KOK}/met_40029.jpg`,
    baslik: "Toprak at başı",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.59",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40029",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40029/78566/main-image",
    aciklama: "At başı, dönemsel hayvan betimlemelerini karşılaştırmaya yardım eder.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_pz_hayvan",
    gorsel: `${MUZE_REFERANS_KOK}/met_40032.jpg`,
    baslik: "At veya deve başı",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.62",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40032",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40032/78569/main-image",
    aciklama: "Belirsiz hayvan başı, sınıflandırmanın dikkat gerektirdiğini gösterir.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_pz_kervan",
    gorsel: `${MUZE_REFERANS_KOK}/met_40041.jpg`,
    baslik: "Küçük at veya deve başı",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.72",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40041",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40041/78579/main-image",
    aciklama: "Parça, kervan hayvanlarının görsel yorumunda temkinli olmayı öğretir.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_pz_han",
    gorsel: `${MUZE_REFERANS_KOK}/met_40040.jpg`,
    baslik: "Toprak deve başı",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.70",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40040",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40040/78577/main-image",
    aciklama: "Deve başı, uzun yol taşımacılığını konuşmak için karşılaştırma sağlar.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_or_atli",
    gorsel: `${MUZE_REFERANS_KOK}/met_40034.jpg`,
    baslik: "Toprak at gövdesi parçası",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.64",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40034",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40034/78571/main-image",
    aciklama: "At parçası, eksik buluntudan bütün biçim kurmanın sınırlarını gösterir.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_or_at",
    gorsel: `${MUZE_REFERANS_KOK}/met_50377.jpg`,
    baslik: "İkinci toprak at parçası",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.58",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/50377",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/50377/136455/main-image",
    aciklama: "Parça, hayvan biçiminin küçük kalıntılardan nasıl tartışıldığını gösterir.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_su_sira",
    gorsel: `${MUZE_REFERANS_KOK}/met_40037.jpg`,
    baslik: "Koyun başı olarak tanımlanan parça",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.67",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40037",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40037/78574/main-image",
    aciklama: "Soru işareti, müze tanımlarının bazen kesin olmadığını hatırlatır.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_su_balik",
    gorsel: `${MUZE_REFERANS_KOK}/met_40039.jpg`,
    baslik: "Toprak ördek figürü",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.69",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40039",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40039/78576/main-image",
    aciklama: "Ördek figürü, su çevresindeki hayvan çeşitliliğine karşılaştırma sağlar.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_dans",
    gorsel: `${MUZE_REFERANS_KOK}/met_40042.jpg`,
    baslik: "Yan yana iki insan figürü",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.71",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40042",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40042/78578/main-image",
    aciklama: "İki figür, toplu hareket yorumunun kanıt sınırlarını düşündürür.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_ey_seramik",
    gorsel: `${MUZE_REFERANS_KOK}/met_40028.jpg`,
    baslik: "Bezemeli toprak parçası",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.57",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40028",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40028/1691502/main-image",
    aciklama: "Parça, bezemenin küçük kalıntılarda nasıl korunduğunu gösterir.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_ey_katman",
    gorsel: `${MUZE_REFERANS_KOK}/met_40027.jpg`,
    baslik: "Kil bezeme parçası",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.56",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40027",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40027/78564/main-image",
    aciklama: "Küçük parça, buluntu katmanının yorum için önemini hatırlatır.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_ey_hoyuk",
    gorsel: `${MUZE_REFERANS_KOK}/met_40293.jpg`,
    baslik: "İkinci kil bezeme parçası",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.54",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/40293",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/40293/78562/main-image",
    aciklama: "Parça, yerleşim toprağından çıkan küçük kanıtların değerini gösterir.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
  {
    hedefId: "og_ey_koruma",
    gorsel: `${MUZE_REFERANS_KOK}/met_39992.jpg`,
    baslik: "Kil kabartma parçası",
    kurum: "The Metropolitan Museum of Art",
    envanter: "30.32.50",
    yil: "12. yüzyıl başı",
    lisans: "Public Domain / Open Access",
    bag: "https://www.metmuseum.org/art/collection/search/39992",
    gorselBag: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/39992/2304632/main-image",
    aciklama: "Kabartma, parçanın bağlamıyla birlikte korunmasının neden önemli olduğunu açıklar.",
    uygunluk: "Sonraki dönem — karşılaştırma",
    dogrudanKanit: false,
  },
];

export function muzeReferansi(hedefId: string): MuzeReferansi | null {
  return MUZE_REFERANSLARI.find((m) => m.hedefId === hedefId) ?? null;
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
