"use client";

import { useEffect } from "react";
import type { RewardCard } from "@/lib/types";
import { varlikYolu } from "@/lib/manifest";
import { basariTinisi } from "@/lib/audio";

interface Props {
  kart: RewardCard;
  basariMetni: string | null;
  onDevam: () => void;
}

/** Kart ödülü — kazanıldığında açılır, sandığa eklenir */
export function HistoryCardReward({ kart, basariMetni, onDevam }: Props) {
  const yol = varlikYolu(`card.${kart.cardId}`);

  useEffect(() => {
    basariTinisi();
  }, []);

  return (
    <div className="ortu" role="dialog" aria-modal="true" aria-label="Kart kazandın">
      {basariMetni && <p className="basari-metin">{basariMetni}</p>}

      <div className="kart">
        {yol ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={yol} alt={kart.title} className="kart-img" />
        ) : (
          <>
            <div className="kart-ikon" aria-hidden="true">{kart.icon}</div>
            <div className="kart-ad">{kart.title}</div>
            <div className="kart-kavram">{kart.concept}</div>
            <p className="kart-metin">{kart.shortText}</p>
          </>
        )}
      </div>

      <button type="button" className="ana-dugme buyuk" onClick={onDevam}>
        Sandığa Ekle 🧰
      </button>
    </div>
  );
}
