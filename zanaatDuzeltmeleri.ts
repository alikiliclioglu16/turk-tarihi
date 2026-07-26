import type { KemikDuzeltme } from "@/components/scene/models/KarakterGLB";
import {
  ekle, gurultu, sin, vurusEgrisi, calismaKapisi, nefes, canlilik,
  type Kemikler,
} from "./hareketKitapligi";

/**
 * ZANAAT VE ETKİNLİK HAREKETLERİ
 *
 * Her iş için ayrı prosedürel katman. Animasyon karışımından SONRA
 * çalışır; kemik açısına ekleme yapar.
 *
 * Tasarım ilkesi: hiçbir hareket tek sinüs olmayacak. Her işte
 * en az üç katman var:
 *   1. Ana iş hareketi (vuruş, çekme, döndürme)
 *   2. Takip ve ikincil hareket (önkol, bilek, gövde tepkisi)
 *   3. Canlılık (nefes, ağırlık aktarımı, baş hareketi)
 *
 * Ayrıca `calismaKapisi` ile arada duraklama var — insan sürekli
 * aynı hızda çalışmaz.
 */

type D = (k: Kemikler, t: number) => void;
const yap = (f: D): KemikDuzeltme => ({ uygula: f });

/* ============================================================
   ZANAATLAR
   ============================================================ */

/** DEMİRCİ — hazırlık, hızlı iniş, temas, geri dönüş */
export const demirci = yap((k, t) => {
  canlilik(k, t, 0.31);
  const kapi = calismaKapisi(t, 16, 0.14);
  const v = vurusEgrisi(t, 1.35) * kapi;

  // sağ kol: vuruş
  ekle(k, "RightArm", v * 0.62, 0, -0.18);
  ekle(k, "RightForeArm", v * 0.48 + 0.15, 0, 0);      // takip: gecikmeli
  ekle(k, "RightHand", v * 0.22);

  // gövde vuruşa eşlik eder
  ekle(k, "Spine1", v * 0.13);
  ekle(k, "Spine2", v * 0.08);

  // sol el malzemeyi maşayla tutuyor — sabit ama mikro titreşimli
  const titre = gurultu(t, 7.5, 2) * 0.012 * kapi;
  ekle(k, "LeftArm", -0.62 + titre, 0, 0.44);
  ekle(k, "LeftForeArm", -0.78 + titre * 2);

  // vuruş anında baş işe bakar
  ekle(k, "Head", 0.18 + v * 0.06);
});

/** OK YAPAN — ince, yavaş, gövdeyi çevirip düzlüyor */
export const okYapan = yap((k, t) => {
  canlilik(k, t, 0.57);
  const kapi = calismaKapisi(t, 19, 0.2);
  const cevir = gurultu(t, 1.15, 1.1) * kapi;
  const inceleme = Math.max(0, Math.sin(t * 0.28) - 0.7) * 3;   // arada kaldırıp bakar

  ekle(k, "RightArm", 0.36 - inceleme * 0.5, 0, -0.2);
  ekle(k, "RightForeArm", -0.92 - inceleme * 0.35 + cevir * 0.1);
  ekle(k, "RightHand", 0, cevir * 0.55);                        // gövdeyi çevirir
  ekle(k, "LeftArm", -0.48, 0, 0.5);
  ekle(k, "LeftForeArm", -0.72);
  ekle(k, "Head", 0.3 - inceleme * 0.28);
});

/** DOKUMACI — mekik geçişi, tarak vuruşu, sıra değişimi */
export const dokumaci = yap((k, t) => {
  canlilik(k, t, 0.73);
  const kapi = calismaKapisi(t, 22, 0.12);
  const p = (t % 3.1) / 3.1;

  // üç evreli: mekik sağa (0-0.4), tarak vuruşu (0.4-0.6), mekik sola (0.6-1)
  let sagKol = 0, solKol = 0, tarak = 0;
  if (p < 0.4)       { const s = p / 0.4;       sagKol = 1 - s; solKol = s; }
  else if (p < 0.6)  { tarak = Math.sin(((p - 0.4) / 0.2) * Math.PI); }
  else               { const s = (p - 0.6) / 0.4; sagKol = s; solKol = 1 - s; }

  ekle(k, "RightArm", (-0.55 - sagKol * 0.25) * kapi, 0, (-0.22 - sagKol * 0.32) * kapi);
  ekle(k, "LeftArm",  (-0.55 - solKol * 0.25) * kapi, 0, ( 0.22 + solKol * 0.32) * kapi);
  ekle(k, "RightForeArm", (-0.6 - tarak * 0.35) * kapi);
  ekle(k, "LeftForeArm",  (-0.6 - tarak * 0.35) * kapi);
  ekle(k, "Spine1", tarak * 0.1 * kapi);
  ekle(k, "Head", 0.24);
});

