"use client";

import { useEffect, useRef, useState } from "react";

/** Metni harf harf yazan bileşen. Tıklayınca atlar. Hareket azaltma ayarına saygılıdır. */
export function Daktilo({ metin, hiz = 16, onBitti }: { metin: string; hiz?: number; onBitti?: () => void }) {
  const [cikti, setCikti] = useState("");
  const [bitti, setBitti] = useState(false);
  const atla = useRef(false);

  useEffect(() => {
    atla.current = false;
    setCikti("");
    setBitti(false);
    const azalt =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (azalt) {
      setCikti(metin);
      setBitti(true);
      onBitti?.();
      return;
    }
    let i = 0;
    const zaman = setInterval(() => {
      if (atla.current) {
        setCikti(metin);
        setBitti(true);
        onBitti?.();
        clearInterval(zaman);
        return;
      }
      i += 1;
      setCikti(metin.slice(0, i));
      if (i >= metin.length) {
        setBitti(true);
        onBitti?.();
        clearInterval(zaman);
      }
    }, hiz);
    return () => clearInterval(zaman);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metin, hiz]);

  return (
    <p className="anlati-metin" onClick={() => !bitti && (atla.current = true)}>
      {cikti}
      {!bitti && <span className="imlec">▌</span>}
    </p>
  );
}
