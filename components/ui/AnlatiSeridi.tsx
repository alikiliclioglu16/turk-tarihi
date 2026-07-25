"use client";

import { useEffect, useState } from "react";
import { useOyun } from "@/lib/store";
import { anlatiCal, anlatiDurdur, anlatiSuresi } from "@/lib/audio";
import { DedeYuz } from "./DedeYuz";

/**
 * ANLATI ŞERİDİ
 *
 * Dede Korkut'un anlatısı artık ekranı kaplayan bir kart değil.
 * Altta ince bir altyazı şeridi — tıpkı Discovery Tour'daki gibi.
 * Oyuncu dinlerken yürümeye devam edebilir; sahne durmaz, hayat akar.
 */
export function AnlatiSeridi() {
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const anlatiIndex = useOyun((s) => s.anlatiIndex);
  const sonraki = useOyun((s) => s.sonrakiAnlati);
  const [gorunen, setGorunen] = useState("");
  const [bitti, setBitti] = useState(false);

  const nod = nodlar[aktifIndex];
  const blok = nod?.narration[anlatiIndex];

  useEffect(() => {
    if (blok) anlatiCal(blok.audio, blok.text);
    return () => anlatiDurdur();
  }, [blok]);

  /**
   * Metin daktiloyla yazılır, konuşma bitince ŞERİT KENDİLİĞİNDEN KAPANIR.
   * "Devam" düğmesi kaldırıldı; öğrenci dinlemeye odaklanır, tıklamaz.
   */
  useEffect(() => {
    if (!blok) return;
    setGorunen(""); setBitti(false);
    const azalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const zamanlar: number[] = [];

    if (azalt) {
      setGorunen(blok.text);
      setBitti(true);
    } else {
      let i = 0;
      const z = window.setInterval(() => {
        i += 1;
        setGorunen(blok.text.slice(0, i));
        if (i >= blok.text.length) { setBitti(true); window.clearInterval(z); }
      }, 15);
      zamanlar.push(z);
    }

    // konuşma süresi kadar bekle, sonra bir sonrakine geç
    const sure = anlatiSuresi(blok.text) + 500;
    zamanlar.push(window.setTimeout(() => { anlatiDurdur(); sonraki(); }, sure));

    return () => zamanlar.forEach((z) => { window.clearTimeout(z); window.clearInterval(z); });
  }, [blok, sonraki]);

  if (!nod || !blok) return null;
  const son = anlatiIndex + 1 >= nod.narration.length;
  void bitti;

  return (
    <div className="anlati-seridi">
      <div className="anlati-seridi-portre">
        <DedeYuz boyut={74} />
      </div>
      <div className="anlati-seridi-govde" onClick={() => !bitti && (setGorunen(blok.text), setBitti(true))}>
        <div className="anlati-seridi-ust">
          <span className="anlati-seridi-ad">Dede Korkut</span>
          <span className="anlati-seridi-yer">{nod.title}</span>
          <button
            type="button" className="mini-dugme"
            onClick={(e) => { e.stopPropagation(); anlatiCal(blok.audio, blok.text); }}
            aria-label="Tekrar dinle" title="Tekrar dinle"
          >🔁</button>
        </div>
        <p className="anlati-seridi-metin" aria-live="polite">
          {gorunen}{!bitti && <span className="imlec">▌</span>}
        </p>
      </div>
      {/* Düğme yok — anlatı bitince kendiliğinden ilerler.
          Yalnız acele edenler için küçük bir geç işareti var. */}
      <button
        type="button"
        className="anlati-seridi-atla"
        onClick={() => { anlatiDurdur(); sonraki(); }}
        aria-label={son ? "Keşfe geç" : "Sonraki anlatı"}
        title="Geç"
      >⏭</button>
    </div>
  );
}
