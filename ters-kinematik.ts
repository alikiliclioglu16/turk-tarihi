import type { KemikDuzeltme } from "@/components/scene/models/KarakterGLB";
import { ekle, gurultu, canlilik, type Kemikler } from "./hareketKitapligi";

/**
 * DURUŞ KİTAPLIĞI
 *
 * Ancient Egypt'in sahnelerini incelediğimde asıl farkın hareket
 * kalitesi değil DURUŞ ÇEŞİTLİLİĞİ olduğunu gördüm.
 *
 * Bizde herkes ayakta duruyordu. Onlarda bir sahnede:
 *   · biri yere oturmuş
 *   · biri diz çökmüş
 *   · biri tezgâha yaslanmış
 *   · biri ayakta anlatıyor
 *   · biri kollarını kavuşturmuş dinliyor
 *
 * Bu çeşitlilik sahneyi "insanlar bir arada iş yapıyor" gibi
 * gösteriyor. Hepsi ayakta durunca "kalabalık bekliyor" gibi görünüyor.
 *
 * Bu dosya taban duruşları tanımlar; iş hareketleri üstüne biner.
 */

type D = (k: Kemikler, t: number) => void;
const yap = (f: D): KemikDuzeltme => ({ uygula: f });

/* ============================================================
   OTURMA VE ÇÖKME
   ============================================================ */

/** Bağdaş kurmuş — yere oturmuş, dizler yanlara açık */
export function bagdasKur(k: Kemikler): void {
  ekle(k, "LeftUpLeg", -1.42, 0, 0.62);
  ekle(k, "RightUpLeg", -1.42, 0, -0.62);
  ekle(k, "LeftLeg", 1.55);
  ekle(k, "RightLeg", 1.55);
  ekle(k, "Hips", -0.18);
  ekle(k, "Spine", 0.12);
}

/** Tek diz üstü — çalışırken sık kullanılan duruş */
export function dizCok(k: Kemikler): void {
  ekle(k, "RightUpLeg", -1.5, 0, -0.15);
  ekle(k, "RightLeg", 1.62);
  ekle(k, "LeftUpLeg", -0.95, 0, 0.2);
  ekle(k, "LeftLeg", 1.15);
  ekle(k, "Hips", -0.1);
}

/** Çömelmiş — topuklar üstünde */
export function comel(k: Kemikler): void {
  ekle(k, "LeftUpLeg", -1.62, 0, 0.28);
  ekle(k, "RightUpLeg", -1.62, 0, -0.28);
  ekle(k, "LeftLeg", 1.85);
  ekle(k, "RightLeg", 1.85);
  ekle(k, "Hips", -0.24);
  ekle(k, "Spine01", 0.22);
}

/** Tabureye oturmuş — dizler önde, dik gövde */
export function tabureyeOtur(k: Kemikler): void {
  ekle(k, "LeftUpLeg", -1.48, 0, 0.14);
  ekle(k, "RightUpLeg", -1.48, 0, -0.14);
  ekle(k, "LeftLeg", 1.5);
  ekle(k, "RightLeg", 1.5);
  ekle(k, "Hips", -0.12);
}

/** Tezgâha yaslanmış — ağırlık bir kolda */
export function yaslan(k: Kemikler): void {
  ekle(k, "Spine01", 0.24, 0, 0.1);
  ekle(k, "LeftArm", -1.05, 0, 0.3);
  ekle(k, "LeftForeArm", -0.35);
  ekle(k, "LeftUpLeg", 0, 0, 0.08);
  ekle(k, "RightUpLeg", -0.1, 0, -0.06);
}

/* ============================================================
   DİNLEME VE İZLEME DURUŞLARI
   ============================================================ */

