"use client";

import { useEffect } from "react";
import type { RewardCard } from "@/lib/types";
import { kartGorseli } from "@/lib/kartlar";
import { basariTinisi } from "@/lib/audio";

/**
 * KART ŞERİDİ
 *
 * Kart artık ekranı kaplamıyor. Kazanıldığında yandan süzülerek girer,
 * birkaç saniye durur ve koleksiyona düşer. Anlatı kesilmez; Dede Korkut
 * konuşmaya devam eder.
 */
export function KartSeridi({ kart, onBitti }: { kart: RewardCard; onBitti: () => void }) {
  const yol = kartGorseli(kart.cardId);

  useEffect(() => {
    basariTinisi();
    const z = setTimeout(onBitti, 4200);
    return () => clearTimeout(z);
  }, [onBitti]);

  return (
    <div className="kart-seridi" role="status" aria-live="polite">
      <div className="kart-seridi-ic">
        {yol ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={yol} alt={kart.title} className="kart-seridi-gorsel" />
        ) : (
          <div className="kart-seridi-ikon">{kart.icon}</div>
        )}
        <div className="kart-seridi-metin">
          <div className="kart-seridi-etiket">Tarih Sandığı&apos;na eklendi</div>
          <div className="kart-seridi-ad">{kart.title}</div>
          <div className="kart-seridi-kavram">{kart.concept}</div>
        </div>
      </div>
    </div>
  );
}
