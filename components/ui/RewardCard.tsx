"use client";

import { useEffect } from "react";
import { useOyun } from "@/lib/store";
import { basariTinisi } from "@/lib/audio";

export function RewardCardPanel() {
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const odulAlindi = useOyun((s) => s.odulAlindi);
  const geriBildirim = useOyun((s) => s.sonGeriBildirim);

  useEffect(() => {
    basariTinisi();
  }, []);

  const nod = nodlar[aktifIndex];
  if (!nod) return null;
  const kart = nod.reward;

  return (
    <div className="ortu">
      {geriBildirim && <div className="basari-metin">{geriBildirim}</div>}
      <div className="kart">
        <div className="kart-ikon">{kart.icon}</div>
        <div className="kart-ad">{kart.title}</div>
        <div className="kart-kavram">{kart.concept}</div>
        <div className="kart-metin">{kart.shortText}</div>
      </div>
      <button className="ana-dugme buyuk" onClick={odulAlindi}>
        Sandığa Ekle 🧰
      </button>
    </div>
  );
}