/** Ayakta dinliyor — kollar kavuşmuş, hafif öne eğik */
export const dinleyenAyakta = yap((k, t) => {
  canlilik(k, t, 0.4);
  const onay = Math.max(0, Math.sin(t * 0.31) - 0.82) * 5;
  ekle(k, "LeftArm", -0.62, 0, 0.34);
  ekle(k, "RightArm", -0.62, 0, -0.34);
  ekle(k, "LeftForeArm", -1.15);
  ekle(k, "RightForeArm", -1.15);
  ekle(k, "Spine01", 0.1);
  ekle(k, "Head", 0.14 + onay * 0.12);
});

/** Oturmuş dinliyor — bağdaş, eller dizde */
export const dinleyenOturan = yap((k, t) => {
  canlilik(k, t, 0.66);
  bagdasKur(k);
  const onay = Math.max(0, Math.sin(t * 0.27 + 1.2) - 0.85) * 6;
  ekle(k, "LeftArm", -0.85, 0, 0.42);
  ekle(k, "RightArm", -0.85, 0, -0.42);
  ekle(k, "LeftForeArm", -0.55);
  ekle(k, "RightForeArm", -0.55);
  ekle(k, "Head", 0.1 + onay * 0.14);
});

/** Çömelmiş izliyor — çocuk oyunu, güreş seyri */
export const izleyenComelmis = yap((k, t) => {
  canlilik(k, t, 0.15);
  comel(k);
  const heyecan = Math.max(0, Math.sin(t * 0.8 + 2.1) - 0.87) * 7;
  ekle(k, "LeftArm", -0.5, 0, 0.36);
  ekle(k, "RightArm", -0.5, 0, -0.36);
  ekle(k, "LeftForeArm", -0.85);
  ekle(k, "RightForeArm", -0.85);
  ekle(k, "Head", 0.18 - heyecan * 0.25, gurultu(t, 0.6, 1.9) * 0.2);
});

/** Anlatıyor — ayakta, el hareketiyle */
export const anlatan = yap((k, t) => {
  canlilik(k, t, 0.28);
  const p = (t % 8) / 8;
  const vurgu = Math.sin(p * Math.PI * 5) * 0.5 + 0.5;
  const isaret = p > 0.4 && p < 0.6 ? Math.sin(((p - 0.4) / 0.2) * Math.PI) : 0;

  ekle(k, "RightArm", -0.45 - vurgu * 0.35 - isaret * 0.7, 0, -0.2 - isaret * 0.2);
  ekle(k, "RightForeArm", -0.6 - vurgu * 0.3 + isaret * 0.35);
  ekle(k, "LeftArm", -0.25 - vurgu * 0.18, 0, 0.22);
  ekle(k, "LeftForeArm", -0.5);
  ekle(k, "Spine01", -0.04, gurultu(t, 0.22, 0.6) * 0.16);
  ekle(k, "Head", -0.06, gurultu(t, 0.26, 1.1) * 0.3);
});

/* ============================================================
   OTURARAK ÇALIŞANLAR — iş hareketi + oturma
   ============================================================ */

/** Çömlekçi — tabureye oturmuş, çarkın başında */
export const comlekciOturan = yap((k, t) => {
  canlilik(k, t, 0.44);
  tabureyeOtur(k);
  const yukselt = (Math.sin(t * 0.42) * 0.5 + 0.5);
  const titre = gurultu(t, 5.2, 0.7) * 0.02;
  ekle(k, "Spine01", 0.36);
  ekle(k, "RightArm", -0.95 - yukselt * 0.15 + titre, 0, -0.42);
  ekle(k, "LeftArm", -0.95 - yukselt * 0.15 - titre, 0, 0.42);
  ekle(k, "RightForeArm", -1.0);
  ekle(k, "LeftForeArm", -1.0);
  ekle(k, "Head", 0.44);
});

