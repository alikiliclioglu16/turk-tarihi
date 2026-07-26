"use client";

import { useEffect, useMemo, useState } from "react";
import type { Quest, QuestOption } from "@/lib/types";
import { basariTinisi, tik } from "@/lib/audio";

/**
 * SIRALAMA GÖREVİ
 *
 * Node 07 (Göç Yolu) için. JSON'daki seçenek sırası kanonik doğru sıradır;
 * arayüz kartları karıştırarak gösterir.
 *
 * Çocuk kartları yukarı-aşağı taşıyarak sıralar. "Kontrol Et" dediğinde
 * doğru olanlar kilitlenir, yanlış olanlar açık kalır. Böylece kısmi
 * ilerleme korunur ve tamamen baştan başlamaz.
 */

interface Props {
  gorev: Quest;
  denemeSayisi: number;
  ipucu: string | null;
  onTamamlandi: () => void;
  onYanlis: () => void;
}

function karistir<T>(dizi: T[]): T[] {
  const d = [...dizi];
  // en az bir kart yer değiştirsin
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

export function SiralamaPaneli({
  gorev, denemeSayisi, ipucu, onTamamlandi, onYanlis,
}: Props) {
  /** JSON sırası = doğru sıra */
  const dogruSira = useMemo(() => gorev.options.map((o) => o.id), [gorev]);

  const [sira, setSira] = useState<QuestOption[]>(() =>
    gorev.arayuz?.karistir === false ? gorev.options : karistir(gorev.options)
  );
  const [kilitli, setKilitli] = useState<Set<string>>(new Set());
  const [geriBildirim, setGeriBildirim] = useState<{ metin: string; dogru: boolean } | null>(null);
  const [bitti, setBitti] = useState(false);

  useEffect(() => {
    if (bitti) {
      basariTinisi();
      const z = setTimeout(onTamamlandi, 900);
      return () => clearTimeout(z);
    }
  }, [bitti, onTamamlandi]);

  const tasi = (index: number, yon: -1 | 1) => {
    const hedef = index + yon;
    if (hedef < 0 || hedef >= sira.length) return;
    if (kilitli.has(sira[index].id) || kilitli.has(sira[hedef].id)) return;
    tik();
    const yeni = [...sira];
    [yeni[index], yeni[hedef]] = [yeni[hedef], yeni[index]];
    setSira(yeni);
    setGeriBildirim(null);
  };

  const kontrolEt = () => {
    const yeniKilit = new Set(kilitli);
    let hatali: QuestOption | null = null;

    sira.forEach((o, i) => {
      if (o.id === dogruSira[i]) {
        yeniKilit.add(o.id);
      } else if (!hatali) {
        hatali = o;
      }
    });
    setKilitli(yeniKilit);

    if (yeniKilit.size === sira.length) {
      setGeriBildirim({ metin: gorev.successFeedback, dogru: true });
      setBitti(true);
    } else {
      const h = hatali as QuestOption | null;
      setGeriBildirim({
        metin: h
          ? h.feedback
          : "Bazı adımlar henüz doğru yerde değil. Sırayı yeniden düşün.",
        dogru: false,
      });
      onYanlis();
    }
  };

  const dogruSayisi = kilitli.size;

  return (
    <section className="siralama" aria-labelledby="sira-baslik">
      <div className="sinif-ust">
        <span className="gorev-etiket">🎯 Görev</span>
        <span className="sinif-ilerleme">{dogruSayisi} / {sira.length} doğru yerde</span>
      </div>

      <h2 className="gorev-soru" id="sira-baslik">{gorev.prompt}</h2>
      <p className="sinif-yonerge">
        {gorev.arayuz?.yonerge ?? "Adımları doğru sıraya diz."}
      </p>

      <ol className="sira-liste">
        {sira.map((o, i) => {
          const kilit = kilitli.has(o.id);
          return (
            <li key={o.id} className={`sira-kart ${kilit ? "kilitli" : ""}`}>
              <span className="sr-only">
                {i + 1}. sırada: {o.text}. {kilit ? "Doğru yerde." : "Taşınabilir."}
              </span>
              <span className="sira-numara">{i + 1}</span>
              <span className="sira-metin">{o.text}</span>
              {kilit ? (
                <span className="sira-onay" aria-label="Doğru yerde">✓</span>
              ) : (
                <span className="sira-oklar">
                  <button
                    type="button"
                    onClick={() => tasi(i, -1)}
                    disabled={i === 0}
                    aria-label="Yukarı taşı"
                  >▲</button>
                  <button
                    type="button"
                    onClick={() => tasi(i, 1)}
                    disabled={i === sira.length - 1}
                    aria-label="Aşağı taşı"
                  >▼</button>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {geriBildirim && (
        <p className={`geri-bildirim ${geriBildirim.dogru ? "olumlu" : "olumsuz"}`} role="status">
          {geriBildirim.metin}
        </p>
      )}

      {!bitti && (
        <button type="button" className="ana-dugme" onClick={kontrolEt}>
          Kontrol Et
        </button>
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
