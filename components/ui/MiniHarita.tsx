"use client";

import { useEffect, useRef } from "react";
import { useOyun } from "@/lib/store";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { BOLGELER, BOLGE_SIRASI } from "@/lib/bolgeler";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";
import { bonusKesifler } from "@/lib/bonusKesifler";

/**
 * MİNİ HARİTA
 *
 * Sağ altta, tüm dünyanın ölçeklenmiş görüntüsü. Oyun haritalarındaki
 * klasik yapı: dört bölge, duraklar, keşifler, gezginin konumu ve
 * baktığı yön. Haritanın sınırı dünyanın sınırıdır — nereye kadar
 * gidilebileceği tek bakışta görünür.
 */

const BOYUT = 178;          // piksel
const DUNYA_YARI = 330;     // metre — haritanın kapsadığı yarıçap

export function MiniHarita() {
  const kanvas = useRef<HTMLCanvasElement>(null);
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const bulunan = useOyun((s) => s.bulunanBonuslar);
  const faz = useOyun((s) => s.faz);

  useEffect(() => {
    const c = kanvas.current;
    if (!c) return;
    const g = c.getContext("2d");
    if (!g) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = BOYUT * dpr;
    c.height = BOYUT * dpr;
    g.scale(dpr, dpr);

    let raf = 0;
    const M = BOYUT / 2;
    const olcek = M / DUNYA_YARI;
    const hx = (x: number) => M + x * olcek;
    const hz = (z: number) => M + z * olcek;

    const ciz = () => {
      raf = requestAnimationFrame(ciz);
      g.clearRect(0, 0, BOYUT, BOYUT);

      // zemin
      g.save();
      g.beginPath();
      g.arc(M, M, M - 2, 0, Math.PI * 2);
      g.clip();
      g.fillStyle = "#2A3326";
      g.fillRect(0, 0, BOYUT, BOYUT);

      // bölgeler
      for (const id of BOLGE_SIRASI) {
        const b = BOLGELER[id];
        const bx = hx(b.merkez[0] * DUNYA_OLCEK);
        const bz = hz(b.merkez[1] * DUNYA_OLCEK);
        const r = b.yaricap * DUNYA_OLCEK * olcek;
        const grad = g.createRadialGradient(bx, bz, 0, bx, bz, r);
        const renk =
          id === "oba" ? "212,168,90" :
          id === "balbal_sirti" ? "150,158,172" :
          id === "su_basi" ? "96,150,168" : "150,140,120";
        grad.addColorStop(0, `rgba(${renk},0.42)`);
        grad.addColorStop(1, `rgba(${renk},0)`);
        g.fillStyle = grad;
        g.beginPath();
        g.arc(bx, bz, r, 0, Math.PI * 2);
        g.fill();
      }

      // dere
      g.strokeStyle = "rgba(110,180,205,0.6)";
      g.lineWidth = 3;
      g.beginPath();
      const dere: [number, number][] = [[86, -8], [80, 6], [70, 18], [60, 28], [52, 34], [44, 40]];
      dere.forEach(([dx, dz], i) => {
        const px = hx(dx * DUNYA_OLCEK), pz = hz(dz * DUNYA_OLCEK);
        i === 0 ? g.moveTo(px, pz) : g.lineTo(px, pz);
      });
      g.stroke();

      // rota çizgisi (duraklar arası)
      g.strokeStyle = "rgba(255,207,114,0.35)";
      g.lineWidth = 1.5;
      g.setLineDash([4, 4]);
      g.beginPath();
      nodlar.forEach((n, i) => {
        const px = hx(n.world.guidePosition[0]);
        const pz = hz(n.world.guidePosition[2]);
        i === 0 ? g.moveTo(px, pz) : g.lineTo(px, pz);
      });
      g.stroke();
      g.setLineDash([]);

      // keşifler
      bonusKesifler.forEach((b) => {
        const px = hx(b.pos[0] * DUNYA_OLCEK);
        const pz = hz(b.pos[2] * DUNYA_OLCEK);
        g.fillStyle = bulunan.includes(b.id) ? "rgba(120,215,205,0.9)" : "rgba(240,212,138,0.55)";
        g.beginPath();
        g.arc(px, pz, 1.8, 0, Math.PI * 2);
        g.fill();
      });

      // duraklar
      nodlar.forEach((n, i) => {
        const px = hx(n.world.guidePosition[0]);
        const pz = hz(n.world.guidePosition[2]);
        const gecti = i < aktifIndex;
        const aktif = i === aktifIndex;
        g.beginPath();
        g.arc(px, pz, aktif ? 4.5 : 3, 0, Math.PI * 2);
        g.fillStyle = gecti ? "#4BB3A9" : aktif ? "#FFCF72" : "rgba(247,235,211,0.35)";
        g.fill();
        if (aktif) {
          g.strokeStyle = "rgba(255,207,114,0.8)";
          g.lineWidth = 1.5;
          g.beginPath();
          g.arc(px, pz, 8 + Math.sin(Date.now() / 300) * 2, 0, Math.PI * 2);
          g.stroke();
        }
      });

      // gezgin
      const px = hx(oyuncuKonumu.x);
      const pz = hz(oyuncuKonumu.z);
      g.fillStyle = "#FFFFFF";
      g.beginPath();
      g.arc(px, pz, 3.2, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "rgba(0,0,0,0.5)";
      g.lineWidth = 1;
      g.stroke();

      g.restore();

      // çerçeve
      g.strokeStyle = "rgba(255,207,114,0.55)";
      g.lineWidth = 2;
      g.beginPath();
      g.arc(M, M, M - 1.5, 0, Math.PI * 2);
      g.stroke();

      // yön harfleri
      g.fillStyle = "rgba(247,235,211,0.6)";
      g.font = "bold 9px system-ui";
      g.textAlign = "center";
      g.fillText("K", M, 11);
      g.fillText("G", M, BOYUT - 4);
      g.fillText("B", 7, M + 3);
      g.fillText("D", BOYUT - 7, M + 3);
    };
    ciz();
    return () => cancelAnimationFrame(raf);
  }, [nodlar, aktifIndex, bulunan]);

  if (faz === "yukleniyor" || faz === "acilis") return null;

  return (
    <div className="mini-harita" aria-hidden="true">
      <canvas ref={kanvas} style={{ width: BOYUT, height: BOYUT }} />
      <div className="mini-harita-etiket">
        {nodlar[aktifIndex]
          ? BOLGELER[(nodlar[aktifIndex].zoneId as keyof typeof BOLGELER) ?? "oba"]?.ad ?? "Oba"
          : "Oba"}
      </div>
    </div>
  );
}
