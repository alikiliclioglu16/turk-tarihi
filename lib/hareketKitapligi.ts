import * as THREE from "three";

/**
 * HAREKET KİTAPLIĞI
 *
 * Prosedürel hareketi organik yapan araçlar.
 *
 * Tek sinüs dalgası mekanik görünür — metronom gibi. Canlı hareket
 * şu özelliklere sahiptir:
 *
 *  · Birden çok üst üste binen frekans (nefes + iş + mikro titreme)
 *  · Ağırlık aktarımı (bir bacaktan diğerine)
 *  · Takip hareketi (kol durunca önkol devam eder)
 *  · Hazırlık (vuruştan önce geri çekilme)
 *  · Asimetri (sol ve sağ hiç aynı olmaz)
 *  · Ara verme (insan sürekli aynı işi yapmaz, arada duraklar)
 *  · Baş hareketi (işe bakar, arada çevreye bakar)
 */

/* ---------- TEMEL DALGALAR ---------- */

/** Basit sinüs */
export const sin = (t: number, hz: number, faz = 0) => Math.sin(t * hz + faz);

/**
 * Katmanlı gürültü — üç frekansın toplamı.
 * Tek sinüsün mekanikliğini kırar, doğal düzensizlik verir.
 */
export function gurultu(t: number, hz: number, faz = 0): number {
  return (
    Math.sin(t * hz + faz) * 0.62 +
    Math.sin(t * hz * 2.37 + faz * 1.7) * 0.26 +
    Math.sin(t * hz * 0.41 + faz * 0.3) * 0.12
  );
}

/**
 * Vuruş eğrisi — hazırlık, hızlı iniş, temas, geri dönüş.
 * Çekiç, balta, kürek gibi işler için. 0-1 arası döner.
 *
 * Zaman eğrisi: %40 hazırlık (yavaş yukarı), %15 iniş (hızlı),
 * %10 temas (dur), %35 geri dönüş.
 */
export function vurusEgrisi(t: number, periyot: number): number {
  const p = (t % periyot) / periyot;
  if (p < 0.40) return -Math.sin((p / 0.40) * Math.PI * 0.5) * 0.9;      // hazırlık
  if (p < 0.55) {
    const k = (p - 0.40) / 0.15;
    return -0.9 + k * k * 1.9;                                           // iniş (ivmeli)
  }
  if (p < 0.65) return 1.0;                                              // temas
  const g = (p - 0.65) / 0.35;
  return 1.0 - Math.sin(g * Math.PI * 0.5) * 1.0;                        // geri dönüş
}

/**
 * Ara verme kapısı — insan sürekli çalışmaz.
 * Belirli aralıklarla 0'a düşer (duraklama), sonra 1'e döner.
 */
export function calismaKapisi(t: number, dongu = 14, molaOrani = 0.18): number {
  const p = (t % dongu) / dongu;
  if (p > 1 - molaOrani) {
    const k = (p - (1 - molaOrani)) / molaOrani;
    return Math.cos(k * Math.PI * 2) * 0.5 + 0.5;   // yumuşak in-çık
  }
  return 1;
}

/** Nefes — gövdenin sürekli, hafif salınımı */
export function nefes(t: number, hiz = 0.9): number {
  return Math.sin(t * hiz) * 0.5 + Math.sin(t * hiz * 2.1) * 0.12;
}

/**
 * Takip hareketi — bir kemiğin gecikmeli tepkisi.
 * Kol durunca önkolun devam etmesi gibi.
 */
export function takip(deger: number, gecikme: number, t: number, hz: number): number {
  return deger * Math.cos(gecikme) - Math.sin(t * hz - gecikme) * 0.08;
}

/* ---------- KEMİK YARDIMCILARI ---------- */

export type Kemikler = Record<string, THREE.Bone>;

export const kemik = (k: Kemikler, ad: string): THREE.Bone | null => k[ad] ?? null;

/** Kemiğe ekleme yapar (animasyonu ezmez) */
export function ekle(
  k: Kemikler, ad: string,
  x = 0, y = 0, z = 0
): void {
  const b = k[ad];
  if (!b) return;
  b.rotation.x += x;
  b.rotation.y += y;
  b.rotation.z += z;
}

/* ---------- ORTAK KATMANLAR ---------- */

/**
 * CANLILIK KATMANI
 *
 * Her figüre uygulanan taban hareket: nefes, ağırlık aktarımı,
 * baş mikro hareketi. Bunlar olmadan figür heykel gibi durur.
 *
 * `kisilik` her figürde farklı olmalı — 0-1 arası, kimlikten türetilir.
 */
export function canlilik(k: Kemikler, t: number, kisilik: number): void {
  const f = kisilik * 6.28;

  // nefes — göğüs ve omuzlar
  const n = nefes(t, 0.82 + kisilik * 0.2);
  ekle(k, "Spine1", n * 0.022);
  ekle(k, "Spine2", n * 0.016);
  ekle(k, "LeftShoulder", 0, 0, n * 0.02);
  ekle(k, "RightShoulder", 0, 0, -n * 0.02);

  // ağırlık aktarımı — çok yavaş, sağa sola
  const agirlik = gurultu(t, 0.17, f);
  ekle(k, "Hips", 0, agirlik * 0.035, agirlik * 0.028);

  // baş — işe bakar ama arada çevreye göz atar
  const bakis = gurultu(t, 0.23, f * 1.3);
  const gozAt = Math.max(0, Math.sin(t * 0.11 + f) - 0.86) * 7;
  ekle(k, "Head", bakis * 0.05, bakis * 0.11 + gozAt * 0.5, bakis * 0.03);
  ekle(k, "Neck", bakis * 0.03, bakis * 0.05);
}
