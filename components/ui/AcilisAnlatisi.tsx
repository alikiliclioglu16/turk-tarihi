"use client";

import { useEffect, useRef, useState } from "react";
import { anlatiCal, anlatiDurdur, anlatiSuresi } from "@/lib/audio";
import { DedeYuz } from "./DedeYuz";

interface Replik { id: string; audio: string; text: string }

/**
 * AÇILIŞ ANLATISI
 *
 * Kuşbakışı uçuş sırasında Dede Korkut'un dış sesi. Üç replik sırayla
 * akar; her biri uçuşun bir bölümüne denk gelir. Metin altta sinematik
 * altyazı olarak belirir, ekranı kaplamaz.
 */
export function AcilisAnlatisi() {
  const [replikler, setReplikler] = useState<Replik[]>([]);
  const [index, setIndex] = useState(0);
  const [gorunur, setGorunur] = useState(false);
  const zamanlar = useRef<number[]>([]);

  useEffect(() => {
    let iptal = false;
    fetch("/data/d01/d01-acilis-anlatimi.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (iptal || !j?.acilis) return;
        setReplikler(j.acilis as Replik[]);
      })
      .catch(() => { /* yoksa sessiz geç */ });
    return () => { iptal = true; };
  }, []);

  /**
   * Replikler ZİNCİRLEME çalınır: bir replik bitmeden diğeri başlamaz.
   * Önceden sabit 7 saniyelik aralık vardı; uzun cümleler yarıda kesiliyordu.
   */
  useEffect(() => {
    if (!replikler.length) return;
    setGorunur(true);
    let iptal = false;

    const cal = (i: number) => {
      if (iptal || i >= replikler.length) return;
      setIndex(i);
      const r = replikler[i];
      anlatiCal(r.audio, r.text);
      // konuşma bitince bir sonrakine geç; kısa bir nefes payı bırak
      const sure = anlatiSuresi(r.text) + 700;
      zamanlar.current.push(window.setTimeout(() => cal(i + 1), sure));
    };

    // ilk replik kısa bir gecikmeyle başlasın (sahne otursun)
    zamanlar.current.push(window.setTimeout(() => cal(0), 600));

    return () => {
      iptal = true;
      zamanlar.current.forEach(clearTimeout);
      zamanlar.current = [];
      anlatiDurdur();
    };
  }, [replikler]);

  if (!gorunur || !replikler.length) return null;
  const r = replikler[index];

  return (
    <div className="acilis-anlati">
      <div className="acilis-anlati-portre">
        <DedeYuz boyut={92} />
      </div>
      <div className="acilis-anlati-metin" key={r.id}>
        <span className="acilis-anlati-ad">Dede Korkut</span>
        <p>{r.text}</p>
      </div>
    </div>
  );
}