/** DERİ GEREN — iki elle çekme, direnç, bırakma */
export const deriGeren = yap((k, t) => {
  canlilik(k, t, 0.19);
  const kapi = calismaKapisi(t, 15, 0.22);
  const p = (t % 4.2) / 4.2;
  // yavaş çek, tut, bırak
  const cek = p < 0.45 ? (p / 0.45) : p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3;
  const zorlanma = cek * kapi;

  ekle(k, "RightArm", -1.0 - zorlanma * 0.22, 0, -0.28);
  ekle(k, "LeftArm",  -1.0 - zorlanma * 0.22, 0,  0.28);
  ekle(k, "RightForeArm", -0.3 - zorlanma * 0.2);
  ekle(k, "LeftForeArm",  -0.3 - zorlanma * 0.2);
  // gövde geriye yaslanır, bacaklar direnir
  ekle(k, "Spine1", -zorlanma * 0.14);
  ekle(k, "Hips", -zorlanma * 0.06);
  ekle(k, "Head", 0.12 + zorlanma * 0.1);
});

/** ÇÖMLEKÇİ — çark dönüşü, iki el kabı yükseltiyor */
export const comlekci = yap((k, t) => {
  canlilik(k, t, 0.44);
  const kapi = calismaKapisi(t, 20, 0.15);
  const yukselt = (Math.sin(t * 0.42) * 0.5 + 0.5) * kapi;      // kap yavaş yükselir
  const titre = gurultu(t, 5.2, 0.7) * 0.02;

  ekle(k, "Spine1", 0.34);
  ekle(k, "Spine2", 0.12);
  ekle(k, "RightArm", -0.92 - yukselt * 0.16 + titre, 0, -0.42);
  ekle(k, "LeftArm",  -0.92 - yukselt * 0.16 - titre, 0,  0.42);
  ekle(k, "RightForeArm", -1.0 - yukselt * 0.12);
  ekle(k, "LeftForeArm",  -1.0 - yukselt * 0.12);
  ekle(k, "Head", 0.42);
});

/** İP BÜKEN — iğ dönüşü, ipin uzaması */
export const ipBuken = yap((k, t) => {
  canlilik(k, t, 0.88);
  const kapi = calismaKapisi(t, 17, 0.16);
  const don = t * 4.6;
  // iğ dönerken el aşağı iner, sonra yukarı toplar
  const dongu = (t % 6.5) / 6.5;
  const iner = dongu < 0.75 ? dongu / 0.75 : 1 - (dongu - 0.75) / 0.25;

  ekle(k, "RightArm", (-0.68 - iner * 0.25) * kapi, 0, -0.32);
  ekle(k, "RightForeArm", -0.85 * kapi);
  ekle(k, "RightHand", 0, Math.sin(don) * 0.75 * kapi, Math.cos(don) * 0.25 * kapi);
  ekle(k, "LeftArm", -0.55 - iner * 0.12, 0, 0.48);
  ekle(k, "LeftForeArm", -0.6);
  ekle(k, "Head", 0.2 + iner * 0.12);
});

/** KEÇE BASAN — gövdeyle iterek yuvarlama */
export const keceBasan = yap((k, t) => {
  canlilik(k, t, 0.62);
  const kapi = calismaKapisi(t, 13, 0.2);
  const p = (t % 2.4) / 2.4;
  // ileri it (güçlü), geri çek (yavaş)
  const it = p < 0.42 ? Math.sin((p / 0.42) * Math.PI * 0.5) : 1 - (p - 0.42) / 0.58;

  ekle(k, "Spine1", (0.46 + it * 0.22) * kapi);
  ekle(k, "Spine2", it * 0.1 * kapi);
  ekle(k, "RightArm", (-1.15 - it * 0.28) * kapi, 0, -0.16);
  ekle(k, "LeftArm",  (-1.15 - it * 0.28) * kapi, 0,  0.16);
  ekle(k, "RightForeArm", -0.28 * kapi);
  ekle(k, "LeftForeArm",  -0.28 * kapi);
  ekle(k, "Hips", it * 0.08 * kapi);
});

