"use client";

import { useOyun } from "@/lib/store";
import { Daktilo } from "./Daktilo";
import { DedeYuz } from "./DedeYuz";
import { anlatiCal, anlatiDurdur } from "@/lib/audio";
import { useEffect } from "react";

export function HotspotPanel() {
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const aktifId = useOyun((s) => s.aktifHotspotId);
  const gezilen = useOyun((s) => s.gezilenHotspotlar);
  const kapat = useOyun((s) => s.hotspotKapat);
  const goreveGec = useOyun((s) => s.goreveGec);

  const nod = nodlar[aktifIndex];
  const aktifSes = aktifId ? nod?.hotspots.find((h) => h.id === aktifId)?.audio : undefined;

  useEffect(() => {
    if (aktifSes) anlatiCal(aktifSes);
    return () => anlatiDurdur();
  }, [aktifSes]);

  if (!nod) return null;

  const zorunlu = nod.completion.requiredHotspots;
  const kalan = zorunlu.filter((id) => !gezilen.includes(id)).length;
  const hepsiGezildi = kalan === 0;
  const aktif = aktifId ? nod.hotspots.find((h) => h.id === aktifId) : null;

  return (
    <div className="alt-panel">
      <div className="panel">
        {aktif ? (
          <>
            <div className="anlatan">
              <DedeYuz boyut={36} />
              <div className="anlatan-ad">{aktif.label}</div>
            </div>
            <Daktilo key={aktif.id} metin={aktif.text} hiz={14} />
            <div className="dugme-alan gorunur">
              <button className="ikinci-dugme" onClick={kapat}>
                Kapat
              </button>
            </div>
          </>
        ) : (
          <div className="ipucu-satiri">
            👆 Parlayan noktalara dokun · sürükleyerek etrafına bak
          </div>
        )}

        <div className="panel-alt">
          <span className="sayac">
            {zorunlu.length - kalan} / {zorunlu.length} nokta keşfedildi
          </span>
          <button className="ana-dugme kucuk" disabled={!hepsiGezildi} onClick={goreveGec}>
            {hepsiGezildi ? "Göreve Geç 🎯" : "Önce hepsini keşfet"}
          </button>
        </div>
      </div>
    </div>
  );
}
