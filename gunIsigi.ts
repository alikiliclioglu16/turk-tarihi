/**
 * BÜYÜK OBA VERİSİ
 *
 * Çadır konumları burada üretilir; hem çizim (BuyukOba.tsx) hem çarpışma
 * (CarpismaKurulumu.tsx) aynı listeyi kullanır. Önceden çizim kendi
 * listesini üretiyordu ve çarpışma sistemi bu 320 çadırı hiç görmüyordu —
 * bu yüzden içlerinden geçilebiliyordu.
 */

export interface ObaCadiri {
  x: number;
  z: number;
  s: number;
  r: number;
  /** ileri gelen çadırı mı — daha büyük, süslü, incelenebilir */
  beyMi: boolean;
}

export const OTAG_SAYISI = 320;

let _onbellek: ObaCadiri[] | null = null;

export function obaCadirlari(): ObaCadiri[] {
  if (_onbellek) return _onbellek;
  const liste: ObaCadiri[] = [];
  let tohum = 20260725;
  const rnd = () => {
    tohum = (tohum * 1103515245 + 12345) & 0x7fffffff;
    return tohum / 0x7fffffff;
  };

  // merkez meydan çevresinde halkalar
  for (let halka = 0; halka < 6; halka++) {
    const yaricap = 55 + halka * 26;
    const adet = 14 + halka * 5;
    for (let i = 0; i < adet; i++) {
      const a = (i / adet) * Math.PI * 2 + rnd() * 0.16;
      const r = yaricap + (rnd() - 0.5) * 14;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r + 30;
      if (Math.hypot(x, z - 30) < 42) continue;
      liste.push({ x, z, s: 0.72 + rnd() * 0.5, r: rnd() * Math.PI * 2, beyMi: false });
    }
  }

  // dış mahalle kümeleri
  const kumeler: [number, number][] = [
    [-150, 90], [140, 100], [-170, -30], [175, -40],
    [-90, 170], [95, 175], [0, 210], [-210, 60], [205, 55],
    [-130, -120], [130, -130], [0, -180],
  ];
  for (const [kx, kz] of kumeler) {
    const adet = 14 + Math.floor(rnd() * 12);
    for (let i = 0; i < adet; i++) {
      const a = rnd() * Math.PI * 2;
      const r = rnd() * 34;
      liste.push({
        x: kx + Math.cos(a) * r,
        z: kz + Math.sin(a) * r,
        s: 0.65 + rnd() * 0.55,
        r: rnd() * Math.PI * 2,
        beyMi: false,
      });
    }
  }

  const suzulen = liste.filter((o) => Math.hypot(o.x, o.z) < 300).slice(0, OTAG_SAYISI);

  // her kümenin en büyüğü "ileri gelen" çadırı olsun — görsel çeşitlilik
  for (let i = 0; i < suzulen.length; i += 17) {
    suzulen[i].beyMi = true;
    suzulen[i].s = Math.max(suzulen[i].s, 1.25);
  }

  _onbellek = suzulen;
  return suzulen;
}
