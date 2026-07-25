"use client";

import { useMemo, useState } from "react";
import { useOyun } from "@/lib/store";
import { DURAK_KARTLARI, durakKarti } from "@/lib/kartlar";

/**
 * KART KOLEKSİYONU
 *
 * Kazanılan durak kartları ve keşif kartları tek yerde. C tuşuyla veya
 * üst şeritteki 🃏 düğmesiyle açılır. Durak kartları çevrilebilir.
 */
export function KartKoleksiyonu({ onKapat }: { onKapat: () => void }) {
  const kartlar = useOyun((s) => s.kazanilanKartlar);
  const kesifler = useOyun((s) => s.kesifKoleksiyonu);
  const [sekme, setSekme] = useState<"durak" | "kesif">("durak");
  const [acik, setAcik] = useState<string | null>(null);

  const kazanilanIdler = useMemo(() => new Set(kartlar.map((k) => k.cardId)), [kartlar]);

  return (
    <div className="ortu koleksiyon-ortu" onClick={onKapat}>
      <div className="koleksiyon" onClick={(e) => e.stopPropagation()}>
        <div className="koleksiyon-ust">
          <div className="koleksiyon-sekmeler">
            <button
              className={`koleksiyon-sekme ${sekme === "durak" ? "aktif" : ""}`}
              aria-pressed={sekme === "durak"}
              onClick={() => setSekme("durak")}
            >
              🃏 Tarih Sandığı ({kartlar.length}/{DURAK_KARTLARI.length})
            </button>
            <button
              className={`koleksiyon-sekme ${sekme === "kesif" ? "aktif" : ""}`}
              aria-pressed={sekme === "kesif"}
              onClick={() => setSekme("kesif")}
            >
              📜 Keşifler ({kesifler.length})
            </button>
          </div>
          <button className="kapat" onClick={onKapat} aria-label="Kapat">✕</button>
        </div>

        {sekme === "durak" ? (
          <div className="koleksiyon-izgara">
            {DURAK_KARTLARI.map((k) => {
              const kazanildi = kazanilanIdler.has(k.cardId);
              const cevrik = acik === k.cardId;
              return (
                <button
                  key={k.cardId}
                  className={`koleksiyon-kart ${kazanildi ? "" : "kilitli"} ${cevrik ? "arka" : ""}`}
                  onClick={() => kazanildi && setAcik(cevrik ? null : k.cardId)}
                  aria-label={kazanildi ? `${k.title} kartı` : "Henüz kazanılmadı"}
                >
                  {kazanildi ? (
                    <>
                      <span className="kart-yuz kart-on">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={k.frontImage} alt={k.title} />
                      </span>
                      <span className="kart-yuz kart-arka">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={k.backImage} alt={`${k.title} açıklaması`} />
                      </span>
                    </>
                  ) : (
                    <span className="koleksiyon-kilit">🔒</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="koleksiyon-liste">
            {kesifler.length === 0 && (
              <p className="koleksiyon-bos">
                Henüz keşif yok. Haritada parlayan noktalara yürü.
              </p>
            )}
            {kesifler.map((k) => (
              <div key={k.id} className="koleksiyon-satir">
                <span className="koleksiyon-ikon">{k.ikon}</span>
                <div>
                  <div className="koleksiyon-baslik">{k.baslik}</div>
                  <div className="koleksiyon-alt">{k.altBaslik}</div>
                  <p className="koleksiyon-metin">{k.metin}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="koleksiyon-alt-bilgi">
          {sekme === "durak"
            ? "Kazanılan kartlara dokunarak arka yüzünü görebilirsin."
            : "Keşfettiğin her şey burada birikir."}
        </div>
      </div>
    </div>
  );
}

/** Durak kartı ön yüz yolu — koleksiyon dışında da kullanılabilir */
export function durakKartiOn(cardId: string): string | null {
  return durakKarti(cardId)?.frontImage ?? null;
}
