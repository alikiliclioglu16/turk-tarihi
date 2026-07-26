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
      { id: "sd_usta",     aktivite: "demirci",       dx: 1.9,  dz: 0.2,  yon: Math.PI * 1.5, elde: "cekic" },
      { id: "sd_korukcu",  aktivite: "keceBasan",     dx: -1.3, dz: 0.1,  yon: Math.PI * 0.5 },
      { id: "sd_cirak",    aktivite: "asci",          dx: 1.6,  dz: 1.3,  yon: Math.PI * 1.35 },
      { id: "sd_izleyen",  aktivite: "dinleyen",      dx: 0.2,  dz: 1.9,  yon: null },
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
      { id: "sa_izleyen1",  aktivite: "dinleyen", dx: 6.4,  dz: 1.0,  yon: null },
      { id: "sa_izleyen2",  aktivite: "izleyenComelmis", dx: 5.8,  dz: -2.6, yon: null },
      { id: "sa_izleyen3",  aktivite: "dinleyen",   dx: -6.0, dz: 2.2,  yon: null },
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
      { id: "so_okcu1",  aktivite: "asker", dx: 0.0,  dz: 7.0, yon: Math.PI },
      { id: "so_okcu2",  aktivite: "asker", dx: 2.2,  dz: 7.2, yon: Math.PI },
      { id: "so_okcu3",  aktivite: "asker", dx: -2.2, dz: 7.1, yon: Math.PI },
      { id: "so_egitmen", aktivite: "anlatan", dx: 2.8, dz: 6.2, yon: Math.PI * 1.35 },
      { id: "so_bekleyen", aktivite: "dinleyen", dx: -3.0, dz: 8.0, yon: Math.PI * 0.9 },
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
      { id: "sg_hakem",     aktivite: "anlatan", dx: 0,   dz: 2.6, yon: null },
      { id: "sg_seyirci1",  aktivite: "dinleyen", dx: 3.0, dz: 1.7, yon: null },
      { id: "sg_seyirci2",  aktivite: "sohbet",   dx: -2.9, dz: 1.9, yon: null },
      { id: "sg_seyirci3",  aktivite: "izleyenComelmis", dx: 2.3, dz: -2.5, yon: null },
      { id: "sg_seyirci4",  aktivite: "sohbet",   dx: -2.5, dz: -2.3, yon: null },
      { id: "sg_seyirci5",  aktivite: "izleyenComelmis",    dx: 0.8,  dz: 2.9, yon: null, boy: 1.18 },
    ],
  },

  /* ---------- KILIÇ TALİMİ (ordugâh) ----------
     İki asker karşılıklı ölçülü çalışıyor, eğitmen yanda yönlendiriyor. */
  {
    id: "sahne_kilic_talimi",
    ad: "Kılıç Talimi",
    merkez: [4, -52],
    figurler: [
      { id: "sk_asker1",  aktivite: "kilicTalimi", dx: -1.4, dz: 0, yon: Math.PI * 0.5 },
      { id: "sk_asker2",  aktivite: "kilicTalimi", dx: 1.4,  dz: 0, yon: Math.PI * 1.5 },
      { id: "sk_egitmen", aktivite: "anlatan", dx: 0,   dz: 2.4, yon: null },
      { id: "sk_izleyen", aktivite: "dinleyen", dx: -2.8, dz: 1.9, yon: null },
      { id: "sk_baltaci", aktivite: "baltaci",  dx: 4.6, dz: -1.2, yon: Math.PI * 1.7 },
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

  /* ---------- PAZAR TEZGÂHI ----------
     Satıcı tezgâhın arkasında, müşteriler önünde, tartıcı yanda. */
  {
    id: "sahne_pazar",
    ad: "Pazar Tezgâhı",
    merkez: [44, -34],
    nesne: "P01",
    figurler: [
      { id: "sp_satici1",   aktivite: "pazarci",  dx: 0,    dz: -1.0, yon: 0 },
      { id: "sp_musteri1",  aktivite: "dinleyen", dx: -0.7, dz: 1.0,  yon: null },
      { id: "sp_musteri2",  aktivite: "sohbet",   dx: 0.9,  dz: 1.1,  yon: null },
      { id: "sp_tartici",   aktivite: "tartan",   dx: 3.4,  dz: -1.1, yon: 0.3 },
      { id: "sp_satici2",   aktivite: "pazarci",  dx: -4.2, dz: -1.3, yon: 0 },
      { id: "sp_musteri3",  aktivite: "sohbet",   dx: -4.6, dz: 1.6,  yon: null },
      { id: "sp_cocuk",     aktivite: "cocuk",    dx: 2.2,  dz: 2.8,  yon: null, boy: 1.16 },
    ],
  },

  /* ---------- HALKA OYUNU ----------
     Altı dansçı halka olmuş, hepsi merkeze dönük, ozan kenarda. */
  {
    id: "sahne_halka_oyunu",
    ad: "Halka Oyunu",
    merkez: [-2, 31],
    figurler: [
      { id: "sh_dans1", aktivite: "dansci", dx: 0,     dz: -3.2, yon: null },
      { id: "sh_dans2", aktivite: "dansci", dx: 2.8,   dz: -1.6, yon: null },
      { id: "sh_dans3", aktivite: "dansci", dx: 2.8,   dz: 1.6,  yon: null },
      { id: "sh_dans4", aktivite: "dansci", dx: 0,     dz: 3.2,  yon: null },
      { id: "sh_dans5", aktivite: "dansci", dx: -2.8,  dz: 1.6,  yon: null },
      { id: "sh_dans6", aktivite: "dansci", dx: -2.8,  dz: -1.6, yon: null },
      { id: "sh_izleyen1", aktivite: "bekleyen", dx: 5.4, dz: 2.6, yon: null },
      { id: "sh_izleyen2", aktivite: "sohbet",   dx: -5.2, dz: 3.0, yon: null },
    ],
  },

  /* ---------- OZAN VE DİNLEYİCİLER ----------
     Ozan oturmuş kopuz çalıyor, dinleyiciler yarım daire. */
  {
    id: "sahne_ozan",
    ad: "Ozan",
    merkez: [4, 27],
    figurler: [
      { id: "soz_ozan",   aktivite: "ozan",           dx: 0,    dz: 0,   yon: 0, elde: "kopuz" },
      { id: "soz_dinle1", aktivite: "dinleyenOturan", dx: -1.5, dz: 1.6, yon: null },
      { id: "soz_dinle2", aktivite: "dinleyenOturan", dx: 0.3,  dz: 2.0, yon: null },
      { id: "soz_dinle3", aktivite: "dinleyenOturan", dx: 1.7,  dz: 1.5, yon: null },
      { id: "soz_dinle4", aktivite: "dinleyen",       dx: -2.4, dz: 0.5, yon: null },
      { id: "soz_cocuk",  aktivite: "izleyenComelmis", dx: 0.9, dz: 1.1, yon: null, boy: 1.12 },
      { id: "soz_cocuk2", aktivite: "izleyenComelmis", dx: -0.7, dz: 1.0, yon: null, boy: 1.16 },
    ],
  },

  /* ---------- AŞIK OYUNU ----------
     Bir çocuk atıyor, üçü çömelmiş izliyor. */
  {
    id: "sahne_asik_oyunu",
    ad: "Aşık Oyunu",
    merkez: [10.5, 13.5],
    nesne: "P04",
    figurler: [
      { id: "sao_atan",  aktivite: "asikAtan",    dx: 0,    dz: -0.9, yon: 0,    boy: 1.18 },
      { id: "sao_izle1", aktivite: "asikIzleyen", dx: 0.9,  dz: 0.7,  yon: null, boy: 1.14 },
      { id: "sao_izle2", aktivite: "asikIzleyen", dx: -0.9, dz: 0.7,  yon: null, boy: 1.2 },
      { id: "sao_izle3", aktivite: "asikIzleyen", dx: 0.1,  dz: 1.2,  yon: null, boy: 1.1 },
    ],
  },

  /* ---------- KOŞMACA ----------
     Üç çocuk koşuyor, biri kovalıyor. */
  {
    id: "sahne_kosmaca",
    ad: "Koşmaca",
    merkez: [16, 18],
    figurler: [
      { id: "sko_1", aktivite: "cocuk", dx: 0,    dz: 0,   yon: 0.6,  boy: 1.16 },
      { id: "sko_2", aktivite: "cocuk", dx: 3.2,  dz: 1.4, yon: 0.9,  boy: 1.2 },
      { id: "sko_3", aktivite: "cocuk", dx: -2.6, dz: 2.2, yon: 0.3,  boy: 1.12 },
    ],
  },

  /* ---------- BİLEK GÜREŞİ ----------
     İki çocuk alçak taşın başında karşılıklı. */
  {
    id: "sahne_bilek_guresi",
    ad: "Bilek Güreşi",
    merkez: [7, 16],
    figurler: [
      { id: "sbg_1", aktivite: "guresci", dx: -0.7, dz: 0, yon: Math.PI * 0.5,  boy: 1.18 },
      { id: "sbg_2", aktivite: "guresci", dx: 0.7,  dz: 0, yon: Math.PI * 1.5,  boy: 1.16 },
      { id: "sbg_izleyen", aktivite: "cocuk", dx: 0, dz: 1.8, yon: null, boy: 1.1 },
    ],
  },

  /* ---------- ATLI TALİM (ordugâh) ---------- */
  {
    id: "sahne_atli_talim",
    ad: "Atlı Talim",
    merkez: [22, -58],
    nesne: "O03",
    figurler: [
      { id: "sat_asker1", aktivite: "asker",    dx: -3.0, dz: 4.2, yon: Math.PI },
      { id: "sat_asker2", aktivite: "asker",    dx: 0.4,  dz: 4.6, yon: Math.PI },
      { id: "sat_egitmen", aktivite: "bekleyen", dx: 3.6, dz: 3.4, yon: Math.PI * 1.3 },
    ],
    hayvanlar: [
      { tur: "at", dx: -5.5, dz: 1.2 },
      { tur: "at", dx: -6.8, dz: 2.6 },
    ],
  },

  /* ---------- SANCAK VE NÖBET (ordugâh) ---------- */
  {
    id: "sahne_sancak",
    ad: "Sancak Yeri",
    merkez: [10, -46],
    nesne: "O04",
    figurler: [
      { id: "ss_nobetci1", aktivite: "nobetci",  dx: 1.6,  dz: 1.2, yon: Math.PI * 1.2 },
      { id: "ss_nobetci2", aktivite: "bekleyen", dx: -1.8, dz: 1.4, yon: Math.PI * 0.85 },
      { id: "ss_subay",    aktivite: "sohbet",   dx: 0.2,  dz: 3.2, yon: null },
    ],
  },

  /* ---------- AT KOŞUMU ---------- */
  {
    id: "sahne_at_kosumu",
    ad: "At Koşumu",
    merkez: [-9, -4],
    figurler: [
      { id: "sak_usta", aktivite: "deriGeren", dx: 1.2, dz: 0.4, yon: Math.PI * 1.5 },
      { id: "sak_yardim", aktivite: "bekleyen", dx: -1.6, dz: 1.2, yon: null },
    ],
    hayvanlar: [{ tur: "at", dx: 0, dz: 0 }],
  },

  /* ---------- DÜĞÜN HAZIRLIĞI ---------- */
  {
    id: "sahne_dugun",
    ad: "Düğün Hazırlığı",
    merkez: [-5, 24],
    figurler: [
      { id: "sdg_1", aktivite: "dokumaci", dx: 0,    dz: 0,   yon: 0 },
      { id: "sdg_2", aktivite: "asci",     dx: 2.4,  dz: 0.6, yon: 0.4 },
      { id: "sdg_3", aktivite: "sohbet",   dx: -2.2, dz: 1.2, yon: null },
      { id: "sdg_4", aktivite: "bekleyen", dx: 0.8,  dz: 2.4, yon: null },
    ],
  },

  /* ---------- İP BÜKME (konum düzeltildi) ---------- */
  {
    id: "sahne_ip_bukme",
    ad: "İp Bükme",
    merkez: [-6, 20],
    nesne: "Z07",
    figurler: [
      { id: "sib_usta",  aktivite: "ipBuken", dx: 0,    dz: 1.0, yon: Math.PI },
      { id: "sib_yardim", aktivite: "ipBuken", dx: -1.7, dz: 0.9, yon: Math.PI * 0.9 },
    ],
  },

  /* ---------- DERS HALKASI ----------
     Ancient Egypt'teki sınıf sahnesinin karşılığı: bir usta anlatıyor,
     çocuklar yere oturmuş dinliyor. Dönem doğrusu — bozkırda bilgi
     sözle ve göstererek aktarılırdı. */
  {
    id: "sahne_ders_halkasi",
    ad: "Ders Halkası",
    merkez: [-3, 18],
    figurler: [
      { id: "sdh_usta", aktivite: "anlatan",         dx: 0,    dz: -1.8, yon: 0 },
      { id: "sdh_c1",   aktivite: "dinleyenOturan",  dx: -1.6, dz: 0.4,  yon: null, boy: 1.16 },
      { id: "sdh_c2",   aktivite: "dinleyenOturan",  dx: -0.6, dz: 0.9,  yon: null, boy: 1.2 },
      { id: "sdh_c3",   aktivite: "dinleyenOturan",  dx: 0.6,  dz: 0.9,  yon: null, boy: 1.12 },
      { id: "sdh_c4",   aktivite: "dinleyenOturan",  dx: 1.6,  dz: 0.4,  yon: null, boy: 1.18 },
      { id: "sdh_c5",   aktivite: "izleyenComelmis", dx: -1.1, dz: 1.7,  yon: null, boy: 1.1 },
      { id: "sdh_c6",   aktivite: "izleyenComelmis", dx: 1.0,  dz: 1.8,  yon: null, boy: 1.14 },
      { id: "sdh_ana",  aktivite: "dinleyen",        dx: 2.8,  dz: 1.2,  yon: null },
    ],
  },

  /* ---------- SU BAŞI SOHBETİ ---------- */
  {
    id: "sahne_su_sohbeti",
    ad: "Su Başı Sohbeti",
    merkez: [58, 30],
    figurler: [
      { id: "sss_dolduran",  aktivite: "asci",            dx: 0,    dz: 0,   yon: 0 },
      { id: "sss_bekleyen1", aktivite: "sohbet",          dx: -1.4, dz: 1.1, yon: null },
      { id: "sss_bekleyen2", aktivite: "dinleyen",        dx: 0.5,  dz: 1.5, yon: null },
      { id: "sss_comelen",   aktivite: "izleyenComelmis", dx: 1.7,  dz: 0.6, yon: null },
    ],
  },

  /* ---------- OCAK SOHBETİ ---------- */
  {
    id: "sahne_ocak_sohbeti",
    ad: "Ocak Sohbeti",
    merkez: [-30, 26],
    nesne: "A05",
    figurler: [
      { id: "sos_anlatan", aktivite: "anlatan",         dx: 0,    dz: -1.6, yon: 0 },
      { id: "sos_d1",      aktivite: "dinleyenOturan",  dx: -1.5, dz: 0.5,  yon: null },
      { id: "sos_d2",      aktivite: "dinleyenOturan",  dx: 0.2,  dz: 1.2,  yon: null },
      { id: "sos_d3",      aktivite: "dinleyenOturan",  dx: 1.5,  dz: 0.4,  yon: null },
      { id: "sos_c",       aktivite: "izleyenComelmis", dx: 0.7,  dz: 1.9,  yon: null, boy: 1.15 },
    ],
  },
];

/** Sahnelerdeki tüm figür kimlikleri — çakışma önleme için */
export const SAHNE_FIGUR_IDLERI = new Set(
  SAHNELER.flatMap((s) => s.figurler.map((f) => f.id))
);
