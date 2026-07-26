"use client";

import { useEffect, useState } from "react";
import type { RewardCard } from "@/lib/types";
import { durakKarti } from "@/lib/kartlar";
import { basariTinisi } from "@/lib/audio";

/**
 * DURAK KARTI
 *
 * Durak tamamlanınca kazanılan kart. Ön yüzüyle açılır, tıklayınca
 * arka yüzüne döner. Sahneyi durdurmaz — arka planda hayat akmaya
 * devam eder; kart sağ tarafta durur ve kapatılabilir.
 */
export function DurakKartiPaneli({ kart, onBitti }: { kart: RewardCard; onBitti: () => void }) {
  const veri = durakKarti(kart.cardId);
  const [arka, setArka] = useState(false);

  useEffect(() => { basariTinisi(); }, []);

  return (
    <div className="durak-karti-katman">
      <div className="durak-karti-kutu">
        <div className="durak-karti-etiket">Tarih Sandığı&apos;na eklendi</div>

        <button
          type="button"
          className={`kart-cevir ${arka ? "arka" : ""}`}
          onClick={() => setArka((a) => !a)}
          aria-label={`${kart.title} kartı — çevirmek için tıkla`}
        >
          <span className="kart-yuz kart-on">
            {veri ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={veri.frontImage} alt={kart.title} />
            ) : (
              <span className="kart-yedek">{kart.icon}</span>
            )}
          </span>
          <span className="kart-yuz kart-arka">
            {veri ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={veri.backImage} alt={`${kart.title} — arka yüz`} />
            ) : (
              <span className="kart-yedek">{kart.shortText}</span>
            )}
          </span>
        </button>

        <div className="durak-karti-alt">
          <span className="durak-karti-ipucu">↻ Çevirmek için karta dokun</span>
          <button type="button" className="ana-dugme kucuk" onClick={onBitti}>
            Devam Et →
          </button>
        </div>
      </div>
    </div>
  );
}
