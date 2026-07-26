/**
 * SAHNE KURGULARI
 *
 * Sorun: nesneler ve figürler doğru bölgede ama tesadüfi yerleştirilmiş.
 * Demirci ocağın 12 metre uzağında, at çemberin dışında, güreşçiler
 * birbirine dönük değil. Bakan kişi "burada bir şey olmuyor" diyor.
 *
 * Çözüm: her etkinlik sahnesi ELLE kurgulanır. Kim nerede duruyor,
 * neye dönük, hangi nesnenin kaç santim uzağında — hepsi burada yazılı.
 *
 * Koordinatlar TASARIM birimindedir (dünya = × DUNYA_OLCEK).
 */

export interface SahneFiguru {
  /** benzersiz kimlik */
  id: string;
  aktivite: string;
  /** sahne merkezine göre göreli konum */
  dx: number;
  dz: number;
  /** baktığı yön (radyan). null = merkeze bakar */
  yon?: number | null;
  boy?: number;
  /** elindeki nesne kodu */
  elde?: string | null;
}

export interface SahneHayvani {
  tur: "at" | "inek" | "koyun" | "esek" | "kopek";
  dx: number;
  dz: number;
  /** merkez çevresinde dönüyor mu (at eğitimi için) */
  dairesel?: { yaricap: number; hiz: number };
}

export interface EtkinlikSahnesi {
  id: string;
  ad: string;
  /** sahne merkezi (tasarım birimi) */
  merkez: [number, number];
  /** sahnenin dayandığı nesne kodu — varsa oraya hizalanır */
  nesne?: string;
  figurler: SahneFiguru[];
  hayvanlar?: SahneHayvani[];
}

/* ============================================================
   ETKİNLİK SAHNELERİ
   ============================================================ */

