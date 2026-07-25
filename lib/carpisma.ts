/**
 * ÇARPIŞMA SİSTEMİ
 *
 * Nesnelerin içinden geçilmesini engeller. Her nesne bir silindir
 * çarpıştırıcıyla temsil edilir (x, z, yarıçap). Oyuncu hareket ederken
 * bunlara çarpar ve **teğet kayarak** etrafından dolaşır — duvara
 * yapışmaz, akıcı hisseder.
 *
 * Performans: dünya 20 metrelik hücrelere bölünür. Oyuncu her karede
 * yalnız kendi hücresi ve çevresindeki 8 hücreyi sorgular; 500 nesne
 * olsa bile tek karede en fazla birkaç kontrol yapılır.
 */

export interface Carpistirici {
  x: number;
  z: number;
  r: number;
  /** üstünden atlanabilir mi (alçak nesneler) */
  alcak?: boolean;
}

const HUCRE = 20;
const izgara = new Map<string, Carpistirici[]>();
let toplam = 0;

function anahtar(x: number, z: number): string {
  return `${Math.floor(x / HUCRE)},${Math.floor(z / HUCRE)}`;
}

export function carpistiriciEkle(c: Carpistirici): void {
  const k = anahtar(c.x, c.z);
  if (!izgara.has(k)) izgara.set(k, []);
  izgara.get(k)!.push(c);
  toplam++;
}

export function carpistiricilariTemizle(): void {
  izgara.clear();
  toplam = 0;
}

export function carpistiriciSayisi(): number {
  return toplam;
}

/**
 * Hareketi çarpışmalara göre düzeltir.
 * @param x,z mevcut konum
 * @param nx,nz gidilmek istenen konum
 * @param yaricap oyuncunun yarıçapı
 * @param yukseklik oyuncunun zeminden yüksekliği (zıplarken alçak nesneleri aşar)
 */
export function hareketiCoz(
  x: number, z: number, nx: number, nz: number,
  yaricap = 0.45, yukseklik = 0
): { x: number; z: number } {
  let sx = nx;
  let sz = nz;

  const hx = Math.floor(nx / HUCRE);
  const hz = Math.floor(nz / HUCRE);

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const liste = izgara.get(`${hx + i},${hz + j}`);
      if (!liste) continue;
      for (const c of liste) {
        // zıplarken alçak nesnelerin üstünden geçilebilir
        if (c.alcak && yukseklik > 0.9) continue;
        const dx = sx - c.x;
        const dz = sz - c.z;
        const d = Math.hypot(dx, dz);
        const gereken = c.r + yaricap;
        if (d < gereken && d > 0.0001) {
          // nesnenin dışına it — teğet kayma
          const k = (gereken - d) / d;
          sx += dx * k;
          sz += dz * k;
        } else if (d <= 0.0001) {
          sx = c.x + gereken;
        }
      }
    }
  }
  return { x: sx, z: sz };
}

/** Varlık koduna göre çarpıştırıcı yarıçapı. 0 = çarpışma yok */
export const CARPISMA_YARICAP: Record<string, number> = {
  // otağlar ve yapılar
  A04: 3.0, P02: 1.6, B13: 3.4, B16: 1.0, B17: 1.1, B18: 0.8, B19: 0.6,
  B20: 0.8, B21: 0.35, P01: 1.4, P03: 0.7,
  // ocak ve kazan
  A05: 1.3, A06: 0.8,
  // sandık, kopuz, kilim
  A03: 0.9, A02: 0.0, A08: 0.0, P04: 0.0,
  // balbal ve taşlar
  A07: 0.55, E01: 0.7, E02: 0.9, E03: 0.8, E04: 0.0, E05: 2.4,
  // su başı
  F01: 1.1, F02: 0.0, F03: 0.0, F04: 0.7, F05: 0.3, F06: 1.2, F07: 0.3,
  // eski yurt
  G01: 2.6, G02: 0.0, G03: 1.8, G04: 0.0, G05: 0.5, G06: 0.25,
  G07: 5.5, G08: 0.0,
  // ortak
  H04: 0.25, C01: 0.6, C05: 0.0,
  // zanaat sahneleri
  Z01: 1.0, Z02: 1.4, Z03: 1.2, Z04: 0.5, Z05: 0.0, Z06: 0.0, Z07: 1.4,
  // hayvanlar ve kağnı
  B14: 0.5, B15: 1.4,
};


/**
 * KAMERA ENGELİ
 *
 * Karakterden kameraya çizilen doğru üzerinde çarpıştırıcı varsa,
 * kameranın gidebileceği en uzak orana (0-1) döner. 1 = engel yok.
 * Böylece kamera çadırın veya kayanın içinden bakmaz.
 */
export function kameraEngeli(
  ax: number, az: number, bx: number, bz: number, yaricap = 0.5
): number {
  const dx = bx - ax;
  const dz = bz - az;
  const uzunluk = Math.hypot(dx, dz);
  if (uzunluk < 0.01) return 1;

  let enYakin = 1;
  const adim = Math.max(2, Math.ceil(uzunluk / HUCRE));

  for (let a = 0; a <= adim; a++) {
    const t = a / adim;
    const px = ax + dx * t;
    const pz = az + dz * t;
    const hx = Math.floor(px / HUCRE);
    const hz = Math.floor(pz / HUCRE);

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const liste = izgara.get(`${hx + i},${hz + j}`);
        if (!liste) continue;
        for (const c of liste) {
          // doğru üzerindeki en yakın nokta
          const cx = c.x - ax;
          const cz = c.z - az;
          let s = (cx * dx + cz * dz) / (uzunluk * uzunluk);
          s = Math.max(0, Math.min(1, s));
          const yx = ax + dx * s - c.x;
          const yz = az + dz * s - c.z;
          const mesafe = Math.hypot(yx, yz);
          if (mesafe < c.r + yaricap) {
            // engelin başladığı orana kadar geri çek
            const geri = Math.max(0.22, s - (c.r + yaricap) / uzunluk);
            if (geri < enYakin) enYakin = geri;
          }
        }
      }
    }
  }
  return enYakin;
}
