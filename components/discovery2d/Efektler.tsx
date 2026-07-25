"use client";

import { useEffect, useRef } from "react";

/**
 * ATEŞ PARÇACIKLARI — Canvas 2D
 * Ocaktan yükselen kıvılcımlar ve hafif duman. 2.5D sahneye hareket ve
 * sıcaklık katan en ucuz, en etkili öğe.
 */
export function AtesParcaciklari({ azalt }: { azalt: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (azalt) return;
    const c = ref.current;
    if (!c) return;
    const g = c.getContext("2d");
    if (!g) return;

    let raf = 0;
    let genislik = 0;
    let yukseklik = 0;

    const olcekle = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      genislik = r.width;
      yukseklik = r.height;
      c.width = Math.max(1, Math.floor(r.width * dpr));
      c.height = Math.max(1, Math.floor(r.height * dpr));
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    olcekle();
    const ro = new ResizeObserver(olcekle);
    ro.observe(c);

    type Kiv = { x: number; y: number; vx: number; vy: number; om: number; t: number; boy: number };
    const kaynakX = 0.61; // ocak konumu (sahne yüzdesi)
    const kaynakY = 0.86;
    const kivilcimlar: Kiv[] = Array.from({ length: 46 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, om: 0, t: Math.random(), boy: 0,
    }));

    const dogur = (k: Kiv) => {
      k.x = kaynakX * genislik + (Math.random() - 0.5) * genislik * 0.045;
      k.y = kaynakY * yukseklik + (Math.random() - 0.5) * yukseklik * 0.02;
      k.vx = (Math.random() - 0.5) * 0.28;
      k.vy = -(0.35 + Math.random() * 0.65);
      k.om = 0;
      k.t = 0;
      k.boy = 0.9 + Math.random() * 1.7;
    };
    kivilcimlar.forEach(dogur);

    let sonZaman = performance.now();
    const dongu = (simdi: number) => {
      const dt = Math.min((simdi - sonZaman) / 16.67, 3);
      sonZaman = simdi;
      g.clearRect(0, 0, genislik, yukseklik);

      for (const k of kivilcimlar) {
        k.t += 0.006 * dt;
        if (k.t >= 1) dogur(k);
        k.x += (k.vx + Math.sin(k.t * 9) * 0.16) * dt;
        k.y += k.vy * dt;
        k.om = Math.sin(k.t * Math.PI);

        g.beginPath();
        g.arc(k.x, k.y, k.boy, 0, Math.PI * 2);
        g.fillStyle = `rgba(255,${150 + Math.floor(k.om * 70)},90,${(k.om * 0.85).toFixed(3)})`;
        g.fill();
      }

      // ocak parıltısı
      const parla = g.createRadialGradient(
        kaynakX * genislik, kaynakY * yukseklik, 2,
        kaynakX * genislik, kaynakY * yukseklik, genislik * 0.16
      );
      const nabiz = 0.10 + Math.sin(simdi / 260) * 0.028 + Math.sin(simdi / 77) * 0.012;
      parla.addColorStop(0, `rgba(240,164,74,${Math.max(0, nabiz).toFixed(3)})`);
      parla.addColorStop(1, "rgba(240,164,74,0)");
      g.fillStyle = parla;
      g.fillRect(0, 0, genislik, yukseklik);

      raf = requestAnimationFrame(dongu);
    };
    raf = requestAnimationFrame(dongu);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [azalt]);

  if (azalt) return null;
  return <canvas ref={ref} className="efekt-kanvas" aria-hidden="true" />;
}
