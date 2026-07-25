"use client";

import { useEffect, useState } from "react";
import { useOyun } from "@/lib/store";
import { sesBaslat, sessizAyarla, sessizMi, tik } from "@/lib/audio";

export function Hud() {
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
          <div className="kart-sayaci">🃏 {kartlar.length}</div>
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