export const SAHNELER: EtkinlikSahnesi[] = [
  /* ---------- DEMİRCİ OCAĞI ----------
     Ocak (0,0) · örs (1.5, 0.2) · körük (-1.05, 0)
     Usta örsün TAM YANINDA, örse dönük. Yardımcı körükte. */
  {
    id: "sahne_demirci",
    ad: "Demirci Ocağı",
    merkez: [-26, 6],
    nesne: "P02",
    figurler: [
      { id: "sd_usta",     aktivite: "demirci",  dx: 2.3,  dz: 0.2,  yon: Math.PI * 1.5, elde: "cekic" },
      { id: "sd_korukcu",  aktivite: "keceBasan", dx: -1.9, dz: 0.1, yon: Math.PI * 0.5 },
      { id: "sd_bekleyen", aktivite: "bekleyen", dx: 0.4,  dz: 2.4,  yon: null },
      { id: "sd_cirak",    aktivite: "demirci",  dx: 2.6,  dz: 1.6,  yon: Math.PI * 1.35, elde: "cekic" },
    ],
  },

  /* ---------- AT EĞİTİM ÇEMBERİ ----------
     Çember yarıçapı 6. Terbiyeci MERKEZDE, at çemberin İÇİNDE dönüyor. */
  {
    id: "sahne_at_egitimi",
    ad: "At Eğitimi",
    merkez: [22, -26],
    nesne: "Z06",
    figurler: [
      { id: "sa_terbiyeci", aktivite: "atTerbiyecisi", dx: 0, dz: 0, yon: null },
      { id: "sa_izleyen1",  aktivite: "bekleyen", dx: 7.2,  dz: 1.2,  yon: null },
      { id: "sa_izleyen2",  aktivite: "bekleyen", dx: 6.4,  dz: -3.2, yon: null },
      { id: "sa_izleyen3",  aktivite: "sohbet",   dx: -6.8, dz: 2.6,  yon: null },
    ],
    hayvanlar: [
      { tur: "at", dx: 0, dz: 0, dairesel: { yaricap: 4.6, hiz: 0.42 } },
      { tur: "at", dx: 8.5, dz: -1.5 },
    ],
  },

  /* ---------- OK TALİMİ ----------
     Hedefler önde, okçular 7 metre geride, HEDEFE DÖNÜK sıralı. */
  {
    id: "sahne_ok_talimi",
    ad: "Ok Talimi",
    merkez: [16, -30],
    nesne: "P03",
    figurler: [
      { id: "so_okcu1",  aktivite: "asker", dx: 0.0,  dz: 7.0, yon: Math.PI, elde: "yay" },
      { id: "so_okcu2",  aktivite: "asker", dx: 2.2,  dz: 7.2, yon: Math.PI, elde: "yay" },
      { id: "so_okcu3",  aktivite: "asker", dx: -2.2, dz: 7.1, yon: Math.PI, elde: "yay" },
      { id: "so_egitmen", aktivite: "bekleyen", dx: 4.4, dz: 6.0, yon: Math.PI * 1.35 },
      { id: "so_bekleyen", aktivite: "sohbet", dx: -4.6, dz: 8.4, yon: Math.PI * 0.9 },
    ],
  },

  /* ---------- GÜREŞ ----------
     İki güreşçi KARŞILIKLI, 1.6 metre arayla. Seyirciler halka olmuş,
     hepsi MERKEZE dönük. */
  {
    id: "sahne_gures",
    ad: "Güreş",
    merkez: [14, -20],
    nesne: "Z05",
    figurler: [
      { id: "sg_pehlivan1", aktivite: "guresci", dx: -0.8, dz: 0, yon: Math.PI * 0.5 },
      { id: "sg_pehlivan2", aktivite: "guresci", dx: 0.8,  dz: 0, yon: Math.PI * 1.5 },
      { id: "sg_hakem",     aktivite: "bekleyen", dx: 0,   dz: 2.6, yon: null },
      { id: "sg_seyirci1",  aktivite: "bekleyen", dx: 4.6, dz: 2.2, yon: null },
      { id: "sg_seyirci2",  aktivite: "sohbet",   dx: -4.4, dz: 2.6, yon: null },
      { id: "sg_seyirci3",  aktivite: "bekleyen", dx: 3.4, dz: -3.8, yon: null },
      { id: "sg_seyirci4",  aktivite: "sohbet",   dx: -3.8, dz: -3.4, yon: null },
      { id: "sg_seyirci5",  aktivite: "cocuk",    dx: 1.2,  dz: 4.6, yon: null, boy: 1.18 },
    ],
  },

  /* ---------- KILIÇ TALİMİ (ordugâh) ----------
     İki asker karşılıklı ölçülü çalışıyor, eğitmen yanda yönlendiriyor. */
  {
    id: "sahne_kilic_talimi",
    ad: "Kılıç Talimi",
    merkez: [4, -52],
    figurler: [
      { id: "sk_asker1",  aktivite: "guresci", dx: -1.4, dz: 0, yon: Math.PI * 0.5, elde: "kilic" },
      { id: "sk_asker2",  aktivite: "guresci", dx: 1.4,  dz: 0, yon: Math.PI * 1.5, elde: "kilic" },
      { id: "sk_egitmen", aktivite: "bekleyen", dx: 0,   dz: 3.2, yon: null },
      { id: "sk_izleyen", aktivite: "bekleyen", dx: -4.2, dz: 2.4, yon: null },
    ],
  },

  /* ---------- ÇÖMLEKÇİ ----------
     Usta çarkın TAM BAŞINDA, oturmuş. */
  {
    id: "sahne_comlekci",
    ad: "Çömlekçi",
    merkez: [-14, 8],
    nesne: "Z04",
    figurler: [
      { id: "sc_usta",  aktivite: "comlekci", dx: 0.0, dz: 1.1, yon: Math.PI },
      { id: "sc_cirak", aktivite: "keceBasan", dx: -1.8, dz: 1.4, yon: Math.PI * 0.85 },
    ],
  },

  /* ---------- DOKUMA TEZGÂHI ---------- */
  {
    id: "sahne_dokuma",
    ad: "Dokuma",
    merkez: [-8.5, 8.5],
    nesne: "B16",
    figurler: [
      { id: "sdk_usta",  aktivite: "dokumaci", dx: 0.0, dz: 1.0, yon: Math.PI },
      { id: "sdk_yardim", aktivite: "ipBuken", dx: 2.0, dz: 1.4, yon: Math.PI * 1.15 },
    ],
  },

  /* ---------- KEÇE BASMA ---------- */
  {
    id: "sahne_kece",
    ad: "Keçe Basma",
    merkez: [-16, 15],
    nesne: "Z02",
    figurler: [
      { id: "skc_1", aktivite: "keceBasan", dx: -1.2, dz: 0.8, yon: Math.PI * 0.4 },
      { id: "skc_2", aktivite: "keceBasan", dx: 1.3,  dz: 0.7, yon: Math.PI * 1.6 },
      { id: "skc_3", aktivite: "bekleyen",  dx: 0.2,  dz: 2.6, yon: null },
    ],
  },

  /* ---------- OK YAPIM TEZGÂHI ---------- */
  {
    id: "sahne_ok_yapim",
    ad: "Ok Yapımı",
    merkez: [-25, 10],
    nesne: "Z01",
    figurler: [
      { id: "soy_usta",  aktivite: "okYapan", dx: 0.0, dz: 1.0, yon: Math.PI, elde: "ok" },
      { id: "soy_cirak", aktivite: "okYapan", dx: 1.9, dz: 1.2, yon: Math.PI * 1.1, elde: "ok" },
    ],
  },

  /* ---------- DERİ GERDİRME ---------- */
  {
    id: "sahne_deri",
    ad: "Deri Gerdirme",
    merkez: [-19, 17],
    nesne: "Z03",
    figurler: [
      { id: "sdr_usta", aktivite: "deriGeren", dx: 0.0, dz: 1.2, yon: Math.PI },
      { id: "sdr_2",    aktivite: "deriGeren", dx: -1.6, dz: 1.1, yon: Math.PI * 0.92 },
    ],
  },

  /* ---------- OCAK BAŞI / AŞÇI ---------- */
  {
    id: "sahne_ocak",
    ad: "Ocak Başı",
    merkez: [0, 0],
    nesne: "A06",
    figurler: [
      { id: "sob_asci",  aktivite: "asci", dx: 1.4, dz: 0.6, yon: Math.PI * 1.55, elde: "kepce" },
      { id: "sob_yardim", aktivite: "bekleyen", dx: -1.6, dz: 1.2, yon: null },
      { id: "sob_cocuk", aktivite: "cocuk", dx: 0.4, dz: 2.4, yon: null, boy: 1.14 },
    ],
  },
];

/** Sahnelerdeki tüm figür kimlikleri — çakışma önleme için */
export const SAHNE_FIGUR_IDLERI = new Set(
  SAHNELER.flatMap((s) => s.figurler.map((f) => f.id))
);