/** İp büken — yere bağdaş kurmuş */
export const ipBukenOturan = yap((k, t) => {
  canlilik(k, t, 0.88);
  bagdasKur(k);
  const don = t * 4.6;
  ekle(k, "RightArm", -0.72, 0, -0.34);
  ekle(k, "RightForeArm", -0.8);
  ekle(k, "RightHand", 0, Math.sin(don) * 0.72, Math.cos(don) * 0.22);
  ekle(k, "LeftArm", -0.6, 0, 0.46);
  ekle(k, "LeftForeArm", -0.62);
  ekle(k, "Head", 0.24);
});

/** Ozan — bağdaş kurmuş, kopuz çalıyor */
export const ozanOturan = yap((k, t) => {
  canlilik(k, t, 0.71);
  bagdasKur(k);
  const tel = t * 6.2;
  const ezgi = gurultu(t, 0.55, 0.9);
  ekle(k, "Spine01", 0.14 + ezgi * 0.05);
  ekle(k, "RightArm", -0.8, 0, -0.32);
  ekle(k, "RightForeArm", -0.85);
  ekle(k, "RightHand", Math.sin(tel) * 0.3);
  ekle(k, "LeftArm", -0.95, 0, 0.46);
  ekle(k, "LeftForeArm", -1.1);
  ekle(k, "LeftHand", 0, Math.sin(tel * 0.4) * 0.26);
  ekle(k, "Head", -0.08 + ezgi * 0.12, ezgi * 0.16);
});

/** Aşçı — diz çökmüş, ocağın başında */
export const asciDizUstu = yap((k, t) => {
  canlilik(k, t, 0.26);
  dizCok(k);
  const daire = t * 1.9;
  const tat = Math.max(0, Math.sin(t * 0.19) - 0.88) * 8;
  ekle(k, "Spine01", 0.26 - tat * 0.18);
  ekle(k, "RightArm", -0.78 + Math.sin(daire) * 0.14 - tat * 0.5, 0, -0.3 + Math.cos(daire) * 0.14);
  ekle(k, "RightForeArm", -0.6 - tat * 0.7);
  ekle(k, "LeftArm", -0.35, 0, 0.48);
  ekle(k, "Head", 0.34 - tat * 0.28);
});

/** Aşık atan çocuk — çömelmiş, fırlatıyor */
export const asikAtanComelmis = yap((k, t) => {
  canlilik(k, t, 0.92);
  comel(k);
  const periyot = 5.6;
  const p = (t % periyot) / periyot;
  let cek = 0, at = 0, izle = 0;
  if (p < 0.35) cek = p / 0.35;
  else if (p < 0.45) { at = (p - 0.35) / 0.1; cek = 1 - at; }
  else izle = 1;
  ekle(k, "RightArm", -0.4 - cek * 0.85 + at * 1.4, 0, -0.22);
  ekle(k, "RightForeArm", -0.3 - cek * 0.55 + at * 0.75);
  ekle(k, "LeftArm", -0.35, 0, 0.36);
  ekle(k, "Head", 0.22 + izle * 0.2);
});

/** Tezgâhta satıcı — yaslanmış, mal gösteriyor */
export const saticiYaslanan = yap((k, t) => {
  canlilik(k, t, 0.37);
  yaslan(k);
  const p = (t % 9) / 9;
  const goster = p > 0.3 && p < 0.55 ? Math.sin(((p - 0.3) / 0.25) * Math.PI) : 0;
  ekle(k, "RightArm", -0.4 - goster * 0.7, 0, -0.18 - goster * 0.18);
  ekle(k, "RightForeArm", -0.4 - goster * 0.25);
  ekle(k, "Head", 0, gurultu(t, 0.3, 1.4) * 0.26);
});

/** Duruş adı → hareket */
export const DURUSLAR: Record<string, KemikDuzeltme> = {
  dinleyenAyakta, dinleyenOturan, izleyenComelmis, anlatan,
  comlekciOturan, ipBukenOturan, ozanOturan, asciDizUstu,
  asikAtanComelmis, saticiYaslanan,
};
