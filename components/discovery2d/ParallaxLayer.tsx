"use client";

import { ReactNode } from "react";
import { varlikYolu, type VarlikKaydi } from "@/lib/manifest";
import { KatmanYerTutucu } from "./Placeholder";

interface Props {
  kayit: VarlikKaydi;
  /** Fare/eğim kaynaklı normalize edilmiş sapma (-1..1) */
  sapmaX: number;
  sapmaY: number;
  /** Hareket azaltma tercihi */
  azalt: boolean;
  cocuk?: ReactNode;
}

/**
 * Tek bir derinlik katmanı.
 * Katmanın `derinlik` değeri ne kadar yüksekse o kadar çok kayar —
 * derinlik hissi bu farktan doğar.
 */
export function ParallaxLayer({ kayit, sapmaX, sapmaY, azalt, cocuk }: Props) {
  const d = kayit.derinlik ?? 0;
  const carpan = azalt ? 0 : d;
  const tx = sapmaX * carpan * 2.6;
  const ty = sapmaY * carpan * 1.5;
  // kayma sırasında kenarlarda boşluk oluşmasın diye hafif büyütme
  const olcek = 1 + carpan * 0.04;
  const yol = varlikYolu(kayit.id);
  const anahtar = kayit.id.split(".").pop() ?? "";

  return (
    <div
      className="parallax-kat"
      style={{ transform: `translate3d(${tx}%, ${ty}%, 0) scale(${olcek})` }}
      aria-hidden="true"
    >
      {yol ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={yol} alt="" className="kat-img" loading="lazy" decoding="async" />
      ) : (
        <KatmanYerTutucu tur={anahtar} />
      )}
      {cocuk}
    </div>
  );
}
