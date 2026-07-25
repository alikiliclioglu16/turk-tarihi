"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useOyun } from "@/lib/store";
import type { TourNode } from "@/lib/types";
import { Hud } from "@/components/ui/Hud";
import { QuestPanel } from "@/components/ui/QuestPanel";
import { ClosingPanel } from "@/components/ui/ClosingPanel";
import { Joystick } from "@/components/ui/Joystick";
import { ilerlemeSifirla } from "@/lib/progress";
import { DurakKartiPaneli } from "@/components/ui/DurakKartiPaneli";
import { KesifKartiPaneli } from "@/components/ui/KesifKartiPaneli";
import { AnlatiSeridi } from "@/components/ui/AnlatiSeridi";
import { MiniHarita } from "@/components/ui/MiniHarita";
import { FinalSinavi } from "@/components/ui/FinalSinavi";
import { KartKoleksiyonu } from "@/components/ui/KartKoleksiyonu";
import { MobilKontroller } from "@/components/ui/MobilKontroller";
import { KaliteAyari } from "@/components/ui/KaliteAyari";
import { FotoModu } from "@/components/ui/FotoModu";
import { YuklemeEkrani } from "@/components/ui/YuklemeEkrani";
import { yuklemeDinle } from "@/lib/yuklemeYoneticisi";
import { AcilisAnlatisi } from "@/components/ui/AcilisAnlatisi";
import { BolgeGirisi } from "@/components/ui/BolgeGirisi";
import { KisiPanel } from "@/components/ui/KisiPanel";

// R3F sunucuda render edilemez
const D01Scene = dynamic(
  () => import("@/components/scene/D01Scene").then((m) => m.D01Scene),
  { ssr: false }
);

/** Durak dosyaları — yeni durak eklendikçe bu listeye ekleyin */
const NODE_DOSYALARI = [
  "/data/d01/d01-node-01.json",
  "/data/d01/d01-node-02.json",
  "/data/d01/d01-node-03.json",
  "/data/d01/d01-node-04.json",
  "/data/d01/d01-node-05.json",
  "/data/d01/d01-node-06.json",
  "/data/d01/d01-node-07.json",
  "/data/d01/d01-node-08.json",
  "/data/d01/d01-node-09.json",
  "/data/d01/d01-node-10.json",
];

export default function D01Page() {
  const faz = useOyun((s) => s.faz);
  const nodlariYukle = useOyun((s) => s.nodlariYukle);
  const kartlar = useOyun((s) => s.kazanilanKartlar);
  const sifirla = useOyun((s) => s.sifirla);
  const acilisAtla = useOyun((s) => s.acilisAtla);
  const odulAlindi = useOyun((s) => s.odulAlindi);
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const nod = nodlar[aktifIndex] ?? null;
  const gezilen = useOyun((s) => s.gezilenHotspotlar);
  const aktifKesifKarti = useOyun((s) => s.aktifKesifKarti);
  const kesifKartiKapat = useOyun((s) => s.kesifKartiKapat);
  const goreveGec = useOyun((s) => s.goreveGec);
  const zorunlu = nod?.completion.requiredHotspots ?? [];
  const bulunan = zorunlu.filter((id) => gezilen.includes(id)).length;
  const hepsiGezildi = zorunlu.length > 0 && bulunan >= zorunlu.length;
  const [hata, setHata] = useState<string | null>(null);
  const [koleksiyon, setKoleksiyon] = useState(false);
  const [foto, setFoto] = useState(false);
  const [ilerleme, setIlerleme] = useState(0);
  const [sahneHazirDegil, setSahneHazirDegil] = useState(true);

  // sahne kurulumu bitince yükleme ekranı kalkar
  useEffect(() => yuklemeDinle((o) => { if (o >= 1) setSahneHazirDegil(false); }), []);

  useEffect(() => {
    let iptal = false;
    (async () => {
      try {
        const nodlar = await Promise.all(
          NODE_DOSYALARI.map(async (yol) => {
            const r = await fetch(yol);
            if (!r.ok) throw new Error(`${yol} yüklenemedi (${r.status})`);
            return (await r.json()) as TourNode;
          })
        );
        if (!iptal) nodlariYukle(nodlar.sort((a, b) => a.order - b.order));
      } catch (e) {
        if (!iptal) setHata(e instanceof Error ? e.message : "Bilinmeyen hata");
      }
    })();
    return () => {
      iptal = true;
    };
  }, [nodlariYukle]);

  if (hata) {
    return (
      <main className="orta-ekran">
        <h1 className="baslik">Durak verisi yüklenemedi</h1>
        <p className="alt-yazi">{hata}</p>
        <Link className="ana-dugme" href="/">Haritaya dön</Link>
      </main>
    );
  }

  return (
    <main className="sahne-kapsayici">
      <D01Scene />
      <div className="vinyet" />

      {(faz === "yukleniyor" || sahneHazirDegil) && <YuklemeEkrani ilerleme={ilerleme} />}

      {faz === "acilis" && (
        <div className="acilis-katman">
          <div className="acilis-baslik">
            <div className="acilis-ust">D01 · Tarihin Kapısı</div>
            <h1 className="acilis-ad">Oğuz Obası</h1>
            <p className="acilis-alt">Bozkır · Öğle vakti</p>
          </div>
          <button className="acilis-atla" onClick={acilisAtla}>Tanıtımı geç →</button>
          <AcilisAnlatisi />
        </div>
      )}
      <FotoModu aktif={foto} setAktif={setFoto} />
      {faz !== "yukleniyor" && !foto && <Hud onKoleksiyon={() => setKoleksiyon(true)} />}
      {faz !== "yukleniyor" && !foto && <MiniHarita />}
      {faz !== "yukleniyor" && !foto && <MobilKontroller />}
      {faz !== "yukleniyor" && !foto && <KaliteAyari />}
      {faz !== "yukleniyor" && faz !== "acilis" && <BolgeGirisi />}

      <KisiPanel />

      {faz === "anlati" && !foto && <AnlatiSeridi />}

      {/* keşif kartı — hotspot veya bonus */}
      {aktifKesifKarti && (
        <KesifKartiPaneli
          kart={aktifKesifKarti}
          onKapat={kesifKartiKapat}
          sonraki={faz === "kesif" && hepsiGezildi ? goreveGec : undefined}
        />
      )}
      {faz === "gorev" && <QuestPanel />}
      {faz === "odul" && nod && (
        <DurakKartiPaneli kart={nod.reward} onBitti={odulAlindi} />
      )}
      {faz === "kapanis" && <ClosingPanel />}
      {faz === "sinav" && <FinalSinavi />}
      {koleksiyon && <KartKoleksiyonu onKapat={() => setKoleksiyon(false)} />}

      {faz === "bolumBitti" && (
        <div className="ortu">
          <div className="rozet">🔥</div>
          <h2 className="baslik">Tarihin Kapısı — bu bölüm tamamlandı</h2>
          <p className="alt-yazi">
            {kartlar.length} kart kazandın. Kalan duraklar eklendikçe yolculuk uzayacak.
          </p>
          <div className="dugme-satiri">
            <button
              className="ana-dugme"
              onClick={() => {
                ilerlemeSifirla();
                sifirla();
              }}
            >
              Baştan Oyna ↺
            </button>
            <Link className="ikinci-dugme" href="/">Haritaya Dön</Link>
          </div>
        </div>
      )}

      {(faz === "gezinti" || faz === "kesif") && <Joystick />}
    </main>
  );
}
