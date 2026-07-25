"use client";

import { useEffect, useRef, useState } from "react";
import { useOyun } from "@/lib/store";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { BOLGELER, BOLGE_SIRASI } from "@/lib/bolgeler";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";
import { DUNYA_YARICAP } from "@/lib/terrain";
import { bonusKesifler } from "@/lib/bonusKesifler";

/**
 * MİNİ HARİTA
 *
 * Tüm dünyayı gösterir; sınırı dünyanın sınırıdır. Gezginin konumu ve
 * baktığı yön anlık olarak işlenir. M tuşuyla büyütülüp küçültülebilir.
 */

const KUCUK = 186;
const BUYUK = 420;

export function MiniHarita() {
  const kanvas = useRef<HTMLCanvasElement>(null);
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const bulunan = useOyun((s) => s.bulunanBonuslar);
  const faz = useOyun((s) => s.faz);
  const [buyuk, setBuyuk] = useState(false);
  const boyut = buyuk ? BUYUK : KUCUK;

  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") setBuyuk((b) => !b);
    };
    window.addEventListener("keydown", tus);
    return () => window.removeEventListener("keydown", tus);
  }, []);

  useEffect(() => {
    const c = kanvas.current;
    if (!c) return;
    const g = c.getContext("2d");
    if (!g) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = boyut * dpr;
    c.height = boyut * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    // harita, dünya sınırının biraz ötesini kapsar
    const KAPSAM = DUNYA_YARICAP * 1.08;
    const M = boyut / 2;
    const olcek = (M - 6) / KAPSAM;
    const hx = (x: number) => M + x * olcek;
    const hz = (z: number) => M + z * olcek;

    let raf = 0;
    const ciz = () => {
      raf = requestAnimationFrame(ciz);
      g.clearRect(0, 0, boyut, boyut);

      g.save();
      g.beginPath();
      g.arc(M, M, M - 2, 0, Math.PI * 2);
      g.clip();

      // dış alan (gidilemez)
      g.fillStyle = "#1E241C";
      g.fillRect(0, 0, boyut, boyut);
      // gidilebilir alan
      g.fillStyle = "#3A4432";
      g.beginPath();
      g.arc(M, M, DUNYA_YARICAP * olcek, 0, Math.PI * 2);
      g.fill();

      // bölgeler
      for (const id of BOLGE_SIRASI) {
        const b = BOLGELER[id];
        const bx = hx(b.merkez[0] * DUNYA_OLCEK);
        const bz = hz(b.merkez[1] * DUNYA_OLCEK);
        const r = b.yaricap * DUNYA_OLCEK * olcek;
        const renk =
          id === "oba" ? "216,170,92" :
          id === "balbal_sirti" ? "158,166,180" :
          id === "su_basi" ? "96,158,178" : "162,150,128";
        const grad = g.createRadialGradient(bx, bz, 0, bx, bz, r);
        grad.addColorStop(0, `rgba(${renk},0.55)`);
        grad.addColorStop(1, `rgba(${renk},0)`);
        g.fillStyle = grad;
        g.beginPath();
        g.arc(bx, bz, r, 0, Math.PI * 2);
        g.fill();

        if (buyuk) {
          g.fillStyle = "rgba(247,235,211,0.85)";
          g.font = "bold 11px system-ui";
          g.textAlign = "center";
          g.fillText(b.ad, bx, bz - r * 0.45);
        }
      }

      // dere
      g.strokeStyle = "rgba(120,190,215,0.7)";
      g.lineWidth = buyuk ? 5 : 3;
      g.beginPath();
      ([[86, -8], [80, 6], [70, 18], [60, 28], [52, 34], [44, 40]] as [number, number][])
        .forEach(([dx, dz], i) => {
          const px = hx(dx * DUNYA_OLCEK), pz = hz(dz * DUNYA_OLCEK);
          i === 0 ? g.moveTo(px, pz) : g.lineTo(px, pz);
        });
      g.stroke();

      // rota
      if (nodlar.length) {
        g.strokeStyle = "rgba(255,207,114,0.4)";
        g.lineWidth = 1.6;
        g.setLineDash([5, 5]);
        g.beginPath();
        nodlar.forEach((n, i) => {
          const px = hx(n.world.guidePosition[0]);
          const pz = hz(n.world.guidePosition[2]);
          i === 0 ? g.moveTo(px, pz) : g.lineTo(px, pz);
        });
        g.stroke();
        g.setLineDash([]);
      }

      // keşifler
      bonusKesifler.forEach((b) => {
        const px = hx(b.pos[0] * DUNYA_OLCEK);
        const pz = hz(b.pos[2] * DUNYA_OLCEK);
        g.fillStyle = bulunan.includes(b.id) ? "rgba(120,215,205,0.95)" : "rgba(240,212,138,0.5)";
        g.beginPath();
        g.arc(px, pz, buyuk ? 3 : 1.9, 0, Math.PI * 2);
        g.fill();
      });

      // duraklar
      nodlar.forEach((n, i) => {
        const px = hx(n.world.guidePosition[0]);
        const pz = hz(n.world.guidePosition[2]);
        const gecti = i < aktifIndex;
        const aktif = i === aktifIndex;
        g.beginPath();
        g.arc(px, pz, aktif ? (buyuk ? 7 : 4.6) : (buyuk ? 5 : 3), 0, Math.PI * 2);
        g.fillStyle = gecti ? "#4BB3A9" : aktif ? "#FFCF72" : "rgba(247,235,211,0.4)";
        g.fill();
        if (aktif) {
          g.strokeStyle = "rgba(255,207,114,0.85)";
          g.lineWidth = 2;
          g.beginPath();
          g.arc(px, pz, (buyuk ? 13 : 9) + Math.sin(Date.now() / 320) * 2.5, 0, Math.PI * 2);
          g.stroke();
        }
        if (buyuk) {
          g.fillStyle = "rgba(247,235,211,0.75)";
          g.font = "bold 10px system-ui";
          g.textAlign = "center";
          g.fillText(String(i + 1), px, pz - 9);
        }
      });

      // sınır çemberi
      g.strokeStyle = "rgba(255,120,90,0.5)";
      g.lineWidth = 2;
      g.setLineDash([6, 5]);
      g.beginPath();
      g.arc(M, M, DUNYA_YARICAP * olcek, 0, Math.PI * 2);
      g.stroke();
      g.setLineDash([]);

      // ---- GEZGİN: konum + baktığı yön ----
      const px = hx(oyuncuKonumu.x);
      const pz = hz(oyuncuKonumu.z);
      const aci = oyuncuKonumu.aci;
      g.save();
      g.translate(px, pz);
      g.rotate(-aci + Math.PI);
      // görüş konisi
      const kon = g.createRadialGradient(0, 0, 0, 0, 0, buyuk ? 46 : 26);
      kon.addColorStop(0, "rgba(255,255,255,0.34)");
      kon.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = kon;
      g.beginPath();
      g.moveTo(0, 0);
      g.arc(0, 0, buyuk ? 46 : 26, -Math.PI / 2 - 0.5, -Math.PI / 2 + 0.5);
      g.closePath();
      g.fill();
      // ok ucu
      g.fillStyle = "#FFFFFF";
      g.strokeStyle = "rgba(20,30,45,0.85)";
      g.lineWidth = 1.4;
      g.beginPath();
      const r0 = buyuk ? 9 : 6.5;
      g.moveTo(0, -r0);
      g.lineTo(r0 * 0.72, r0 * 0.72);
      g.lineTo(0, r0 * 0.34);
      g.lineTo(-r0 * 0.72, r0 * 0.72);
      g.closePath();
      g.fill();
      g.stroke();
      g.restore();

      g.restore();

      // çerçeve
      g.strokeStyle = "rgba(255,207,114,0.6)";
      g.lineWidth = 2.5;
      g.beginPath();
      g.arc(M, M, M - 1.5, 0, Math.PI * 2);
      g.stroke();

      // yön harfleri
      g.fillStyle = "rgba(247,235,211,0.7)";
      g.font = "bold 10px system-ui";
      g.textAlign = "center";
      g.fillText("K", M, 12);
      g.fillText("G", M, boyut - 4);
      g.fillText("B", 8, M + 3);
      g.fillText("D", boyut - 8, M + 3);
    };
    ciz();
    return () => cancelAnimationFrame(raf);
  }, [nodlar, aktifIndex, bulunan, boyut, buyuk]);

  if (faz === "yukleniyor" || faz === "acilis") return null;

  const bolgeAd = nodlar[aktifIndex]
    ? BOLGELER[(nodlar[aktifIndex].zoneId as keyof typeof BOLGELER)]?.ad ?? "Oba"
    : "Oba";

  return (
    <div className={`mini-harita ${buyuk ? "buyuk" : ""}`}>
      <canvas ref={kanvas} style={{ width: boyut, height: boyut }} />
      <div className="mini-harita-etiket">{bolgeAd}</div>
      <button
        type="button"
        className="mini-harita-dugme"
        onClick={() => setBuyuk((b) => !b)}
        aria-label={buyuk ? "Haritayı küçült" : "Haritayı büyüt"}
        title="M tuşu"
      >
        {buyuk ? "⤡" : "⤢"}
      </button>
    </div>
  );
}
