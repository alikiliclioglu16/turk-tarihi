"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { AssetModel } from "./AssetModel";
import { D01_YERLESIM } from "@/lib/assets";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";

/** Bu uzaklığın ötesindeki nesneler hiç çizilmez */
const CIZIM_MESAFESI = 90;

/**
 * MESAFE TABANLI GÖRÜNÜRLÜK
 *
 * Dünya 160×180 metre ve içinde ~70 nesne grubu var; her biri onlarca
 * alt parçadan oluşuyor. Hepsini her karede çizmek sahneyi kilitliyordu.
 *
 * Burada yalnız oyuncunun çevresindeki nesneler sahneye giriyor.
 * Liste saniyede iki kez güncelleniyor — yürürken fark edilmiyor,
 * ama çizim çağrısı sayısı dörtte birine iniyor.
 */
export function YakinVarliklar() {
  const [yakinlar, setYakinlar] = useState<number[]>([]);
  const sonKontrol = useRef(0);
  const sonAnahtar = useRef("");

  const hesapla = () => {
    const liste: number[] = [];
    for (let i = 0; i < D01_YERLESIM.length; i++) {
      const y = D01_YERLESIM[i];
      const d = Math.hypot(y.pos[0] - oyuncuKonumu.x, y.pos[2] - oyuncuKonumu.z);
      if (d < CIZIM_MESAFESI) liste.push(i);
    }
    const anahtar = liste.join(",");
    if (anahtar !== sonAnahtar.current) {
      sonAnahtar.current = anahtar;
      setYakinlar(liste);
    }
  };

  useEffect(hesapla, []);

  useFrame(({ clock }) => {
    if (clock.elapsedTime - sonKontrol.current < 0.5) return;
    sonKontrol.current = clock.elapsedTime;
    hesapla();
  });

  return (
    <>
      {yakinlar.map((i) => {
        const y = D01_YERLESIM[i];
        return (
          <AssetModel key={`${y.kod}-${i}`} kod={y.kod} pos={y.pos} rotY={y.rotY} olcek={y.olcek} />
        );
      })}
    </>
  );
}
