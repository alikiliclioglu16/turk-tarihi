"use client";

import { useEffect, useRef, useState } from "react";
import { useOyun } from "@/lib/store";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { BOLGELER, bolgeBul, type BolgeId } from "@/lib/bolgeler";
import { anlatiCal, anlatiDurdur } from "@/lib/audio";
import { DedeYuz } from "./DedeYuz";

interface Replik { id: string; audio: string; text: string }
type Veri = Record<string, Replik[]>;

/**
 * BÖLGE GİRİŞİ
 *
 * Bir bölgeye ilk kez girildiğinde bölge adı sinematik olarak belirir ve
 * Dede Korkut o bölgeyi iki replikle tanıtır. Oyun durmaz; yürümeye
 * devam edebilirsiniz.
 */
export function BolgeGirisi() {
  const faz = useOyun((s) => s.faz);
  const [veri, setVeri] = useState<Veri>({});
  const [aktif, setAktif] = useState<{ bolge: BolgeId; replik: Replik } | null>(null);
  const girilenler = useRef<Set<string>>(new Set(["oba"]));
  const sonKontrol = useRef(0);
  const zaman = useRef<number[]>([]);

  useEffect(() => {
    fetch("/data/d01/d01-bolge-giris-anlatilari.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.bolgeGiris && setVeri(j.bolgeGiris as Veri))
      .catch(() => { /* yoksa sessiz geç */ });
  }, []);

  useEffect(() => {
    if (faz === "yukleniyor" || faz === "acilis") return;
    const z = window.setInterval(() => {
      const simdi = performance.now();
      if (simdi - sonKontrol.current < 700) return;
      sonKontrol.current = simdi;

      const b = bolgeBul(oyuncuKonumu.x, oyuncuKonumu.z);
      if (girilenler.current.has(b)) return;
      const merkez = BOLGELER[b].merkez;
      // bölge merkezine yeterince yaklaşınca say
      const d = Math.hypot(
        oyuncuKonumu.x - merkez[0] * 4.0,
        oyuncuKonumu.z - merkez[1] * 4.0
      );
      if (d > BOLGELER[b].yaricap * 4.0 * 0.85) return;

      girilenler.current.add(b);
      const liste = veri[b];
      if (!liste?.length) return;

      setAktif({ bolge: b, replik: liste[0] });
      anlatiCal(liste[0].audio, liste[0].text);
      zaman.current.forEach(clearTimeout);
      zaman.current = [
        window.setTimeout(() => {
          if (liste[1]) {
            setAktif({ bolge: b, replik: liste[1] });
            anlatiCal(liste[1].audio, liste[1].text);
          }
        }, 7200),
        window.setTimeout(() => setAktif(null), 14500),
      ];
    }, 400);
    return () => {
      window.clearInterval(z);
      zaman.current.forEach(clearTimeout);
    };
  }, [faz, veri]);

  useEffect(() => () => anlatiDurdur(), []);

  if (!aktif) return null;
  const b = BOLGELER[aktif.bolge];

  return (
    <>
      <div className="bolge-adi" key={aktif.bolge}>
        <div className="bolge-adi-ust">Yeni bölge</div>
        <h2 className="bolge-adi-metin">{b.ad}</h2>
        <div className="bolge-adi-alt">{b.duygu}</div>
      </div>

      <div className="acilis-anlati" key={aktif.replik.id}>
        <div className="acilis-anlati-portre">
          <DedeYuz boyut={84} />
        </div>
        <div className="acilis-anlati-metin">
          <span className="acilis-anlati-ad">Dede Korkut</span>
          <p>{aktif.replik.text}</p>
        </div>
      </div>
    </>
  );
}
