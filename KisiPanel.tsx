"use client";

import { useEffect, useRef, useState } from "react";
import { useOyun } from "@/lib/store";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { bonusKesifler } from "@/lib/bonusKesifler";
import { OGRENME_NOKTALARI } from "@/lib/ogrenmeNoktalari";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";

const TUM = [...bonusKesifler, ...OGRENME_NOKTALARI];

interface Hedef { ad: string; aci: number; mesafe: number; tur: "durak" | "kesif" }

/**
 * PUSULA
 *
 * Ekranın üstünde ince bir şerit. Yakındaki durak ve öğrenilmemiş keşif
 * noktaları, gezginin baktığı yöne göre üzerinde kayar. Uzaklık metre
 * cinsinden yazılır — nereye gideceğinizi bilmek için haritayı açmaya
 * gerek kalmaz.
 */
export function Pusula() {
  const nodlar = useOyun((s) => s.nodlar);
  const tamamlanan = useOyun((s) => s.tamamlananNodIndexleri);
  const bulunan = useOyun((s) => s.bulunanBonuslar);
  const faz = useOyun((s) => s.faz);
  const [hedefler, setHedefler] = useState<Hedef[]>([]);
  const [yon, setYon] = useState(0);
  const son = useRef(0);

  useEffect(() => {
    let raf = 0;
    const dongu = () => {
      raf = requestAnimationFrame(dongu);
      const simdi = performance.now();
      setYon(oyuncuKonumu.aci);
      if (simdi - son.current < 320) return;
      son.current = simdi;

      const liste: Hedef[] = [];
      nodlar.forEach((n, i) => {
        if (tamamlanan.includes(i)) return;
        const [x, , z] = n.world.guidePosition;
        const dx = x - oyuncuKonumu.x;
        const dz = z - oyuncuKonumu.z;
        const d = Math.hypot(dx, dz);
        if (d > 260) return;
        liste.push({ ad: n.title, aci: Math.atan2(dx, dz), mesafe: d, tur: "durak" });
      });
      TUM.forEach((b) => {
        if (bulunan.includes(b.id)) return;
        const dx = b.pos[0] * DUNYA_OLCEK - oyuncuKonumu.x;
        const dz = b.pos[2] * DUNYA_OLCEK - oyuncuKonumu.z;
        const d = Math.hypot(dx, dz);
        if (d > 75) return;
        liste.push({ ad: b.ad, aci: Math.atan2(dx, dz), mesafe: d, tur: "kesif" });
      });
      liste.sort((a, b) => a.mesafe - b.mesafe);
      // üst üste binmeyi önle: ekranda birbirine çok yakın olanları ele
      const secilen: Hedef[] = [];
      for (const h of liste) {
        const cakisma = secilen.some((x) => {
          let f = x.aci - h.aci;
          while (f > Math.PI) f -= Math.PI * 2;
          while (f < -Math.PI) f += Math.PI * 2;
          return Math.abs(f) < 0.16;
        });
        if (!cakisma) secilen.push(h);
        if (secilen.length >= 4) break;
      }
      setHedefler(secilen);
    };
    dongu();
    return () => cancelAnimationFrame(raf);
  }, [nodlar, tamamlanan, bulunan]);

  if (faz === "yukleniyor" || faz === "acilis" || faz === "sinav") return null;

  const yonler: [string, number][] = [
    ["K", 0], ["KD", Math.PI / 4], ["D", Math.PI / 2], ["GD", (3 * Math.PI) / 4],
    ["G", Math.PI], ["GB", (5 * Math.PI) / 4], ["B", (3 * Math.PI) / 2], ["KB", (7 * Math.PI) / 4],
  ];

  const konum = (aci: number) => {
    let fark = aci - (yon + Math.PI);
    while (fark > Math.PI) fark -= Math.PI * 2;
    while (fark < -Math.PI) fark += Math.PI * 2;
    if (Math.abs(fark) > 1.05) return null; // görüş açısı dışında
    return 50 + (fark / 1.05) * 48;
  };

  return (
    <div className="pusula" aria-hidden="true">
      <div className="pusula-serit">
        {yonler.map(([ad, a]) => {
          const k = konum(a);
          if (k === null) return null;
          return (
            <span key={ad} className="pusula-yon" style={{ left: `${k}%` }}>{ad}</span>
          );
        })}
        {hedefler.map((h, i) => {
          const k = konum(h.aci);
          if (k === null) return null;
          return (
            <span
              key={`${h.ad}-${i}`}
              className={`pusula-hedef ${h.tur}`}
              style={{ left: `${k}%` }}
            >
              <span className="pusula-simge">{h.tur === "durak" ? "🏛" : "✨"}</span>
              <span className="pusula-mesafe">{Math.round(h.mesafe)} m</span>
            </span>
          );
        })}
      </div>
      <div className="pusula-orta" />
    </div>
  );
}
