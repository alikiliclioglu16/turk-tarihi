"use client";

import { useEffect, useState } from "react";
import { useOyun } from "@/lib/store";
import { sesBaslat, sessizAyarla, sessizMi, tik } from "@/lib/audio";
import { bonusKesifler } from "@/lib/bonusKesifler";
import { OGRENME_NOKTALARI } from "@/lib/ogrenmeNoktalari";

const KESIF_TOPLAM = bonusKesifler.length + OGRENME_NOKTALARI.length;

/** Meraklı Gözler sayacı */
function BonusSayac() {
  const bulunan = useOyun((s) => s.bulunanBonuslar);
  return (
    <span className="bonus-sayac" title="Meraklı Gözler — obada bulunabilecek keşifler">
      ✨ {bulunan.length}/{KESIF_TOPLAM}
    </span>
  );
}

export function Hud({ onKoleksiyon }: { onKoleksiyon: () => void }) {
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const faz = useOyun((s) => s.faz);
  const kartlar = useOyun((s) => s.kazanilanKartlar);
  const [sessiz, setSessiz] = useState(false);
  const nod = nodlar[aktifIndex];

  // tarayıcı kuralı: ses ancak ilk dokunuştan sonra başlayabilir
  useEffect(() => {
    const basla = () => {
      sesBaslat();
      setSessiz(sessizMi());
      window.removeEventListener("pointerdown", basla);
      window.removeEventListener("keydown", basla);
    };
    window.addEventListener("pointerdown", basla);
    window.addEventListener("keydown", basla);
    return () => {
      window.removeEventListener("pointerdown", basla);
      window.removeEventListener("keydown", basla);
    };
  }, []);

  return (
    <>
      <div className="ust-serit">
        <div className="marka">🪕 D01 · Tarihin Kapısı</div>
        <div className="ust-sag">
          <div className="durak-noktalari">
            {nodlar.map((n, i) => (
              <span
                key={n.nodeId}
                className={`nokta ${i < aktifIndex ? "gecti" : i === aktifIndex ? "aktif" : ""}`}
                title={n.title}
              />
            ))}
          </div>
          <button
            type="button"
            className="kart-sayaci kart-dugme"
            onClick={onKoleksiyon}
            title="Kart koleksiyonu (C)"
            aria-label="Kart koleksiyonunu aç"
          >
            🃏 {kartlar.length}
          </button>
          <BonusSayac />
          <button
            className="mini-dugme"
            aria-label={sessiz ? "Sesi aç" : "Sesi kapat"}
            title={sessiz ? "Sesi aç" : "Sesi kapat"}
            onClick={() => {
              const yeni = !sessiz;
              setSessiz(yeni);
              sessizAyarla(yeni);
              if (!yeni) tik();
            }}
          >
            {sessiz ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {faz === "gezinti" && nod && (
        <div className="hedef-serit">🧭 Işık sütununa yürü: {nod.title}</div>
      )}
    </>
  );
}
