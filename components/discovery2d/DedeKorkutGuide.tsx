"use client";

import { useEffect, useRef, useState } from "react";
import { varlikCoz, varlikYolu } from "@/lib/manifest";
import { POZ_ACIKLAMA, type PozId } from "@/lib/pozSecici";
import { RehberYerTutucu } from "./Placeholder";
import { anlatiCal, anlatiDurdur } from "@/lib/audio";

interface Props {
  poseId: PozId;
  side: "sol" | "sag";
  visible?: boolean;
  ariaLabel?: string;
  className?: string;
  metin: string;
  altBaslik?: string;
  ses?: string;
  altyaziAcik: boolean;
  dugmeMetni: string;
  onDevam: () => void;
}

/**
 * DEDE KORKUT REHBER KATMANI
 *
 * Poz görselini manifestten çözer, pozlar arasında 220 ms opacity
 * crossfade uygular, en-boy oranını korur (object-fit: contain),
 * anlatı panelini ve altyazıyı yönetir.
 *
 * Bileşen poz SEÇMEZ — hangi pozun geleceğine `lib/pozSecici.ts` karar verir.
 */
export function DedeKorkutGuide({
  poseId, side, visible = true, ariaLabel, className = "",
  metin, altBaslik, ses, altyaziAcik, dugmeMetni, onDevam,
}: Props) {
  /* --- poz crossfade --- */
  const [gorunen, setGorunen] = useState<PozId>(poseId);
  const [cikan, setCikan] = useState<PozId | null>(null);
  const oncekiRef = useRef<PozId>(poseId);

  useEffect(() => {
    if (poseId === oncekiRef.current) return;
    setCikan(oncekiRef.current);
    setGorunen(poseId);
    oncekiRef.current = poseId;
    const z = setTimeout(() => setCikan(null), 240);
    return () => clearTimeout(z);
  }, [poseId]);

  /* --- anlatı sesi --- */
  useEffect(() => {
    if (ses) anlatiCal(ses);
    return () => anlatiDurdur();
  }, [ses]);

  /* --- daktilo --- */
  const [yazilan, setYazilan] = useState("");
  const [bitti, setBitti] = useState(false);
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

  if (!visible) return null;

  const cizPoz = (id: PozId, sinif: string) => {
    const yol = varlikYolu(`dk.${id}`);
    const kayit = varlikCoz(`dk.${id}`);
    if (!yol) return <RehberYerTutucu key={id} isaret={null} />;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={id}
        src={yol}
        alt={kayit?.alt ?? POZ_ACIKLAMA[id]}
        className={`rehber-img ${sinif}`}
        width={1024}
        height={1536}
        decoding="async"
      />
    );
  };

  return (
    <div className={`rehber-katman ${side} ${className}`} aria-label={ariaLabel}>
      <div className="rehber-figur">
        {cikan && cizPoz(cikan, "poz-cikan")}
        {cizPoz(gorunen, "poz-giren")}
      </div>

      <div className="anlati-panel" onClick={() => !bitti && (setYazilan(metin), setBitti(true))}>
        <div className="anlati-ust">
          <div>
            <div className="anlati-ad">Dede Korkut</div>
            {altBaslik && <div className="anlati-yer">{altBaslik}</div>}
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
