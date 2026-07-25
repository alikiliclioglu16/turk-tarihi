"use client";

import { useState } from "react";
import { useOyun } from "@/lib/store";
import { tik } from "@/lib/audio";

/**
 * Görev paneli — tip JSON'dan gelir.
 *  • secim          → tek doğru şık
 *  • eslestir /
 *    coklu_secim    → birden çok doğru şık; hepsi bulununca tamamlanır
 *  • sirala, siniflandir, baglanti → Paket 5
 */
export function QuestPanel() {
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const cevapVer = useOyun((s) => s.cevapVer);
  const cokluCevapVer = useOyun((s) => s.cokluCevapVer);
  const dogruSecilenler = useOyun((s) => s.dogruSecilenler);
  const geriBildirim = useOyun((s) => s.sonGeriBildirim);
  const ipucu = useOyun((s) => s.ipucu);
  const [secilen, setSecilen] = useState<string | null>(null);
  const [hataId, setHataId] = useState<string | null>(null);

  const nod = nodlar[aktifIndex];
  if (!nod) return null;
  const gorev = nod.quest;
  const cokluMu =
    gorev.type === "eslestir" || gorev.type === "coklu_secim" || gorev.type === "siniflandir";
  const hedefSayi = gorev.options.filter((o) => o.correct).length;

  const desteklenen = gorev.type === "secim" || cokluMu;

  if (!desteklenen) {
    return (
      <div className="alt-panel">
        <div className="panel">
          <div className="gorev-etiket">🎯 Görev</div>
          <div className="gorev-soru">{gorev.prompt}</div>
          <div className="not-satiri">Bu görev tipi ({gorev.type}) Paket 5&apos;te eklenecek.</div>
          <button className="ana-dugme" onClick={() => cevapVer(gorev.options.find((o) => o.correct)!.id)}>
            Geç (geliştirici)
          </button>
        </div>
      </div>
    );
  }

  const tikla = (id: string, dogru: boolean) => {
    if (cokluMu) {
      cokluCevapVer(id);
      if (dogru) tik();
      if (!dogru) {
        setHataId(id);
        setTimeout(() => setHataId(null), 700);
      }
    } else {
      setSecilen(id);
      cevapVer(id);
      if (!dogru) setTimeout(() => setSecilen(null), 1400);
    }
  };

  const olumluMu = cokluMu
    ? true
    : !!(secilen && gorev.options.find((o) => o.id === secilen)?.correct);

  return (
    <div className="alt-panel">
      <div className="panel">
        <div className="gorev-etiket">🎯 Görev</div>
        <div className="gorev-soru">{gorev.prompt}</div>

        {cokluMu && (
          <div className="sayac">
            {dogruSecilenler.length} / {hedefSayi} doğru eşleştirme
          </div>
        )}

        <div className="secenekler">
          {gorev.options.map((o) => {
            const bulundu = cokluMu && dogruSecilenler.includes(o.id);
            const hata = hataId === o.id || (!cokluMu && secilen === o.id && !o.correct);
            const dogruIsaret = bulundu || (!cokluMu && secilen === o.id && o.correct);
            return (
              <button
                key={o.id}
                className={`secenek ${dogruIsaret ? "dogru" : ""} ${hata ? "yanlis" : ""}`}
                disabled={bulundu}
                onClick={() => tikla(o.id, o.correct)}
              >
                {bulundu && <span className="tik">✓ </span>}
                {o.text}
              </button>
            );
          })}
        </div>

        {geriBildirim && (
          <div className={`geri-bildirim ${olumluMu && !hataId ? "olumlu" : "olumsuz"}`}>{geriBildirim}</div>
        )}
        {ipucu && <div className="ipucu-kutu">💡 {ipucu}</div>}
      </div>
    </div>
  );
}
