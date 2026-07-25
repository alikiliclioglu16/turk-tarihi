"use client";

import { useEffect } from "react";
import { D01_YERLESIM } from "@/lib/assets";
import { HALK } from "@/lib/halk";
import { obaCadirlari } from "@/lib/buyukObaVeri";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";
import {
  carpistiriciEkle, carpistiricilariTemizle, CARPISMA_YARICAP, carpistiriciSayisi,
} from "@/lib/carpisma";

/**
 * Sahnedeki nesnelerin çarpıştırıcılarını bir kez kaydeder.
 * Yerleşim listesi sabit olduğu için bu iş yalnız açılışta yapılır.
 */
export function CarpismaKurulumu() {
  useEffect(() => {
    carpistiricilariTemizle();

    for (const y of D01_YERLESIM) {
      const temel = CARPISMA_YARICAP[y.kod];
      if (temel === undefined || temel <= 0) continue;
      carpistiriciEkle({
        x: y.pos[0],
        z: y.pos[2],
        r: temel * (y.olcek ?? 1),
        alcak: temel < 0.6,
      });
    }

    // BÜYÜK OBA ÇADIRLARI — 320 adet, önceden çarpışma listesinde yoktu
    for (const o of obaCadirlari()) {
      carpistiriciEkle({
        x: o.x * DUNYA_OLCEK,
        z: o.z * DUNYA_OLCEK,
        r: (o.beyMi ? 3.3 : 2.75) * o.s,
      });
    }

    // girilebilir otağlar: kapı boşluklu halka — içeri girilebilsin
    const girilebilir: [number, number, number, number][] = [
      [-27, -14, 0.75, 1.5], [36, 23, -0.6, 1.25],
      [-84, 52, 2.0, 1.2], [52, -76, 1.4, 1.2],
    ];
    for (const [gx, gz, rot, olc] of girilebilir) {
      const merkezX = gx * DUNYA_OLCEK;
      const merkezZ = gz * DUNYA_OLCEK;
      const R = 3.1 * olc;
      // 16 parçalık halka; kapı yönünde üç parça atlanır
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const kapiFarki = Math.abs(((a - rot + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (kapiFarki < 0.42) continue; // kapı boşluğu
        carpistiriciEkle({
          x: merkezX + Math.cos(a) * R,
          z: merkezZ + Math.sin(a) * R,
          r: 0.62,
        });
      }
    }

    // oba halkı da katı — içinden geçilmez
    for (const k of HALK) {
      const [px, pz] = k.rota ? k.rota[0] : k.pos;
      carpistiriciEkle({ x: px * DUNYA_OLCEK, z: pz * DUNYA_OLCEK, r: 0.42, alcak: true });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[çarpışma] kayıtlı nesne:", carpistiriciSayisi());
    }
  }, []);

  return null;
}
