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
 * İlk kareye doğru slerp yapar: oran 1 = değişiklik yok, 0.4 = %60 kısılma.
 */
export function genlikKis(
  klip: THREE.AnimationClip,
  kemikler: string[],
  oran: number
): THREE.AnimationClip {
  const a = new THREE.Quaternion();
  const ilk = new THREE.Quaternion();
  for (const iz of klip.tracks) {
    if (!iz.name.endsWith(".quaternion")) continue;
    const kemik = iz.name.split(".")[0].replace("mixamorig:", "");
    if (!kemikler.includes(kemik)) continue;

    const v = iz.values as Float32Array;
    if (v.length < 4) continue;
    ilk.set(v[0], v[1], v[2], v[3]);
    for (let i = 0; i < v.length; i += 4) {
      a.set(v[i], v[i + 1], v[i + 2], v[i + 3]);
      ilk.slerp(a, oran); // ilk kare → mevcut kare arası
      const s = ilk.clone();
      ilk.set(v[0], v[1], v[2], v[3]); // ilk kareyi geri yükle
      v[i] = s.x; v[i + 1] = s.y; v[i + 2] = s.z; v[i + 3] = s.w;
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
      kemikler: ["RightArm", "RightForeArm", "Spine", "Spine1", "Spine2", "Hips"],
      oran: 0.42,
    },
    sure: 1.15,
  },
  {
    // "Turp çekme" abartısını tezgâh çekmesine indir
    esles: "pull",
    genlik: {
      kemikler: ["Spine", "Spine1", "Spine2", "Hips", "LeftUpLeg", "RightUpLeg"],
      oran: 0.45,
    },
    sure: 1.25,
  },
  {
    // Aşırı hevesli konuşmayı sakinleştir
    esles: "passionately",
    genlik: { kemikler: ["LeftArm", "RightArm", "Spine1", "Spine2"], oran: 0.6 },
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
