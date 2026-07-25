"use client";

import { useEffect, useState } from "react";

export type Kalite = "dusuk" | "orta" | "yuksek";

const ANAHTAR = "dk_kalite";

/** Kalite tercihi — sahne bunu okuyup efektleri kısar */
export const kaliteDurumu = { seviye: "yuksek" as Kalite };

export function kaliteYukle(): Kalite {
  if (typeof window === "undefined") return "yuksek";
  const k = window.localStorage.getItem(ANAHTAR) as Kalite | null;
  const s = k ?? (window.matchMedia?.("(pointer: coarse)").matches ? "orta" : "yuksek");
  kaliteDurumu.seviye = s;
  return s;
}

/**
 * KALİTE AYARI
 * Düşük: son işlem efektleri kapalı, gölge yok, piksel oranı 1
 * Orta: bloom + gölge, AO kapalı
 * Yüksek: hepsi açık
 */
export function KaliteAyari() {
  const [seviye, setSeviye] = useState<Kalite>("yuksek");
  const [acik, setAcik] = useState(false);

  useEffect(() => { setSeviye(kaliteYukle()); }, []);

  const degistir = (s: Kalite) => {
    setSeviye(s);
    kaliteDurumu.seviye = s;
    window.localStorage.setItem(ANAHTAR, s);
    window.location.reload();
  };

  return (
    <div className="kalite-ayari">
      <button
        className="mini-dugme"
        onClick={() => setAcik((a) => !a)}
        title="Görüntü kalitesi"
        aria-label="Görüntü kalitesi"
      >⚙</button>
      {acik && (
        <div className="kalite-menu">
          <div className="kalite-baslik">Görüntü kalitesi</div>
          {([["dusuk", "Düşük · akıcı"], ["orta", "Orta"], ["yuksek", "Yüksek · güzel"]] as const).map(
            ([k, ad]) => (
              <button
                key={k}
                className={`kalite-secenek ${seviye === k ? "aktif" : ""}`}
                onClick={() => degistir(k)}
              >
                {ad}
              </button>
            )
          )}
          <div className="kalite-not">Değişiklik sayfayı yeniler.</div>
        </div>
      )}
    </div>
  );
}
