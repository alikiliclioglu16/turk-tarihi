import * as THREE from "three";
import type { KemikDuzeltme } from "@/components/scene/models/KarakterGLB";

/**
 * ZANAAT DÜZELTMELERİ
 *
 * Aynı taban klip üstüne binen, işe özgü kol ve el hareketleri.
 * Bu katman sayesinde TEK zanaatkâr modeli beş farklı iş yapabiliyor.
 *
 * Her fonksiyon animasyon karışımından SONRA çalışır; kemik açısına
 * ekleme yapar, sıfırdan poz kurmaz.
 */

function d(k: Record<string, THREE.Bone>, ad: string) {
  return k[ad] ?? null;
}

/** DEMİRCİ — çekiç aynı noktaya ritmik iniyor, sol el işi tutuyor */
export const demirci: KemikDuzeltme = {
  uygula: (k, t) => {
    const vurus = Math.sin(t * 3.4);
    const kol = d(k, "RightArm");
    const on = d(k, "RightForeArm");
    const sol = d(k, "LeftArm");
    const solOn = d(k, "LeftForeArm");
    if (kol) kol.rotation.x += vurus * 0.22;
    if (on) on.rotation.x -= Math.max(0, vurus) * 0.3;
    // sol el sabit: malzemeyi tutuyor
    if (sol) { sol.rotation.z += 0.45; sol.rotation.x -= 0.55; }
    if (solOn) solOn.rotation.x -= 0.7;
  },
};

/** OK YAPAN — yavaş, ince hareket; gövdeyi çevirip düzlüyor */
export const okYapan: KemikDuzeltme = {
  uygula: (k, t) => {
    const cevir = Math.sin(t * 1.6);
    const kol = d(k, "RightArm");
    const on = d(k, "RightForeArm");
    const el = d(k, "RightHand");
    const sol = d(k, "LeftArm");
    if (kol) { kol.rotation.x += 0.35; kol.rotation.z -= 0.2; }
    if (on) on.rotation.x -= 0.95 + cevir * 0.12;
    if (el) el.rotation.y += cevir * 0.55;   // gövdeyi çeviriyor
    if (sol) { sol.rotation.z += 0.5; sol.rotation.x -= 0.45; }
  },
};

/** DOKUMACI — mekik ileri geri, çözgü gerdiriliyor */
export const dokumaci: KemikDuzeltme = {
  uygula: (k, t) => {
    const mekik = Math.sin(t * 2.1);
    const sag = d(k, "RightArm");
    const sol = d(k, "LeftArm");
    const sagOn = d(k, "RightForeArm");
    const solOn = d(k, "LeftForeArm");
    if (sag) { sag.rotation.x -= 0.5; sag.rotation.z -= 0.25 + mekik * 0.3; }
    if (sol) { sol.rotation.x -= 0.5; sol.rotation.z += 0.25 - mekik * 0.3; }
    if (sagOn) sagOn.rotation.x -= 0.55;
    if (solOn) solOn.rotation.x -= 0.55;
  },
};

/** DERİ GEREN — iki elle yukarı geriyor, ayaklar sabit */
export const deriGeren: KemikDuzeltme = {
  uygula: (k, t) => {
    const cek = Math.sin(t * 1.3);
    const sag = d(k, "RightArm");
    const sol = d(k, "LeftArm");
    if (sag) { sag.rotation.x -= 1.05 - cek * 0.18; sag.rotation.z -= 0.3; }
    if (sol) { sol.rotation.x -= 1.05 - cek * 0.18; sol.rotation.z += 0.3; }
  },
};

/** ÇÖMLEKÇİ — oturmuş, iki el kabı şekillendiriyor */
export const comlekci: KemikDuzeltme = {
  uygula: (k, t) => {
    const nefes = Math.sin(t * 3.0) * 0.06;
    const sag = d(k, "RightArm");
    const sol = d(k, "LeftArm");
    const sagOn = d(k, "RightForeArm");
    const solOn = d(k, "LeftForeArm");
    const govde = d(k, "Spine1");
    if (govde) govde.rotation.x += 0.3;
    if (sag) { sag.rotation.x -= 0.95 + nefes; sag.rotation.z -= 0.4; }
    if (sol) { sol.rotation.x -= 0.95 - nefes; sol.rotation.z += 0.4; }
    if (sagOn) sagOn.rotation.x -= 1.05;
    if (solOn) solOn.rotation.x -= 1.05;
  },
};

/** İP BÜKEN — el döndürüyor, iğ çeviriyor */
export const ipBuken: KemikDuzeltme = {
  uygula: (k, t) => {
    const don = t * 5.2;
    const sag = d(k, "RightArm");
    const sagOn = d(k, "RightForeArm");
    const el = d(k, "RightHand");
    const sol = d(k, "LeftArm");
    if (sag) { sag.rotation.x -= 0.75; sag.rotation.z -= 0.35; }
    if (sagOn) sagOn.rotation.x -= 0.9;
    if (el) el.rotation.y = Math.sin(don) * 0.8;
    if (sol) { sol.rotation.x -= 0.6; sol.rotation.z += 0.5; }
  },
};

/** KEÇE BASAN — öne eğilip yuvarlıyor */
export const keceBasan: KemikDuzeltme = {
  uygula: (k, t) => {
    const it = Math.sin(t * 1.9);
    const govde = d(k, "Spine1");
    const sag = d(k, "RightArm");
    const sol = d(k, "LeftArm");
    if (govde) govde.rotation.x += 0.55 + it * 0.14;
    if (sag) { sag.rotation.x -= 1.25 - it * 0.2; sag.rotation.z -= 0.2; }
    if (sol) { sol.rotation.x -= 1.25 - it * 0.2; sol.rotation.z += 0.2; }
  },
};

/** AŞÇI — kazanı karıştırıyor */
export const asci: KemikDuzeltme = {
  uygula: (k, t) => {
    const daire = t * 2.2;
    const sag = d(k, "RightArm");
    const sagOn = d(k, "RightForeArm");
    const govde = d(k, "Spine1");
    if (govde) govde.rotation.x += 0.35;
    if (sag) {
      sag.rotation.x -= 0.85 + Math.sin(daire) * 0.16;
      sag.rotation.z -= 0.3 + Math.cos(daire) * 0.16;
    }
    if (sagOn) sagOn.rotation.x -= 0.7;
  },
};

/** Aktivite adı → düzeltme */
export const ZANAAT_DUZELTMELERI: Record<string, KemikDuzeltme> = {
  demirci, okYapan, dokumaci, deriGeren, comlekci, ipBuken, keceBasan, asci,
};
