"use client";

import { useEffect } from "react";
import type { KesifKarti } from "@/lib/kartlar";

/**
 * KEŞİF KARTI
 *
 * Keşfedilen her şey bir karta dönüşür: hotspotlar, bonus keşifler,
 * oba halkı. Sahneyi durdurmaz; sağ üstten süzülüp gelir, okunur,
 * kapatılır. Koleksiyona da eklenir.
 */
export function KesifKartiPaneli({
  kart, onKapat, sonraki,
}: { kart: KesifKarti; onKapat: () => void; sonraki?: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onKapat(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onKapat]);

  return (
    <div className="kesif-karti" role="status" aria-live="polite">
      <div className="kesif-karti-ust">
        <span className="kesif-karti-ikon" aria-hidden="true">{kart.ikon}</span>
        <div>
          <div className="kesif-karti-baslik">{kart.baslik}</div>
          <div className="kesif-karti-alt">{kart.altBaslik}</div>
        </div>
      </div>
      <p className="kesif-karti-metin">{kart.metin}</p>
      <div className="kesif-karti-dugmeler">
        <button type="button" className="ikinci-dugme kucuk" onClick={onKapat}>
          Kapat
        </button>
        {sonraki && (
          <button type="button" className="ana-dugme kucuk" onClick={sonraki}>
            Göreve Geç 🎯
          </button>
        )}
      </div>
    </div>
  );
}
