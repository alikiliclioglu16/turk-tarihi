"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useOyun } from "@/lib/store";
import type { TourNode } from "@/lib/types";
import { Hud } from "@/components/ui/Hud";
import { NarrationPanel } from "@/components/ui/NarrationPanel";
import { HotspotPanel } from "@/components/ui/HotspotPanel";
import { QuestPanel } from "@/components/ui/QuestPanel";
import { RewardCardPanel } from "@/components/ui/RewardCard";
import { ClosingPanel } from "@/components/ui/ClosingPanel";
import { Joystick } from "@/components/ui/Joystick";
import { ilerlemeSifirla } from "@/lib/progress";
import { BonusPanel } from "@/components/ui/BonusPanel";

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
];

export default function D01Page() {
  const faz = useOyun((s) => s.faz);
  const nodlariYukle = useOyun((s) => s.nodlariYukle);
  const kartlar = useOyun((s) => s.kazanilanKartlar);
  const sifirla = useOyun((s) => s.sifirla);
  const [hata, setHata] = useState<string | null>(null);

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

      {faz === "yukleniyor" && <div className="yukleniyor">Bozkır hazırlanıyor…</div>}
      {faz !== "yukleniyor" && <Hud />}

      <BonusPanel />

      {faz === "anlati" && <NarrationPanel />}
      {faz === "kesif" && <HotspotPanel />}
      {faz === "gorev" && <QuestPanel />}
      {faz === "odul" && <RewardCardPanel />}
      {faz === "kapanis" && <ClosingPanel />}

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