/** AŞÇI — dairesel karıştırma + arada tadına bakma */
export const asci = yap((k, t) => {
  canlilik(k, t, 0.26);
  const kapi = calismaKapisi(t, 18, 0.24);
  const daire = t * 1.9;
  const tat = Math.max(0, Math.sin(t * 0.19) - 0.88) * 8;   // arada kaşığı ağza götürür

  ekle(k, "Spine1", 0.3 - tat * 0.2);
  ekle(k, "RightArm",
    (-0.82 + Math.sin(daire) * 0.14) * kapi - tat * 0.55,
    0,
    (-0.3 + Math.cos(daire) * 0.14) * kapi);
  ekle(k, "RightForeArm", -0.62 * kapi - tat * 0.75);
  ekle(k, "LeftArm", -0.35, 0, 0.5);
  ekle(k, "Head", 0.36 - tat * 0.3);
});

/* ============================================================
   AÇIK HAVA VE ORDUGÂH
   ============================================================ */

/** ÇOBAN — asaya dayanmış, sürüyü tarıyor */
export const coban = yap((k, t) => {
  canlilik(k, t, 0.5);
  const tara = gurultu(t, 0.21, 2.4);
  const kaydir = Math.max(0, Math.sin(t * 0.09) - 0.8) * 5;   // arada duruş değiştirir

  ekle(k, "RightArm", -0.42 - kaydir * 0.12, 0, -0.14);
  ekle(k, "RightForeArm", -0.3);
  ekle(k, "LeftArm", 0, 0, 0.1 + kaydir * 0.1);
  ekle(k, "Head", tara * 0.06, tara * 0.42);                  // ufku tarar
  ekle(k, "Neck", 0, tara * 0.14);
  ekle(k, "Hips", 0, kaydir * 0.08, 0);
});

/** AVCI — omuzda yük, ağır ve dengesiz yürüyüş */
export const avci = yap((k, t) => {
  canlilik(k, t, 0.68);
  const adim = sin(t, 2.1);
  ekle(k, "Spine1", 0.06, 0, 0.11 + adim * 0.02);             // yük tarafına eğik
  ekle(k, "RightArm", -1.18, 0, -0.2);                        // yükü tutuyor
  ekle(k, "RightForeArm", -0.5);
  ekle(k, "LeftArm", 0, 0, 0.08);
  ekle(k, "Head", 0, -0.12);                                  // yükten kaçınır
});

/** PAZARCI — mal gösterme, çağırma, bekleme */
export const pazarci = yap((k, t) => {
  canlilik(k, t, 0.37);
  const p = (t % 9) / 9;
  // üç evre: bekle, malı göster, müşteriye seslen
  const goster = p > 0.3 && p < 0.55 ? Math.sin(((p - 0.3) / 0.25) * Math.PI) : 0;
  const seslen = p > 0.7 && p < 0.85 ? Math.sin(((p - 0.7) / 0.15) * Math.PI) : 0;

  ekle(k, "RightArm", -0.35 - goster * 0.75 - seslen * 0.5, 0, -0.15 - goster * 0.2);
  ekle(k, "RightForeArm", -0.35 - goster * 0.3);
  ekle(k, "LeftArm", -0.15 - seslen * 0.45, 0, 0.18);
  ekle(k, "Head", -seslen * 0.14, gurultu(t, 0.3, 1.4) * 0.28);
  ekle(k, "Spine1", -seslen * 0.06);
});

/** TARTAN — terazi tutuyor, denge bekliyor, doğruluyor */
export const tartan = yap((k, t) => {
  canlilik(k, t, 0.15);
  const sallan = gurultu(t, 1.6, 0.4) * 0.06;                 // terazi salınımı
  const kontrol = Math.max(0, Math.sin(t * 0.24) - 0.7) * 3;  // arada yakından bakar

  ekle(k, "RightArm", -1.22 + sallan, 0, -0.24);
  ekle(k, "RightForeArm", -0.3 + sallan * 0.5);
  ekle(k, "LeftArm", -0.5 - kontrol * 0.2, 0, 0.3);
  ekle(k, "Spine1", kontrol * 0.16);
  ekle(k, "Head", 0.32 + kontrol * 0.2);
});

/**
 * ASKER — GERÇEK OKÇULUK KLİBİ GELDİ
 *
 * Artık `Archery_Aim_with_Lateral_Scan` klibi var; yay çekme hareketini
 * kodla taklit etmeye gerek kalmadı. Bu katman yalnız INCE AYAR yapıyor:
 * nefes, mikro titreme ve baş takibi.
 */
