"use client";

import { useEffect, useMemo, useState } from "react";
import type { Quest, QuestOption } from "@/lib/types";
import { basariTinisi, tik } from "@/lib/audio";

/**
 * SINIFLANDIRMA GÖREVİ
 *
 * Node 04 (Gördüğüm / Düşündüğüm) ve node 09 (Değişen / Süren / Hem değişen
 * hem süren) için. Node 10'un bağlantı görevi de aynı motoru kullanır —
 * orada sütunlar bilgi düzeyleridir.
 *
 * Çocuk kartı okur, hangi sütuna ait olduğunu seçer. Yanlış seçimde kart
 * geri döner ve gerekçe gösterilir. Sütun bilgisi JSON'dan gelir; hiçbir
 * etiket koda gömülü değildir.
 */

interface Props {
  gorev: Quest;
  denemeSayisi: number;
  ipucu: string | null;
  onTamamlandi: () => void;
  onYanlis: () => void;
}

interface Kart extends QuestOption {
  /** kartın gerçek sütunu — bağlantı görevinde dogruDuzey öncelikli */
  hedefSutun: string;
  /** ekranda gösterilecek metin (sütun ön eki ayıklanmış) */
  gosterim: string;
  /** bağlantı görevinde kaynak | iddia ayrımı */
  kaynak?: string;
  iddia?: string;
}

/** Yanlış ifadeler için otomatik eklenen sütun */
const RED_SUTUNU = "Bu ifade yanlış";

function kartHazirla(o: QuestOption): Kart {
  // "Biliyoruz — Su ve patika | Coğrafya ..." biçimini ayrıştır
  let metin = o.text;
  const tireIndex = metin.indexOf("—");
  if (tireIndex > -1 && tireIndex < 30) {
    metin = metin.slice(tireIndex + 1).trim();
  }
  const boruIndex = metin.indexOf("|");
  const kaynak = boruIndex > -1 ? metin.slice(0, boruIndex).trim() : undefined;
  const iddia = boruIndex > -1 ? metin.slice(boruIndex + 1).trim() : undefined;

  /**
   * Hedef sütun üç kurala göre belirlenir:
   *  1. `dogruDuzey` varsa o kullanılır (node 10: etiketi yanlış ama
   *     gerçek düzeyi bilinen kartlar)
   *  2. Kart doğruysa kendi `sutun` alanı hedeftir
   *  3. Kart yanlışsa ve gerçek düzeyi bilinmiyorsa (node 03), kart
   *     bir sütuna değil RED SÜTUNUNA aittir — çünkü ifade kendisi hatalı
   */
  const hedefSutun = o.dogruDuzey
    ? o.dogruDuzey
    : o.correct
    ? o.sutun ?? ""
    : RED_SUTUNU;

  return { ...o, hedefSutun, gosterim: metin, kaynak, iddia };
}

