"use client";

import { useEffect, useRef, useState } from "react";
import { anlatiCal, anlatiDurdur } from "@/lib/audio";
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

  useEffect(() => {
    if (!replikler.length) return;
    // 21 saniyelik uçuş: 0 sn, 7 sn, 14 sn
    const araliklar = [200, 7000, 14000];
    setGorunur(true);
    zamanlar.current = araliklar.map((ms, i) =>
      window.setTimeout(() => {
        setIndex(i);
        anlatiCal(replikler[i].audio, replikler[i].text);
      }, ms)
    );
    return () => {
      zamanlar.current.forEach(clearTimeout);
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
