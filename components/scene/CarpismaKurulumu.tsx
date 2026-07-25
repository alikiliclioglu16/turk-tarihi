"use client";

import { useEffect } from "react";
import { D01_YERLESIM } from "@/lib/assets";
import { HALK } from "@/lib/halk";
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
