"use client";

import { useEffect, useState } from "react";
import type { KesifKarti } from "@/lib/kartlar";
import { kesifGorseli } from "@/lib/kartlar";

/**
 * KEŞİF KARTI — çevrilebilir
 *
 * Ön yüz: kısa tanım (görsel varsa görselle).
 * Karta dokununca arkasına döner: açıklama ve varsa kaynak notu.
 *
 * Sahneyi durdurmaz; sağ üstte durur, yürümeye devam edebilirsiniz.
 */
export function KesifKartiPaneli({
  kart, onKapat, sonraki,
}: { kart: KesifKarti; onKapat: () => void; sonraki?: () => void }) {
  const [arka, setArka] = useState(false);
  const onGorsel = kesifGorseli(kart.id, "on");
  const arkaGorsel = kesifGorseli(kart.id, "arka");

  useEffect(() => {
    setArka(false);
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onKapat(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [kart.id, onKapat]);

  return (
    <div className="kesif-karti" role="status" aria-live="polite">
      <button
        type="button"
        className={`kesif-cevir ${arka ? "arka" : ""}`}
        onClick={() => setArka((a) => !a)}
        aria-label={`${kart.baslik} — çevirmek için dokun`}
      >
        {/* ÖN YÜZ — tanım */}
        <span className="kesif-yuz kesif-on">
          {onGorsel ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={onGorsel} alt={kart.baslik} className="kesif-gorsel" />
          ) : (
            <>
              <span className="kesif-karti-ust">
                <span className="kesif-karti-ikon" aria-hidden="true">{kart.ikon}</span>
                <span>
                  <span className="kesif-karti-baslik">{kart.baslik}</span>
                  <span className="kesif-karti-alt">{kart.altBaslik}</span>
                </span>
              </span>
              <span className="kesif-karti-metin">{kart.metin}</span>
            </>
          )}
        </span>

        {/* ARKA YÜZ — açıklama */}
        <span className="kesif-yuz kesif-arka">
          {arkaGorsel ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={arkaGorsel} alt={`${kart.baslik} açıklaması`} className="kesif-gorsel" />
          ) : (
            <>
              <span className="kesif-karti-baslik">{kart.baslik}</span>
              <span className="kesif-karti-metin">
                {kart.aciklama ?? kart.metin}
              </span>
              {kart.kaynak && !kart.kaynak.startsWith("DOĞRULANMALI") && (
                <span className="kesif-kaynak">Kaynak: {kart.kaynak}</span>
              )}
              {kart.kaynak?.startsWith("DOĞRULANMALI") && (
                <span className="kesif-kaynak uyari">⚠ Bu bilgi doğrulanmayı bekliyor</span>
              )}
            </>
          )}
        </span>
      </button>

      <div className="kesif-karti-dugmeler">
        <span className="kesif-cevir-ipucu">↻ Çevir</span>
        <button type="button" className="ikinci-dugme kucuk" onClick={onKapat}>Kapat</button>
        {sonraki && (
          <button type="button" className="ana-dugme kucuk" onClick={sonraki}>Göreve Geç 🎯</button>
        )}
      </div>
    </div>
  );
}
