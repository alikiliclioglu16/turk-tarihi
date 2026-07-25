"use client";

import type { TourNode } from "@/lib/types";

interface Props {
  nodlar: TourNode[];
  aktifIndex: number;
  kartSayisi: number;
  sessiz: boolean;
  altyazi: boolean;
  onSes: () => void;
  onAltyazi: () => void;
}

/** Üst şerit: durak ilerlemesi, kart sayacı ve erişilebilirlik anahtarları */
export function NodeProgress({
  nodlar, aktifIndex, kartSayisi, sessiz, altyazi, onSes, onAltyazi,
}: Props) {
  return (
    <header className="ust-serit">
      <div className="marka">🪕 D01 · Tarihin Kapısı</div>

      <div className="ust-orta" aria-label="Durak ilerlemesi">
        <ol className="durak-listesi">
          {nodlar.map((n, i) => (
            <li
              key={n.nodeId}
              className={i < aktifIndex ? "gecti" : i === aktifIndex ? "aktif" : ""}
              title={n.title}
            >
              <span className="sr-only">
                {n.title} {i < aktifIndex ? "tamamlandı" : i === aktifIndex ? "şu an" : "kilitli"}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="ust-sag">
        <span className="kart-sayaci" aria-label={`${kartSayisi} kart kazanıldı`}>
          🃏 {kartSayisi}
        </span>
        <button type="button" className="mini-dugme" onClick={onAltyazi}
          aria-pressed={altyazi} title={altyazi ? "Altyazıyı kapat" : "Altyazıyı aç"}>
          {altyazi ? "💬" : "🚫"}
        </button>
        <button type="button" className="mini-dugme" onClick={onSes}
          aria-pressed={!sessiz} title={sessiz ? "Sesi aç" : "Sesi kapat"}>
          {sessiz ? "🔇" : "🔊"}
        </button>
      </div>
    </header>
  );
}
