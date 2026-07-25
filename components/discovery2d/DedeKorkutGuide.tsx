"use client";

import { useEffect, useState } from "react";
import { varlikYolu, varlikCoz } from "@/lib/manifest";
import { RehberYerTutucu } from "./Placeholder";
import { anlatiCal, anlatiDurdur } from "@/lib/audio";

export type RehberPoz = "DK01" | "DK02" | "DK03" | "DK04" | "DK05" | "DK06" | "DK07" | "DK08";

interface Props {
  poz: RehberPoz;
  taraf: "sol" | "sag";
  metin: string;
  baslik?: string;
  altBaslik?: string;
  ses?: string;
  altyaziAcik: boolean;
  dugmeMetni: string;
  onDevam: () => void;
}

/**
 * DEDE KORKUT REHBER KATMANI
 * Poz görseli + anlatı paneli + altyazı + tekrar dinle.
 * Pozlar arasında crossfade, hafif nefes hareketi.
 */
export function DedeKorkutGuide({
  poz, taraf, metin, baslik, altBaslik, ses, altyaziAcik, dugmeMetni, onDevam,
}: Props) {
  const [yazilan, setYazilan] = useState("");
  const [bitti, setBitti] = useState(false);
  const yol = varlikYolu(`dk.${poz}`);
  const kayit = varlikCoz(`dk.${poz}`);

  useEffect(() => {
    if (ses) anlatiCal(ses);
    return () => anlatiDurdur();
  }, [ses]);

  useEffect(() => {
    setYazilan("");
    setBitti(false);
    const azalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (azalt) {
      setYazilan(metin);
      setBitti(true);
      return;
    }
    let i = 0;
    const z = setInterval(() => {
      i += 1;
      setYazilan(metin.slice(0, i));
      if (i >= metin.length) {
        setBitti(true);
        clearInterval(z);
      }
    }, 16);
    return () => clearInterval(z);
  }, [metin]);

  const isaret = poz === "DK02" ? "sag" : poz === "DK03" ? "sol" : null;

  return (
    <div className={`rehber-katman ${taraf}`}>
      <div className="rehber-figur" key={poz}>
        {yol ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={yol} alt={kayit?.alt ?? "Dede Korkut"} className="rehber-img" />
        ) : (
          <RehberYerTutucu isaret={isaret} />
        )}
      </div>

      <div className="anlati-panel" onClick={() => !bitti && (setYazilan(metin), setBitti(true))}>
        <div className="anlati-ust">
          <div>
            <div className="anlati-ad">Dede Korkut</div>
            {(baslik || altBaslik) && <div className="anlati-yer">{altBaslik ?? baslik}</div>}
          </div>
          <button
            type="button"
            className="mini-dugme"
            onClick={(e) => { e.stopPropagation(); if (ses) anlatiCal(ses); }}
            aria-label="Tekrar dinle"
            title="Tekrar dinle"
          >
            🔁
          </button>
        </div>

        {altyaziAcik && (
          <p className="anlati-metin" aria-live="polite">
            {yazilan}
            {!bitti && <span className="imlec">▌</span>}
          </p>
        )}

        <button
          type="button"
          className={`ana-dugme ${bitti ? "" : "bekliyor"}`}
          onClick={onDevam}
          disabled={!bitti}
        >
          {dugmeMetni}
        </button>
      </div>
    </div>
  );
}
