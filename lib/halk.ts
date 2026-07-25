import type { Aktivite } from "@/components/scene/models/InsanModel";

/**
 * OBA HALKI — kim, nerede, ne yapıyor
 *
 * Konumlar dünya ölçeğinde (metre). Oba dört mahalleye ayrıldı:
 *   Meydan · Zanaat Sokağı · Talim Alanı · Otlak ve Ağıllar
 *
 * Her figürün `bilgi` alanı varsa yakınına gelince kısa bir kültür notu
 * gösterilir. Bunlar Meraklı Gözler'den ayrıdır; sayaca girmez.
 */

export interface HalkKaydi {
  id: string;
  aktivite: Aktivite;
  pos: [number, number];      // x, z (y araziden alınır)
  yon?: number;
  renk?: string;
  kusak?: string;
  boy?: number;
  /** yürüyen figürler için devriye noktaları */
  rota?: [number, number][];
  bilgi?: { ad: string; metin: string };
}

export const HALK: HalkKaydi[] = [
  /* ---------- MEYDAN: ozan, dans, sohbet ---------- */
  {
    id: "h_ozan", aktivite: "ozan", pos: [4, 26], yon: 3.4, renk: "#E3D4B0", kusak: "#8A2C25",
    bilgi: { ad: "Ozan", metin: "Kopuz eşliğinde söylenen destanlar, yazı olmadan da tarih taşırdı. Ozan hem eğlendirir hem hatırlatırdı." },
  },
  { id: "h_dinleyen_1", aktivite: "sohbet", pos: [1.5, 29], yon: 0.5, renk: "#CBB99A" },
  { id: "h_dinleyen_2", aktivite: "bekleyen", pos: [7, 29.5], yon: 5.6, renk: "#BFAE93", kusak: "#4A6B6B" },
  {
    id: "h_dansci_1", aktivite: "dansci", pos: [-2, 31], renk: "#D8C4A0", kusak: "#B8433A",
    bilgi: { ad: "Halka Oyunu", metin: "Bozkırda oyun, birlikte hareket etmenin dilidir. Halka kurulur, ayak vuruşları ezgiye eşlik eder." },
  },
  { id: "h_dansci_2", aktivite: "dansci", pos: [-4.5, 28.5], renk: "#CDBB98", kusak: "#4BB3A9" },
  { id: "h_dansci_3", aktivite: "dansci", pos: [-1, 34], renk: "#C7B392", kusak: "#8A6A24" },

  /* ---------- ZANAAT SOKAĞI ---------- */
  {
    id: "h_demirci", aktivite: "demirci", pos: [-26, 8], yon: 1.2, renk: "#A89372", kusak: "#5A3D20",
    bilgi: { ad: "Demirci", metin: "Demir dövmek bilgi ve sabır ister. Bir ustanın elinden çıkan uç, yıllarca kullanılabilirdi." },
  },
  { id: "h_demirci_yamak", aktivite: "bekleyen", pos: [-24, 10.5], yon: 4.2, renk: "#B9A688", boy: 1.5 },
  {
    id: "h_dokumaci", aktivite: "dokumaci", pos: [-20, 22], yon: 0.4, renk: "#DCCBA6", kusak: "#B8433A",
    bilgi: { ad: "Dokumacı", metin: "Kilimdeki her motif bir dilektir: bereket, yol, yuva. Desenler ustadan çırağa geçerdi." },
  },
  { id: "h_dokumaci_2", aktivite: "dokumaci", pos: [-22.5, 24], yon: 0.4, renk: "#D2C09C", kusak: "#4BB3A9" },
  {
    id: "h_terzi", aktivite: "dokumaci", pos: [-16, 14], yon: 2.2, renk: "#C9B896", kusak: "#8A6A24",
    bilgi: { ad: "Keçeci", metin: "Yün, sıcak su ve emekle keçeye dönüşür. Otağın örtüsü de, çizmenin astarı da bu yolla yapılırdı." },
  },
  {
    id: "h_asci", aktivite: "asci", pos: [-11, 3], yon: 5.0, renk: "#D6C4A2", kusak: "#A8382F",
    bilgi: { ad: "Ocak Başı", metin: "Kazan ortak kaynar, sofra birlikte kurulur. Yemek paylaşmak obada bir bağ kurma biçimidir." },
  },

  /* ---------- PAZAR YERİ ---------- */
  {
    id: "h_pazarci_1", aktivite: "pazarci", pos: [24, 18], yon: 3.6, renk: "#D9C9A6", kusak: "#4BB3A9",
    bilgi: { ad: "Pazar Yeri", metin: "Kervanlar uzaktan ipek, baharat ve kap getirirdi. Karşılığında deri, at ve dokuma verilirdi." },
  },
  { id: "h_pazarci_2", aktivite: "pazarci", pos: [29, 21], yon: 3.9, renk: "#CDBB98", kusak: "#8A2C25" },
  { id: "h_musteri_1", aktivite: "sohbet", pos: [26, 15], yon: 0.6, renk: "#C4B292" },
  { id: "h_musteri_2", aktivite: "bekleyen", pos: [31, 16.5], yon: 1.1, renk: "#BDAB8C", kusak: "#6B5636" },
  { id: "h_kervanci", aktivite: "sohbet", pos: [34, 24], yon: 4.4, renk: "#CFC0A0", kusak: "#8A6A24" },

  /* ---------- TALİM ALANI ---------- */
  {
    id: "h_asker_1", aktivite: "asker", pos: [16, -22], yon: 3.1, renk: "#B8A98C", kusak: "#5A3D20",
    bilgi: { ad: "Talim Alanı", metin: "Ok atmak günlük bir uğraştı. Hedefe isabet kadar, at üstünde denge kurmak da öğrenilirdi." },
  },
  { id: "h_asker_2", aktivite: "asker", pos: [20, -20], yon: 3.1, renk: "#B2A386", kusak: "#5A3D20" },
  { id: "h_asker_3", aktivite: "asker", pos: [12.5, -24], yon: 3.1, renk: "#BCAD90", kusak: "#5A3D20" },
  { id: "h_egitmen", aktivite: "sohbet", pos: [17, -16], yon: 0.2, renk: "#C9B896", kusak: "#A8382F" },

  /* ---------- ÇOCUKLAR ---------- */
  {
    id: "h_cocuk_1", aktivite: "cocuk", pos: [10, 12], renk: "#E0D0AE", kusak: "#4BB3A9", boy: 1.15,
    bilgi: { ad: "Aşık Oyunu", metin: "Çocuklar koyun aşık kemikleriyle oynardı. Oyun, sırasını beklemeyi ve kuralı öğretirdi." },
  },
  { id: "h_cocuk_2", aktivite: "cocuk", pos: [12.5, 14], renk: "#DBC9A6", kusak: "#B8433A", boy: 1.1 },
  { id: "h_cocuk_3", aktivite: "cocuk", pos: [8.5, 15.5], renk: "#D6C3A0", kusak: "#8A6A24", boy: 1.2 },

  /* ---------- OTLAK, ÇOBAN, AVCILAR ---------- */
  {
    id: "h_coban", aktivite: "coban", pos: [40, -8], renk: "#C2B091", kusak: "#6B5636",
    rota: [[40, -8], [48, -2], [44, 6], [36, 2]],
    bilgi: { ad: "Çoban", metin: "Sürü otlağa göre gezdirilir. Hayvanın nereye, ne zaman götürüleceği yılların bilgisidir." },
  },
  {
    id: "h_avci_1", aktivite: "avci", pos: [-34, -18], renk: "#B5A283", kusak: "#5A3D20",
    rota: [[-40, -26], [-30, -18], [-18, -10], [-8, -4]],
    bilgi: { ad: "Avdan Dönüş", metin: "Av yalnız yiyecek değildi; iz sürmeyi, sabrı ve birlikte hareket etmeyi öğretirdi." },
  },
  { id: "h_avci_2", aktivite: "avci", pos: [-36, -22], renk: "#AE9B7E", kusak: "#5A3D20",
    rota: [[-42, -30], [-32, -22], [-20, -14], [-10, -8]] },

  /* ---------- GEZİNENLER ---------- */
  { id: "h_gezen_1", aktivite: "coban", pos: [0, 40], renk: "#C9B896", kusak: "#4BB3A9",
    rota: [[-10, 44], [6, 46], [14, 36], [2, 32]] },
  { id: "h_gezen_2", aktivite: "coban", pos: [-14, -6], renk: "#BFAE93", kusak: "#8A2C25",
    rota: [[-14, -6], [-6, 2], [-14, 10], [-22, 2]] },
];

/** Sürü hayvanları — koyun ve at konumları */
export const SURU: { kod: string; pos: [number, number]; olcek?: number; rota?: [number, number][] }[] = [
  { kod: "B14", pos: [42, -6], olcek: 1.0 },
  { kod: "B14", pos: [44.5, -3], olcek: 0.9 },
  { kod: "B14", pos: [39, -1], olcek: 1.05 },
  { kod: "B14", pos: [46, 2], olcek: 0.95 },
  { kod: "B14", pos: [41, 4], olcek: 1.0 },
  { kod: "B14", pos: [37, -5], olcek: 0.88 },
  { kod: "F06", pos: [-30, 30], olcek: 1.0 },
  { kod: "F06", pos: [-34, 34], olcek: 0.95 },
  { kod: "F06", pos: [26, -30], olcek: 1.0 },
];