export const askerOkGercek = yap((k, t) => {
  canlilik(k, t, 0.42);
  const nisanTitremesi = gurultu(t, 5.8, 1.1) * 0.008;
  ekle(k, "LeftArm", nisanTitremesi);
  ekle(k, "RightForeArm", nisanTitremesi * 0.6);
});

/** ASKER — yay çekme: klip yoksa tam prosedürel (yedek) */
export const askerOk = yap((k, t) => {
  canlilik(k, t, 0.42);
  const periyot = 5.4;
  const p = (t % periyot) / periyot;

  let cek = 0, nisan = 0, birak = 0, dinlen = 0;
  if (p < 0.15)      { dinlen = 1 - p / 0.15; }                        // toparlanma
  else if (p < 0.45) { cek = (p - 0.15) / 0.30; }                      // kirişi çek
  else if (p < 0.62) { cek = 1; nisan = 1; }                           // nişan al
  else if (p < 0.68) { birak = 1 - (p - 0.62) / 0.06; cek = birak; }   // bırak
  else               { dinlen = (p - 0.68) / 0.32; }                   // kolu indir

  const kararlilik = gurultu(t, 6.5, 1.1) * 0.012 * nisan;   // nişanda mikro titreme

  // sol kol: yayı tutuyor, ileri uzanmış
  ekle(k, "LeftArm", -1.42 + dinlen * 0.9 + kararlilik, 0, 0.18);
  ekle(k, "LeftForeArm", -0.12);
  // sağ kol: kirişi çeker
  ekle(k, "RightArm", -1.28 + dinlen * 0.8, 0, -0.22 - cek * 0.3);
  ekle(k, "RightForeArm", -0.55 - cek * 1.05 + birak * 0.4);
  // gövde nişanda döner, bırakışta hafif geri tepki
  ekle(k, "Spine1", 0, 0.22 * (1 - dinlen), -birak * 0.05);
  ekle(k, "Head", 0.06, 0.18 * (1 - dinlen));
});

/** GÜREŞÇİ — duruş, arayış, hamle, geri çekilme */
export const guresci = yap((k, t) => {
  canlilik(k, t, 0.79);
  const p = (t % 6.2) / 6.2;
  const arayis = gurultu(t, 0.9, 1.6);
  // arada hamle yapar
  const hamle = p > 0.55 && p < 0.72 ? Math.sin(((p - 0.55) / 0.17) * Math.PI) : 0;

  ekle(k, "Spine1", 0.38 + hamle * 0.18, arayis * 0.14 + hamle * 0.1);
  ekle(k, "Spine2", 0.1);
  ekle(k, "LeftArm", -1.05 - hamle * 0.3, 0, 0.48 - hamle * 0.14);
  ekle(k, "RightArm", -1.05 - hamle * 0.3, 0, -0.48 + hamle * 0.14);
  ekle(k, "LeftForeArm", -0.55 - hamle * 0.25);
  ekle(k, "RightForeArm", -0.55 - hamle * 0.25);
  // dizler bükük, ağırlık gidip gelir
  ekle(k, "LeftUpLeg", -0.2 + arayis * 0.06);
  ekle(k, "RightUpLeg", -0.2 - arayis * 0.06);
  ekle(k, "Head", 0.16);
});

/** KILIÇ TALİMİ — ölçülü, tekrarlı, kimse kimseyi yenmiyor */
export const kilicTalimi = yap((k, t) => {
  canlilik(k, t, 0.23);
  const periyot = 3.8;
  const p = (t % periyot) / periyot;
  // hazırlık → kesme → toparlama → bekleme
  let hazir = 0, kes = 0;
  if (p < 0.3)       hazir = p / 0.3;
  else if (p < 0.45) { hazir = 1; kes = (p - 0.3) / 0.15; }
  else if (p < 0.6)  { kes = 1 - (p - 0.45) / 0.15; hazir = kes; }

  ekle(k, "RightArm", -0.7 - hazir * 0.65 + kes * 0.55, 0, -0.3 - hazir * 0.25);
  ekle(k, "RightForeArm", -0.5 - hazir * 0.5 + kes * 0.7);
  ekle(k, "LeftArm", -0.32, 0, 0.28);
  ekle(k, "Spine1", 0.12, -hazir * 0.16 + kes * 0.2);
  ekle(k, "LeftUpLeg", -0.14);
  ekle(k, "RightUpLeg", -0.1);
  ekle(k, "Head", 0.08, kes * 0.1);
});

