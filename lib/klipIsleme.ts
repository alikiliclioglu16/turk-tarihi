import * as THREE from "three";

/**
 * KLİP İŞLEME
 *
 * Meshy klipleri iki sorunla geliyor:
 *
 * 1. ROOT MOTION — kalça yatayda geziniyor. Oyunda hareketi kod yönetiyor;
 *    animasyon da ilerlerse karakter yerinden kayar. Zanaatkâr GLB'sinde
 *    8 klipte tespit edildi (zıplamada 305 birim).
 *
 * 2. AŞIRI GENLİK — "Heavy_Hammer_Swing" kolu 248° savuruyor. Bu bir
 *    zanaat hareketi değil, savaş hareketi. Ritmi korunup genliği
 *    kısılmalı.
 *
 * Bu işlemler klip DÜZEYİNDE yapılır (her karede değil) — bedava.
 */

/** Kalçanın yatay gezinmesini sıfırlar, dikey salınımı korur */
export function rootMotionTemizle(klip: THREE.AnimationClip): THREE.AnimationClip {
  for (const iz of klip.tracks) {
    if (!/(Hips|mixamorig:Hips)\.position$/i.test(iz.name)) continue;
    const v = iz.values as Float32Array;
    if (v.length < 3) continue;
    const x0 = v[0];
    const z0 = v[2];
    for (let i = 0; i < v.length; i += 3) {
      v[i] = x0;       // X sabit
      v[i + 2] = z0;   // Z sabit
      // v[i+1] (Y) dokunulmaz — adım salınımı ve zıplama korunur
    }
  }
  return klip;
}

/**
 * Belirli kemiklerin dönüş genliğini kısar.
 *
 * ÖNEMLİ DÜZELTME: Önceki sürüm genliği İLK KAREYE doğru kısıyordu.
 * Ama birçok Meshy klibinin ilk karesi bind pozuna (T-pozu) yakındır;
 * bu yüzden kısma yaptıkça karakterler kollarını açıyordu.
 *
 * Doğrusu: klibin ORTALAMA pozuna doğru kısmak. Böylece hareketin
 * merkezi korunur, yalnız genliği azalır.
 *
 * oran 1 = değişiklik yok · 0.6 = %40 kısılma
 */
export function genlikKis(
  klip: THREE.AnimationClip,
  kemikler: string[],
  oran: number
): THREE.AnimationClip {
  const a = new THREE.Quaternion();
  const orta = new THREE.Quaternion();
  const sonuc = new THREE.Quaternion();

  for (const iz of klip.tracks) {
    if (!iz.name.endsWith(".quaternion")) continue;
    const kemikAdi = iz.name.split(".")[0].replace("mixamorig:", "");
    // ad eşleşmesi büyük/küçük harf ve Spine1/Spine01 farkını yok sayar
    const normal = (s: string) => s.toLowerCase().replace(/0(\d)/, "$1").replace(/[_:]/g, "");
    if (!kemikler.some((x) => normal(x) === normal(kemikAdi))) continue;

    const v = iz.values as Float32Array;
    const kare = v.length / 4;
    if (kare < 2) continue;

    // ---- 1) Ortalama poz: ardışık slerp ile yaklaşık ortalama ----
    orta.set(v[0], v[1], v[2], v[3]);
    for (let i = 4; i < v.length; i += 4) {
      a.set(v[i], v[i + 1], v[i + 2], v[i + 3]);
      // kuaterniyon işaret tutarlılığı — en kısa yol
      if (orta.dot(a) < 0) a.set(-a.x, -a.y, -a.z, -a.w);
      orta.slerp(a, 1 / (i / 4 + 1));
    }

    // ---- 2) Her kareyi ortalamaya doğru çek ----
    for (let i = 0; i < v.length; i += 4) {
      a.set(v[i], v[i + 1], v[i + 2], v[i + 3]);
      if (orta.dot(a) < 0) a.set(-a.x, -a.y, -a.z, -a.w);
      sonuc.copy(orta).slerp(a, oran);
      v[i] = sonuc.x; v[i + 1] = sonuc.y; v[i + 2] = sonuc.z; v[i + 3] = sonuc.w;
    }
  }
  return klip;
}

/** Klibi belirli bir süreye yavaşlatır/hızlandırır */
export function sureyiAyarla(klip: THREE.AnimationClip, carpan: number): THREE.AnimationClip {
  for (const iz of klip.tracks) {
    const t = iz.times as Float32Array;
    for (let i = 0; i < t.length; i++) t[i] *= carpan;
  }
  klip.duration *= carpan;
  return klip;
}

/** Klip adına göre uygulanacak düzeltmeler */
export interface KlipDuzeltme {
  /** hangi klip adını içeriyorsa */
  esles: string;
  /** kısılacak kemikler ve oran */
  genlik?: { kemikler: string[]; oran: number };
  /** süre çarpanı (1'den büyük = yavaşlar) */
  sure?: number;
}

export const VARSAYILAN_DUZELTMELER: KlipDuzeltme[] = [
  {
    // Savaş savurmasını zanaat çekicine çevir
    esles: "hammer",
    genlik: {
      kemikler: ["RightArm", "RightForeArm", "Spine", "Spine01", "Spine02", "Hips"],
      oran: 0.68,
    },
    sure: 1.15,
  },
  {
    // "Turp çekme" abartısını tezgâh çekmesine indir
    esles: "pull",
    genlik: {
      kemikler: ["Spine", "Spine01", "Spine02", "Hips", "LeftUpLeg", "RightUpLeg"],
      oran: 0.7,
    },
    sure: 1.25,
  },
  {
    // Aşırı hevesli konuşmayı sakinleştir
    esles: "passionately",
    genlik: { kemikler: ["LeftArm", "RightArm", "Spine01", "Spine02"], oran: 0.78 },
  },
];

/** Bir klip dizisini tümüyle işler */
export function klipleriIsle(
  klipler: THREE.AnimationClip[],
  duzeltmeler: KlipDuzeltme[] = VARSAYILAN_DUZELTMELER
): THREE.AnimationClip[] {
  return klipler.map((k) => {
    const kopya = k.clone();
    rootMotionTemizle(kopya);
    const ad = kopya.name.toLowerCase();
    for (const d of duzeltmeler) {
      if (!ad.includes(d.esles)) continue;
      if (d.genlik) genlikKis(kopya, d.genlik.kemikler, d.genlik.oran);
      if (d.sure) sureyiAyarla(kopya, d.sure);
    }
    return kopya;
  });
}
