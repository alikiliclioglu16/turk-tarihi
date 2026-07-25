"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { TourNode } from "@/lib/types";
import { useOyun } from "@/lib/store";
import { rehberTarafi } from "@/lib/koordinat";
import { ilerlemeSifirla } from "@/lib/progress";
import { sesBaslat, sessizAyarla, sessizMi } from "@/lib/audio";

import { DiscoveryStage2D } from "@/components/discovery2d/DiscoveryStage2D";
import { DedeKorkutGuide, type RehberPoz } from "@/components/discovery2d/DedeKorkutGuide";
import { QuestEngine } from "@/components/discovery2d/QuestEngine";
import { HistoryCardReward } from "@/components/discovery2d/HistoryCardReward";
import { NodeProgress } from "@/components/discovery2d/NodeProgress";

/** Durak dosyaları — yeni node eklemek yalnız bu listeye satır eklemektir */
const NODE_DOSYALARI = [
  "/data/d01/d01-node-01.json",
  "/data/d01/d01-node-02.json",
  "/data/d01/d01-node-03.json",
];

export default function D01Page() {
  const nodlar = useOyun((s) => s.nodlar);
  const aktifIndex = useOyun((s) => s.aktifIndex);
  const faz = useOyun((s) => s.faz);
  const anlatiIndex = useOyun((s) => s.anlatiIndex);
  const gezilen = useOyun((s) => s.gezilenHotspotlar);
  const aktifHotspotId = useOyun((s) => s.aktifHotspotId);
  const kartlar = useOyun((s) => s.kazanilanKartlar);
  const dogruSecilenler = useOyun((s) => s.dogruSecilenler);
  const denemeSayisi = useOyun((s) => s.denemeSayisi);
  const geriBildirim = useOyun((s) => s.sonGeriBildirim);
  const ipucu = useOyun((s) => s.ipucu);

  const nodlariYukle = useOyun((s) => s.nodlariYukle);
  const duragiBaslat = useOyun((s) => s.duragiBaslat);
  const sonrakiAnlati = useOyun((s) => s.sonrakiAnlati);
  const hotspotAc = useOyun((s) => s.hotspotAc);
  const hotspotKapat = useOyun((s) => s.hotspotKapat);
  const goreveGec = useOyun((s) => s.goreveGec);
  const cevapVer = useOyun((s) => s.cevapVer);
  const cokluCevapVer = useOyun((s) => s.cokluCevapVer);
  const odulAlindi = useOyun((s) => s.odulAlindi);
  const kapanisBitti = useOyun((s) => s.kapanisBitti);
  const sifirla = useOyun((s) => s.sifirla);

  const [hata, setHata] = useState<string | null>(null);
  const [sessiz, setSessiz] = useState(false);
  const [altyazi, setAltyazi] = useState(true);

  const nod: TourNode | null = nodlar[aktifIndex] ?? null;

  /* --- veri yükleme --- */
  useEffect(() => {
    let iptal = false;
    (async () => {
      try {
        const veri = await Promise.all(
          NODE_DOSYALARI.map(async (yol) => {
            const r = await fetch(yol);
            if (!r.ok) throw new Error(`${yol} yüklenemedi (${r.status})`);
            return (await r.json()) as TourNode;
          })
        );
        if (!iptal) nodlariYukle(veri.sort((a, b) => a.order - b.order));
      } catch (e) {
        if (!iptal) setHata(e instanceof Error ? e.message : "Bilinmeyen hata");
      }
    })();
    return () => { iptal = true; };
  }, [nodlariYukle]);

  /* --- ses ancak ilk kullanıcı hareketinden sonra başlayabilir --- */
  useEffect(() => {
    const basla = () => {
      sesBaslat();
      setSessiz(sessizMi());
      window.removeEventListener("pointerdown", basla);
      window.removeEventListener("keydown", basla);
    };
    window.addEventListener("pointerdown", basla);
    window.addEventListener("keydown", basla);
    return () => {
      window.removeEventListener("pointerdown", basla);
      window.removeEventListener("keydown", basla);
    };
  }, []);

  const sesDegistir = useCallback(() => {
    setSessiz((s) => {
      sessizAyarla(!s);
      return !s;
    });
  }, []);

  if (hata) {
    return (
      <main className="orta-ekran">
        <h1 className="baslik">Durak verisi yüklenemedi</h1>
        <p className="alt-yazi">{hata}</p>
        <Link className="ana-dugme" href="/">Haritaya dön</Link>
      </main>
    );
  }

  const zorunlu = nod?.completion.requiredHotspots ?? [];
  const bulunan = zorunlu.filter((id) => gezilen.includes(id)).length;
  const hepsiGezildi = nod ? bulunan >= zorunlu.length : false;
  const aktifHotspot = aktifHotspotId ? nod?.hotspots.find((h) => h.id === aktifHotspotId) : null;
  const taraf = nod ? rehberTarafi(nod) : "sag";

  /* Faza göre rehber pozu */
  let poz: RehberPoz = "DK01";
  if (faz === "anlati") poz = anlatiIndex === 0 ? "DK01" : "DK04";
  else if (faz === "kesif") poz = aktifHotspot ? "DK04" : taraf === "sol" ? "DK02" : "DK03";
  else if (faz === "gorev") poz = ipucu ? "DK05" : "DK04";
  else if (faz === "kapanis") poz = "DK06";
  else if (faz === "bolumBitti") poz = "DK08";

  return (
    <main className="d01-sayfa">
      <DiscoveryStage2D
        nod={nod}
        faz={faz}
        gezilen={gezilen}
        onHotspotSec={hotspotAc}
      />

      {nod && <NodeProgress
        nodlar={nodlar}
        aktifIndex={aktifIndex}
        kartSayisi={kartlar.length}
        sessiz={sessiz}
        altyazi={altyazi}
        onSes={sesDegistir}
        onAltyazi={() => setAltyazi((a) => !a)}
      />}

      {faz === "yukleniyor" && <div className="yukleniyor">Bozkır hazırlanıyor…</div>}

      {/* --- GEZİNTİ: durağa davet --- */}
      {faz === "gezinti" && nod && (
        <div className="davet">
          <p className="davet-metin">🧭 Sıradaki durak: <strong>{nod.title}</strong></p>
          <button type="button" className="ana-dugme buyuk" onClick={duragiBaslat}>
            Durağa Git →
          </button>
        </div>
      )}

      {/* --- ANLATI --- */}
      {faz === "anlati" && nod && nod.narration[anlatiIndex] && (
        <DedeKorkutGuide
          poz={poz}
          taraf={taraf}
          metin={nod.narration[anlatiIndex].text}
          altBaslik={nod.title}
          ses={nod.narration[anlatiIndex].audio}
          altyaziAcik={altyazi}
          dugmeMetni={anlatiIndex + 1 >= nod.narration.length ? "Etrafı Keşfet ✨" : "Devam →"}
          onDevam={sonrakiAnlati}
        />
      )}

      {/* --- KEŞİF --- */}
      {faz === "kesif" && nod && (
        aktifHotspot ? (
          <DedeKorkutGuide
            poz="DK04"
            taraf={taraf}
            metin={aktifHotspot.text}
            altBaslik={aktifHotspot.label}
            ses={aktifHotspot.audio}
            altyaziAcik={altyazi}
            dugmeMetni={hepsiGezildi ? "Göreve Geç 🎯" : "Kapat · Keşfe Dön"}
            onDevam={hepsiGezildi ? goreveGec : hotspotKapat}
          />
        ) : (
          <div className="kesif-serit" role="status">
            👆 Parlayan noktalara dokun
            <span className="kesif-noktalar" aria-hidden="true">
              {zorunlu.map((id) => (
                <span key={id} className={`kesif-nokta ${gezilen.includes(id) ? "bulundu" : ""}`} />
              ))}
            </span>
            <span className="kesif-sayi">{bulunan}/{zorunlu.length}</span>
            {hepsiGezildi && (
              <button type="button" className="ana-dugme kucuk" onClick={goreveGec}>
                Göreve Geç 🎯
              </button>
            )}
          </div>
        )
      )}

      {/* --- GÖREV --- */}
      {faz === "gorev" && nod && (
        <QuestEngine
          nod={nod}
          dogruSecilenler={dogruSecilenler}
          denemeSayisi={denemeSayisi}
          geriBildirim={geriBildirim}
          ipucu={ipucu}
          onCevap={cevapVer}
          onCokluCevap={cokluCevapVer}
        />
      )}

      {/* --- ÖDÜL --- */}
      {faz === "odul" && nod && (
        <HistoryCardReward kart={nod.reward} basariMetni={geriBildirim} onDevam={odulAlindi} />
      )}

      {/* --- KAPANIŞ --- */}
      {faz === "kapanis" && nod && (
        <DedeKorkutGuide
          poz="DK06"
          taraf={taraf}
          metin={nod.closing.text}
          altBaslik={nod.title}
          ses={nod.closing.audio}
          altyaziAcik={altyazi}
          dugmeMetni={aktifIndex + 1 >= nodlar.length ? "Bölümü Bitir 🔥" : "Sonraki Durağa →"}
          onDevam={kapanisBitti}
        />
      )}

      {/* --- BÖLÜM SONU --- */}
      {faz === "bolumBitti" && (
        <div className="ortu">
          <div className="rozet" aria-hidden="true">🔥</div>
          <h2 className="baslik">Tarihin Kapısı — bu bölüm tamamlandı</h2>
          <p className="alt-yazi">
            {kartlar.length} kart kazandın. Kalan duraklar eklendikçe yolculuk uzayacak.
          </p>
          <div className="dugme-satiri">
            <button type="button" className="ana-dugme" onClick={() => { ilerlemeSifirla(); sifirla(); }}>
              Baştan Oyna ↺
            </button>
            <Link className="ikinci-dugme" href="/">Haritaya Dön</Link>
          </div>
        </div>
      )}
    </main>
  );
}