/** AT TERBİYECİSİ — kement döndürme, atı izleme */
export const atTerbiyecisi = yap((k, t) => {
  canlilik(k, t, 0.55);
  const don = t * 2.4;
  const takip = t * 0.42;   // atın dönüşünü takip eder

  ekle(k, "RightArm", -1.55 + Math.sin(don) * 0.14, 0, -0.42 + Math.cos(don) * 0.22);
  ekle(k, "RightForeArm", -0.35);
  ekle(k, "LeftArm", -0.28, 0, 0.34);
  // gövde ve baş atı izler
  ekle(k, "Spine1", 0, Math.sin(takip) * 0.2);
  ekle(k, "Head", 0, Math.sin(takip) * 0.35);
});

/* ============================================================
   KÜLTÜR VE OYUN
   ============================================================ */

/** OZAN — kopuz çalma, ezgiye kapılma */
export const ozan = yap((k, t) => {
  canlilik(k, t, 0.71);
  const tel = t * 6.2;
  const ezgi = gurultu(t, 0.55, 0.9);

  ekle(k, "Spine1", 0.18 + ezgi * 0.05);
  ekle(k, "RightArm", -0.85, 0, -0.3);
  ekle(k, "RightForeArm", -0.9);
  ekle(k, "RightHand", Math.sin(tel) * 0.32);            // tel çekiyor
  ekle(k, "LeftArm", -1.0, 0, 0.45);
  ekle(k, "LeftForeArm", -1.15);
  ekle(k, "LeftHand", 0, Math.sin(tel * 0.4) * 0.28);    // perde basıyor
  ekle(k, "Head", -0.1 + ezgi * 0.12, ezgi * 0.16);      // ezgiye kapılmış
});

/** DANSÇI — halka oyunu, ayak vuruşu, kol açma */
export const dansci = yap((k, t) => {
  canlilik(k, t, 0.34);
  const ritim = t * 2.8;
  const vurus = Math.abs(Math.sin(ritim));
  const acilis = Math.sin(t * 0.7) * 0.5 + 0.5;

  ekle(k, "LeftArm", -0.3 - acilis * 0.55, 0, 0.5 + acilis * 0.3);
  ekle(k, "RightArm", -0.3 - acilis * 0.55, 0, -0.5 - acilis * 0.3);
  ekle(k, "LeftForeArm", -0.2);
  ekle(k, "RightForeArm", -0.2);
  ekle(k, "Spine1", 0, Math.sin(ritim * 0.5) * 0.14, Math.sin(ritim) * 0.06);
  ekle(k, "Hips", vurus * 0.05, Math.sin(ritim * 0.5) * 0.1);
  ekle(k, "Head", -0.06, Math.sin(ritim * 0.5) * 0.2);
});

/** AŞIK ATAN — çömel, nişan al, fırlat, sonucu izle */
export const asikAtan = yap((k, t) => {
  const periyot = 5.6;
  const p = (t % periyot) / periyot;
  let cek = 0, at = 0, izle = 0;
  if (p < 0.35)      cek = p / 0.35;
  else if (p < 0.45) { at = (p - 0.35) / 0.1; cek = 1 - at; }
  else               izle = 1;

  ekle(k, "Spine1", 0.5 + izle * 0.16);
  ekle(k, "RightArm", -0.4 - cek * 0.9 + at * 1.5, 0, -0.2);
  ekle(k, "RightForeArm", -0.3 - cek * 0.6 + at * 0.8);
  ekle(k, "LeftArm", -0.3, 0, 0.35);
  ekle(k, "Head", 0.3 + izle * 0.22);
  ekle(k, "LeftUpLeg", -0.9);
  ekle(k, "RightUpLeg", -0.9);
  canlilik(k, t, 0.92);
});

/** AŞIK İZLEYEN — çömelmiş, heyecanlı */
export const asikIzleyen = yap((k, t) => {
  const heyecan = Math.max(0, Math.sin(t * 0.9 + 1.7) - 0.85) * 6;
  ekle(k, "Spine1", 0.42 - heyecan * 0.2);
  ekle(k, "LeftUpLeg", -0.95);
  ekle(k, "RightUpLeg", -0.95);
  ekle(k, "LeftArm", -0.55, 0, 0.4);
  ekle(k, "RightArm", -0.55, 0, -0.4);
  ekle(k, "Head", 0.26 - heyecan * 0.3, gurultu(t, 0.7, 2.2) * 0.24);
  canlilik(k, t, 0.11);
});

