"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TourNode } from "@/lib/types";
import { bolgeKatmanlari } from "@/lib/manifest";
import { kameraPreset } from "@/lib/koordinat";
import { ParallaxLayer } from "./ParallaxLayer";
import { Hotspot2D } from "./Hotspot2D";
import { AtesParcaciklari } from "./Efektler";

interface Props {
  nod: TourNode | null;
  faz: string;
  gezilen: string[];
  onHotspotSec: (id: string) => void;
}

/**
 * 2.5D SAHNE MOTORU
 *
 * Katmanlı sahneyi kurar, parallax uygular, durak değiştikçe kamera
 * presetine yumuşak pan/zoom yapar ve hotspotları yerleştirir.
 * Sahne 16:9 oranını korur ve ekrana sığacak şekilde ölçeklenir.
 */
export function DiscoveryStage2D({ nod, faz, gezilen, onHotspotSec }: Props) {
  const kutu = useRef<HTMLDivElement>(null);
  const [sapma, setSapma] = useState({ x: 0, y: 0 });
  const [azalt, setAzalt] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const guncelle = () => setAzalt(mq.matches);
    guncelle();
    mq.addEventListener("change", guncelle);
    return () => mq.removeEventListener("change", guncelle);
  }, []);

  /* Fare ile hafif parallax — dokunmatikte kapalı */
  useEffect(() => {
    if (azalt) return;
    const kaba = window.matchMedia("(pointer: coarse)").matches;
    if (kaba) return;
    const el = kutu.current;
    if (!el) return;
    let raf = 0;
    const hedef = { x: 0, y: 0 };
    const hareket = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      hedef.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      hedef.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const dongu = () => {
      setSapma((s) => ({
        x: s.x + (hedef.x - s.x) * 0.08,
        y: s.y + (hedef.y - s.y) * 0.08,
      }));
      raf = requestAnimationFrame(dongu);
    };
    window.addEventListener("pointermove", hareket);
    raf = requestAnimationFrame(dongu);
    return () => {
      window.removeEventListener("pointermove", hareket);
      cancelAnimationFrame(raf);
    };
  }, [azalt]);

  const katmanlar = useMemo(() => bolgeKatmanlari(nod?.zoneId ?? "oba"), [nod?.zoneId]);

  /* Kamera: durak değişince odak noktasına yumuşak geçiş */
  const kamera = useMemo(() => {
    if (!nod) return { x: 50, y: 55, zoom: 1 };
    if (faz === "gezinti" || faz === "bolumBitti") return { x: 50, y: 55, zoom: 1 };
    return kameraPreset(nod);
  }, [nod, faz]);

  const kameraStil = azalt
    ? {}
    : {
        transform: `scale(${kamera.zoom}) translate(${(50 - kamera.x) * 0.6}%, ${(50 - kamera.y) * 0.5}%)`,
      };

  const zorunlu = nod?.completion.requiredHotspots ?? [];

  return (
    <div className="sahne-kutu" ref={kutu}>
      <div className="sahne-oran">
        <div className="sahne-kamera" style={kameraStil}>
          {katmanlar.map((k) => (
            <ParallaxLayer key={k.id} kayit={k} sapmaX={sapma.x} sapmaY={sapma.y} azalt={azalt} />
          ))}

          <AtesParcaciklari azalt={azalt} />

          {/* hotspotlar yalnız keşif fazında etkileşimli */}
          {nod && (faz === "kesif" || faz === "gorev") && (
            <div className={`hotspot-katmani ${faz === "gorev" ? "pasif" : ""}`}>
              {nod.hotspots.map((h) => (
                <Hotspot2D
                  key={h.id}
                  nod={nod}
                  hotspot={h}
                  gezildi={gezilen.includes(h.id)}
                  zorunlu={zorunlu.includes(h.id)}
                  onSec={onHotspotSec}
                />
              ))}
            </div>
          )}
        </div>

        {/* sinematografi: vinyet ve gren, sahnenin üstünde */}
        <div className="sahne-vinyet" aria-hidden="true" />
        <div className="sahne-gren" aria-hidden="true" />
      </div>
    </div>
  );
}
