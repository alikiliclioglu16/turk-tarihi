"use client";

import { useEffect, useState } from "react";

/**
 * FOTOĞRAF MODU
 *
 * P tuşu arayüzü gizler; öğrenci manzarayı temiz görür ve ekran görüntüsü
 * alabilir. Discovery Tour'daki foto modunun sade karşılığı.
 */
export function FotoModu({ aktif, setAktif }: { aktif: boolean; setAktif: (a: boolean) => void }) {
  const [ipucu, setIpucu] = useState(false);

  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        setAktif(!aktif);
        setIpucu(true);
        window.setTimeout(() => setIpucu(false), 2200);
      }
      if (e.key === "Escape" && aktif) setAktif(false);
    };
    window.addEventListener("keydown", tus);
    return () => window.removeEventListener("keydown", tus);
  }, [aktif, setAktif]);

  if (!aktif) return null;

  return (
    <>
      <div className="foto-cerceve" aria-hidden="true">
        <span className="foto-kose sol-ust" />
        <span className="foto-kose sag-ust" />
        <span className="foto-kose sol-alt" />
        <span className="foto-kose sag-alt" />
      </div>
      {ipucu && <div className="foto-ipucu">📷 Fotoğraf modu · P ile çık</div>}
      <button className="foto-cikis" onClick={() => setAktif(false)}>✕ Çık</button>
    </>
  );
}
