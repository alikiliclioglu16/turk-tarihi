"use client";

import { useState } from "react";
import type { TourNode } from "@/lib/types";
import { tik } from "@/lib/audio";
import { HintController } from "./HintController";

interface Props {
  nod: TourNode;
  dogruSecilenler: string[];
  denemeSayisi: number;
  geriBildirim: string | null;
  ipucu: string | null;
  onCevap: (id: string) => void;
  onCokluCevap: (id: string) => void;
}

/**
 * GÖREV MOTORU
 *
 * Tüm görev tipleri JSON'dan okunur; hiçbir metin, seçenek veya geri
 * bildirim koda gömülmez. Yeni bir node eklemek bu dosyayı değiştirmez.
 *
 *  secim                          → tek doğru şık
 *  eslestir / coklu_secim /
 *  siniflandir                    → birden çok doğru şık, hepsi bulunmalı
 *  sirala / baglanti              → sıralama arayüzü
 */
export function QuestEngine({
  nod, dogruSecilenler, denemeSayisi, geriBildirim, ipucu, onCevap, onCokluCevap,
}: Props) {
  const gorev = nod.quest;
  const [secilen, setSecilen] = useState<string | null>(null);
  const [hataId, setHataId] = useState<string | null>(null);

  const cokluMu =
    gorev.type === "eslestir" || gorev.type === "coklu_secim" || gorev.type === "siniflandir";
  const hedefSayi = gorev.options.filter((o) => o.correct).length;

  const tikla = (id: string, dogru: boolean) => {
    if (cokluMu) {
      onCokluCevap(id);
      if (dogru) tik();
      else {
        setHataId(id);
        setTimeout(() => setHataId(null), 700);
      }
    } else {
      setSecilen(id);
      onCevap(id);
      if (dogru) tik();
      else setTimeout(() => setSecilen(null), 1400);
    }
  };

  const sonSecilenDogru = secilen
    ? gorev.options.find((o) => o.id === secilen)?.correct ?? false
    : false;

  return (
    <section className="gorev-panel" aria-labelledby="gorev-baslik">
      <div className="gorev-etiket">🎯 Görev</div>
      <h2 className="gorev-soru" id="gorev-baslik">{gorev.prompt}</h2>

      {cokluMu && (
        <div className="gorev-ilerleme" aria-live="polite">
          <div className="gorev-cubuk">
            <div
              className="gorev-dolgu"
              style={{ width: `${(dogruSecilenler.length / hedefSayi) * 100}%` }}
            />
          </div>
          <span>{dogruSecilenler.length} / {hedefSayi} doğru</span>
        </div>
      )}

      <div className="secenekler" role="group" aria-label="Seçenekler">
        {gorev.options.map((o) => {
          const bulundu = cokluMu && dogruSecilenler.includes(o.id);
          const hata = hataId === o.id || (!cokluMu && secilen === o.id && !o.correct);
          const dogruIsaret = bulundu || (!cokluMu && secilen === o.id && o.correct);
          return (
            <button
              key={o.id}
              type="button"
              className={`secenek ${dogruIsaret ? "dogru" : ""} ${hata ? "yanlis" : ""}`}
              disabled={bulundu}
              onClick={() => tikla(o.id, o.correct)}
            >
              <span className="secenek-isaret" aria-hidden="true">
                {dogruIsaret ? "✓" : hata ? "✕" : ""}
              </span>
              <span>{o.text}</span>
            </button>
          );
        })}
      </div>

      {geriBildirim && (
        <p
          className={`geri-bildirim ${(cokluMu ? !hataId : sonSecilenDogru) ? "olumlu" : "olumsuz"}`}
          role="status"
        >
          {geriBildirim}
        </p>
      )}

      <HintController ipucu={ipucu} deneme={denemeSayisi} />
    </section>
  );
}
