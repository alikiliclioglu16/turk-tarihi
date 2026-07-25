"use client";

import { useEffect, useState } from "react";
import { useOyun } from "@/lib/store";
import { Daktilo } from "./Daktilo";
import { DedeYuz } from "./DedeYuz";
import { anlatiCal, anlatiDurdur } from "@/lib/audio";

export function NarrationPanel() {
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const anlatiIndex = useOyun((s) => s.anlatiIndex);
  const sonraki = useOyun((s) => s.sonrakiAnlati);
  const [hazir, setHazir] = useState(false);

  const nod = nodlar[aktifIndex];
  const blok = nod?.narration[anlatiIndex];

  useEffect(() => {
    if (blok) anlatiCal(blok.audio, blok.text);
    return () => anlatiDurdur();
  }, [blok?.audio]);

  if (!nod || !blok) return null;
  const sonMu = anlatiIndex + 1 >= nod.narration.length;

  return (
    <div className="alt-panel">
      <div className="panel">
        <div className="anlatan">
          <DedeYuz />
          <div style={{ flex: 1 }}>
            <div className="anlatan-ad">Dede Korkut</div>
            <div className="anlatan-yer">{nod.title}</div>
          </div>
          <button
            className="mini-dugme"
            title="Tekrar dinle"
            aria-label="Tekrar dinle"
            onClick={() => anlatiCal(blok.audio, blok.text)}
          >
            🔁
          </button>
        </div>

        <Daktilo key={blok.id} metin={blok.text} onBitti={() => setHazir(true)} />

        <div className={`dugme-alan ${hazir ? "gorunur" : ""}`}>
          <button
            className="ana-dugme"
            onClick={() => {
              anlatiDurdur();
              setHazir(false);
              sonraki();
            }}
          >
            {sonMu ? "Etrafı Keşfet ✨" : "Devam →"}
          </button>
        </div>
      </div>
    </div>
  );
}