/** ÇOCUK — kıpır kıpır, sürekli hareket */
export const cocuk = yap((k, t) => {
  canlilik(k, t, 0.95);
  const kipir = gurultu(t, 1.7, 3.1);
  const zipla = Math.max(0, Math.sin(t * 1.3) - 0.9) * 8;
  ekle(k, "LeftArm", kipir * 0.22 - zipla * 0.4, 0, 0.18 + kipir * 0.1);
  ekle(k, "RightArm", -kipir * 0.22 - zipla * 0.4, 0, -0.18 - kipir * 0.1);
  ekle(k, "Spine1", 0, kipir * 0.16);
  ekle(k, "Head", 0, kipir * 0.34);
});

/** SOHBET — konuşma sırası, el hareketi, dinleme */
export const sohbet = yap((k, t) => {
  canlilik(k, t, 0.48);
  const p = (t % 11) / 11;
  const konus = p < 0.4 ? Math.sin((p / 0.4) * Math.PI * 3) * 0.5 + 0.5 : 0;
  const onay = p > 0.5 && p < 0.62 ? Math.sin(((p - 0.5) / 0.12) * Math.PI * 2) : 0;

  ekle(k, "RightArm", -0.2 - konus * 0.45, 0, -0.12 - konus * 0.12);
  ekle(k, "RightForeArm", -0.3 - konus * 0.5);
  ekle(k, "LeftArm", -0.1 - konus * 0.2, 0, 0.14);
  ekle(k, "Head", onay * 0.16, gurultu(t, 0.4, 0.8) * 0.2);
});

/** BEKLEYEN — ayakta duruyor ama ölü değil */
export const bekleyen = yap((k, t) => {
  canlilik(k, t, 0.64);
  const kaydir = Math.max(0, Math.sin(t * 0.13) - 0.75) * 4;
  const kolKavus = Math.sin(t * 0.08) * 0.5 + 0.5;
  ekle(k, "LeftArm", -kolKavus * 0.5, 0, 0.16 + kolKavus * 0.2);
  ekle(k, "RightArm", -kolKavus * 0.5, 0, -0.16 - kolKavus * 0.2);
  ekle(k, "LeftForeArm", -kolKavus * 0.75);
  ekle(k, "RightForeArm", -kolKavus * 0.75);
  ekle(k, "Hips", 0, kaydir * 0.12, kaydir * 0.05);
});

import { DURUSLAR } from "./durusKitapligi";

/**
 * Aktivite adı → hareket
 *
 * Oturan, çömelen ve yaslanan duruşlar `durusKitapligi`'ndan geliyor.
 * Ancient Egypt sahnelerindeki en belirgin fark buydu: bir sahnede
 * herkes ayakta durmuyor.
 */
export const ZANAAT_DUZELTMELERI: Record<string, KemikDuzeltme> = {
  // ---- oturan / çömelen duruşlar (öncelikli) ----
  comlekci: DURUSLAR.comlekciOturan,
  ipBuken: DURUSLAR.ipBukenOturan,
  ozan: DURUSLAR.ozanOturan,
  asci: DURUSLAR.asciDizUstu,
  asikAtan: DURUSLAR.asikAtanComelmis,
  asikIzleyen: DURUSLAR.izleyenComelmis,
  izleyenComelmis: DURUSLAR.izleyenComelmis,
  pazarci: DURUSLAR.saticiYaslanan,
  dinleyen: DURUSLAR.dinleyenAyakta,
  dinleyenOturan: DURUSLAR.dinleyenOturan,
  anlatan: DURUSLAR.anlatan,
  // ---- ayakta çalışanlar ----
  demirci, okYapan, dokumaci, deriGeren, keceBasan,
  coban, avci, tartan, guresci, atTerbiyecisi,
  dansci, cocuk, sohbet, bekleyen,
  asker: askerOkGercek,
  kilicTalimi,
  baltaci: yap((k, t) => {
    canlilik(k, t, 0.36);
    ekle(k, "Spine01", 0.06);
  }),
  nobetci: yap((k, t) => {
    canlilik(k, t, 0.72);
    const tara = gurultu(t, 0.19, 2.8);
    ekle(k, "Head", tara * 0.05, tara * 0.5);
    ekle(k, "Spine01", 0, tara * 0.12);
  }),
};
