"use client";

import { useEffect } from "react";
import { D01_YERLESIM } from "@/lib/assets";
import { HALK } from "@/lib/halk";
import { obaCadirlari } from "@/lib/buyukObaVeri";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";
import {
  carpistiriciEkle, carpistiricilariTemizle, CARPISMA_YARICAP, carpistiriciSayisi,
} from "@/lib/carpisma";
import { kademeliCalistir, type Gorev } from "@/lib/yuklemeYoneticisi";

/**
 * Sahnedeki nesnelerin çarpıştırıcılarını bir kez kaydeder.
 * Yerleşim listesi sabit olduğu için bu iş yalnız açılışta yapılır.
 */
export function CarpismaKurulumu() {
  useEffect(() => {
    carpistiricilariTemizle();
    let iptal = false;

    const cadirlar = obaCadirlari();

    const gorevler: Gorev[] = [
      {
        ad: "Nesneler yerleştiriliyor",
        adim: D01_YERLESIM.length,
        calistir: (i) => {
          const y = D01_YERLESIM[i];
          const temel = CARPISMA_YARICAP[y.kod];
          if (temel === undefined || temel <= 0) return;
          carpistiriciEkle({
            x: y.pos[0], z: y.pos[2],
            r: temel * (y.olcek ?? 1),
            alcak: temel < 0.6,
          });
        },
      },
      {
        ad: "Oba kuruluyor",
        adim: cadirlar.length,
        calistir: (i) => {
          const o = cadirlar[i];
          carpistiriciEkle({
            x: o.x * DUNYA_OLCEK, z: o.z * DUNYA_OLCEK,
            r: (o.beyMi ? 3.3 : 2.75) * o.s,
          });
        },
      },
      {
        ad: "Oba halkı geliyor",
        adim: HALK.length,
        calistir: (i) => {
          const k = HALK[i];
          const [px, pz] = k.rota ? k.rota[0] : k.pos;
          carpistiriciEkle({ x: px * DUNYA_OLCEK, z: pz * DUNYA_OLCEK, r: 0.42, alcak: true });
        },
      },
    ];

    // girilebilir otağlar: kapı boşluklu halka — içeri girilebilsin
    const girilebilir: [number, number, number, number][] = [
      [-27, -14, 0.75, 1.5], [36, 23, -0.6, 1.25],
      [-84, 52, 2.0, 1.2], [52, -76, 1.4, 1.2],
      [0, 20, 0.2, 1.8], [46, -30, -1.1, 1.45],
      [-44, 72, 2.4, 1.35], [70, 26, 0.9, 1.35],
    ];
    for (const [gx, gz, rot, olc] of girilebilir) {
      const merkezX = gx * DUNYA_OLCEK;
      const merkezZ = gz * DUNYA_OLCEK;
      const R = 3.1 * olc;
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const kapiFarki = Math.abs(((a - rot + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (kapiFarki < 0.42) continue;
        carpistiriciEkle({
          x: merkezX + Math.cos(a) * R,
          z: merkezZ + Math.sin(a) * R,
          r: 0.62,
        });
      }
    }

    void kademeliCalistir(gorevler).then(() => {
      if (iptal) return;
      if (process.env.NODE_ENV === "development") {
        console.log("[çarpışma] kayıtlı nesne:", carpistiriciSayisi());
      }
    });

    return () => { iptal = true; };
  }, []);

  return null;
}
