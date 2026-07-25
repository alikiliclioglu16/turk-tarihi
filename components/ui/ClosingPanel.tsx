"use client";

import { useState } from "react";
import { useOyun } from "@/lib/store";
import { Daktilo } from "./Daktilo";
import { DedeYuz } from "./DedeYuz";
import { anlatiCal, anlatiDurdur } from "@/lib/audio";
import { useEffect } from "react";

export function ClosingPanel() {
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const kapanisBitti = useOyun((s) => s.kapanisBitti);
  const [hazir, setHazir] = useState(false);

  const nod = nodlar[aktifIndex];
  const kapanisSes = nod?.closing.audio;
  useEffect(() => {
    if (kapanisSes) anlatiCal(kapanisSes);
    return () => anlatiDurdur();
  }, [kapanisSes]);

  if (!nod) return null;
  const son = aktifIndex + 1 >= nodlar.length;

  return (
    <div className="alt-panel">
      <div className="panel">
        <div className="anlatan">
          <DedeYuz />
          <div className="anlatan-ad">Dede Korkut</div>
        </div>
        <Daktilo metin={nod.closing.text} onBitti={() => setHazir(true)} />
        <div className={`dugme-alan ${hazir ? "gorunur" : ""}`}>
          <button className="ana-dugme" onClick={kapanisBitti}>
            {son ? "Bölümü Bitir 🔥" : "Sonraki Durağa →"}
          </button>
        </div>
      </div>
    </div>
  );
}
