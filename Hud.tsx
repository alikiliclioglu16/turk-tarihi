"use client";

import { useEffect } from "react";
import { useOyun } from "@/lib/store";
import { Daktilo } from "./Daktilo";
import { DedeYuz } from "./DedeYuz";
import { anlatiCal, anlatiDurdur } from "@/lib/audio";

/**
 * Keşif fazı arayüzü.
 * Panel yalnızca bir hotspota dokunulduğunda açılır; kapatılınca sahne
 * tamamen görünür kalır. Boşken ekranı kaplayan kutu yoktur.
 */
export function HotspotPanel() {
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const aktifId = useOyun((s) => s.aktifHotspotId);
  const gezilen = useOyun((s) => s.gezilenHotspotlar);
  const kapat = useOyun((s) => s.hotspotKapat);
  const goreveGec = useOyun((s) => s.goreveGec);

  const nod = nodlar[aktifIndex];
  const aktif = aktifId ? nod?.hotspots.find((h) => h.id === aktifId) : null;
  const aktifSes = aktif?.audio;

  useEffect(() => {
    if (aktif) anlatiCal(aktif.audio, aktif.text);
    return () => anlatiDurdur();
  }, [aktif]);

  if (!nod) return null;

  const zorunlu = nod.completion.requiredHotspots;
  const bulunan = zorunlu.filter((id) => gezilen.includes(id)).length;
  const hepsiGezildi = bulunan >= zorunlu.length;

  /* --- Panel kapalıyken: ince şerit + ilerleme noktaları --- */
  if (!aktif) {
    return (
      <>
        <div className="kesif-serit">
          👆 Parlayan noktalara dokun
          <span className="kesif-noktalar">
            {zorunlu.map((id) => (
              <span key={id} className={`kesif-nokta ${gezilen.includes(id) ? "bulundu" : ""}`} />
            ))}
          </span>
          <span className="kesif-sayi">{bulunan}/{zorunlu.length}</span>
        </div>

        {hepsiGezildi && (
          <div className="yuzen-dugme-alan">
            <button className="ana-dugme buyuk" onClick={goreveGec}>
              Göreve Geç 🎯
            </button>
          </div>
        )}
      </>
    );
  }

  /* --- Bir noktaya dokunulduğunda: metin paneli --- */
  return (
    <div className="alt-panel">
      <div className="panel">
        <div className="anlatan">
          <DedeYuz boyut={36} />
          <div style={{ flex: 1 }}>
            <div className="anlatan-ad">{aktif.label}</div>
            <div className="anlatan-yer">
              {bulunan}/{zorunlu.length} nokta keşfedildi
            </div>
          </div>
          <button
            className="mini-dugme"
            title="Tekrar dinle"
            aria-label="Tekrar dinle"
            onClick={() => anlatiCal(aktif.audio, aktif.text)}
          >
            🔁
          </button>
        </div>

        <Daktilo key={aktif.id} metin={aktif.text} hiz={14} />

        <div className="panel-alt">
          <button className="ikinci-dugme" onClick={kapat}>
            Kapat · Keşfe Dön
          </button>
          {hepsiGezildi && (
            <button className="ana-dugme kucuk" onClick={goreveGec}>
              Göreve Geç 🎯
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
