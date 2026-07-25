"use client";

import { useState } from "react";
import type { Hotspot, TourNode } from "@/lib/types";
import { hotspotKonum } from "@/lib/koordinat";
import { hotspotAnahtar, varlikYolu, varlikCoz } from "@/lib/manifest";
import { NesneYerTutucu } from "./Placeholder";

interface Props {
  nod: TourNode;
  hotspot: Hotspot;
  gezildi: boolean;
  zorunlu: boolean;
  onSec: (id: string) => void;
}

/**
 * Sahne üzerindeki etkileşim nesnesi.
 * Klavyeyle erişilebilir, durum yalnızca renkle değil ikon ve metinle de
 * bildirilir (erişilebilirlik gereği).
 */
export function Hotspot2D({ nod, hotspot, gezildi, zorunlu, onSec }: Props) {
  const [uzerinde, setUzerinde] = useState(false);
  const konum = hotspotKonum(nod, hotspot);
  const anahtar = hotspotAnahtar(nod.nodeId, hotspot.id);
  const yol = varlikYolu(anahtar);
  const kayit = varlikCoz(anahtar);

  return (
    <button
      type="button"
      className={`hotspot ${gezildi ? "gezildi" : ""} ${uzerinde ? "uzerinde" : ""}`}
      style={{ left: `${konum.x}%`, top: `${konum.y}%` }}
      onClick={() => onSec(hotspot.id)}
      onMouseEnter={() => setUzerinde(true)}
      onMouseLeave={() => setUzerinde(false)}
      onFocus={() => setUzerinde(true)}
      onBlur={() => setUzerinde(false)}
      aria-label={`${hotspot.label}: ${kayit?.alt ?? hotspot.id}${gezildi ? " (keşfedildi)" : ""}${zorunlu ? " (zorunlu)" : ""}`}
      aria-pressed={gezildi}
    >
      <span className="hotspot-nesne">
        {yol ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={yol} alt="" className="hotspot-img" loading="lazy" decoding="async" />
        ) : (
          <NesneYerTutucu tur={kayit?.tur} />
        )}
      </span>

      <span className="hotspot-halka" aria-hidden="true" />
      <span className="hotspot-nokta" aria-hidden="true">
        {gezildi ? "✓" : ""}
      </span>

      <span className="hotspot-etiket">
        {gezildi ? "✓ " : ""}
        {hotspot.label}
      </span>
    </button>
  );
}