function karistir<T>(dizi: T[]): T[] {
  const d = [...dizi];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

export function SiniflandirmaPaneli({
  gorev, denemeSayisi, ipucu, onTamamlandi, onYanlis,
}: Props) {
  const baglantiMi = gorev.type === "baglanti";

  /**
   * Görevde gerçek düzeyi bilinmeyen yanlış kart varsa, "Bu ifade yanlış"
   * sütunu otomatik eklenir. Böylece çocuk hatalı ifadeyi bir kutuya
   * zorla yerleştirmek yerine reddedebilir.
   */
  const redGerekli = useMemo(
    () => gorev.options.some((o) => !o.correct && !o.dogruDuzey),
    [gorev]
  );

  const sutunlar = useMemo(() => {
    const temel = gorev.arayuz?.sutunlar ?? [];
    return redGerekli ? [...temel, RED_SUTUNU] : temel;
  }, [gorev, redGerekli]);

  const tumKartlar = useMemo(() => {
    const hazir = gorev.options.map(kartHazirla).filter((k) => k.hedefSutun);
    return gorev.arayuz?.karistir === false ? hazir : karistir(hazir);
  }, [gorev]);

  const [bekleyen, setBekleyen] = useState<Kart[]>(tumKartlar);
  const [yerlesen, setYerlesen] = useState<Record<string, Kart[]>>(() =>
    Object.fromEntries(sutunlar.map((s) => [s, [] as Kart[]]))
  );
  const [seciliKart, setSeciliKart] = useState<string | null>(null);
  const [geriBildirim, setGeriBildirim] = useState<{ metin: string; dogru: boolean } | null>(null);
  const [sarsilan, setSarsilan] = useState<string | null>(null);

  useEffect(() => {
    if (bekleyen.length === 0 && tumKartlar.length > 0) {
      basariTinisi();
      const z = setTimeout(onTamamlandi, 900);
      return () => clearTimeout(z);
    }
  }, [bekleyen.length, tumKartlar.length, onTamamlandi]);

  const sutunaKoy = (sutun: string) => {
    if (!seciliKart) return;
    const kart = bekleyen.find((k) => k.id === seciliKart);
    if (!kart) return;

    if (kart.hedefSutun === sutun) {
      tik();
      setBekleyen((b) => b.filter((k) => k.id !== kart.id));
      setYerlesen((y) => ({ ...y, [sutun]: [...y[sutun], kart] }));
      setGeriBildirim({ metin: kart.feedback, dogru: true });
      setSeciliKart(null);
    } else {
      setSarsilan(kart.id);
      setTimeout(() => setSarsilan(null), 600);
      setGeriBildirim({
        metin: kart.correct
          ? "Bu kart başka bir sütuna ait. Metni bir daha oku."
          : kart.feedback,
        dogru: false,
      });
      onYanlis();
    }
  };

  const toplam = tumKartlar.length;
  const yapilan = toplam - bekleyen.length;

  return (
    <section className="siniflandirma" aria-labelledby="sinif-baslik">
      <span className="sr-only" aria-live="polite">
        {yapilan} kart yerleşti, {toplam - yapilan} kart kaldı.
      </span>
      <div className="sinif-ust">
        <span className="gorev-etiket">🎯 Görev</span>
        <span className="sinif-ilerleme">{yapilan} / {toplam}</span>
      </div>

      <h2 className="gorev-soru" id="sinif-baslik">{gorev.prompt}</h2>
      {gorev.arayuz?.yonerge && (
        <p className="sinif-yonerge">
          {seciliKart ? "Şimdi sütun seç ↓" : "Önce bir kart seç ↓"}
        </p>
      )}

      {/* ---------- BEKLEYEN KARTLAR ---------- */}
      <div className="sinif-kartlar" role="group" aria-label="Yerleştirilecek kartlar">
        {bekleyen.map((k) => (
          <button
            key={k.id}
            type="button"
            className={`sinif-kart ${seciliKart === k.id ? "secili" : ""} ${sarsilan === k.id ? "sarsil" : ""}`}
            onClick={() => { setSeciliKart(seciliKart === k.id ? null : k.id); setGeriBildirim(null); }}
            aria-pressed={seciliKart === k.id}
          >
            {baglantiMi && k.kaynak ? (
              <>
                <span className="sinif-kaynak">{k.kaynak}</span>
                <span className="sinif-iddia">{k.iddia}</span>
              </>
            ) : (
              k.gosterim
            )}
          </button>
        ))}
        {bekleyen.length === 0 && (
          <div className="sinif-bitti">✓ Bütün kartlar yerleşti</div>
        )}
      </div>

      {/* ---------- SÜTUNLAR ---------- */}
      <div
        className="sinif-sutunlar"
        style={{ gridTemplateColumns: `repeat(${sutunlar.length}, 1fr)` }}
      >
        {sutunlar.map((s) => (
          <button
            key={s}
            type="button"
            className={`sinif-sutun ${seciliKart ? "aktif" : ""} ${s === RED_SUTUNU ? "red" : ""}`}
            onClick={() => sutunaKoy(s)}
            disabled={!seciliKart}
            aria-label={`${s} sütununa yerleştir`}
          >
            <span className="sinif-sutun-baslik">{s}</span>
            <span className="sinif-sutun-icerik">
              {yerlesen[s]?.map((k) => (
                <span key={k.id} className="sinif-yerlesen">
                  {baglantiMi && k.kaynak ? k.kaynak : k.gosterim}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>

      {geriBildirim && (
        <p className={`geri-bildirim ${geriBildirim.dogru ? "olumlu" : "olumsuz"}`} role="status">
          {geriBildirim.metin}
        </p>
      )}

      {ipucu && (
        <div className="ipucu-kutu" role="status">
          <span className="ipucu-ikon" aria-hidden="true">💡</span>
          <div>
            <div className="ipucu-baslik">
              {denemeSayisi >= 4 ? "Dede Korkut yol gösteriyor" : "Küçük bir ipucu"}
            </div>
            <p>{ipucu}</p>
          </div>
        </div>
      )}
    </section>
  );
}
