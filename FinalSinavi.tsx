"use client";

import { useEffect, useState } from "react";
import { yuklemeDinle } from "@/lib/yuklemeYoneticisi";

/**
 * YÜKLEME EKRANI
 *
 * Boş bekleme yerine bilgi veren bir açılış. İlerleme çubuğu, dönen
 * bilgi kartları ve kontrol hatırlatmaları. Öğrenci beklerken bile
 * bir şey öğrenir.
 */

const BILGILER: { baslik: string; metin: string }[] = [
  { baslik: "Gözlem ve yorum", metin: "Gördüğün ayrıntı gözlemdir. Anlamı hakkındaki düşüncen yorumdur. Tarihçi bu ikisini ayırır." },
  { baslik: "Bilmiyoruz demek", metin: "Kanıt yetmiyorsa \u201cbilmiyoruz\u201d demek en dürüst cevaptır. Bu, araştırmanın kapısını açık tutar." },
  { baslik: "Bağlam", metin: "Bir buluntu yalnız kendisiyle değil, bulunduğu yerle anlam taşır. Yerinden alınırsa bilgi kaybolur." },
  { baslik: "Değişim ve süreklilik", metin: "Bazı şeyler zamanla değişir, bazı ihtiyaçlar sürer. Geçmiş tek çizgide ilerlemez." },
  { baslik: "Coğrafya", metin: "Su, otlak ve zemin birlikte okunur. Çevre insana seçenek sunar, kararı insan verir." },
  { baslik: "Kaynak türleri", metin: "Sözlü, maddi, yazılı, coğrafi ve arkeolojik kaynaklar birlikte kullanılınca açıklama güçlenir." },
];

const KONTROLLER: [string, string][] = [
  ["W A S D / Ok tuşları", "Yürü"],
  ["Shift", "Koş"],
  ["Space", "Zıpla"],
  ["Ctrl", "Otur"],
  ["Fare sürükle", "Etrafa bak"],
  ["M", "Harita"],
  ["C", "Kart koleksiyonu"],
  ["P", "Fotoğraf modu"],
];

export function YuklemeEkrani({ ilerleme }: { ilerleme: number }) {
  const [bilgi, setBilgi] = useState(0);
  const [sahne, setSahne] = useState(0);
  const [durum, setDurum] = useState("Hazırlanıyor");

  useEffect(() => yuklemeDinle((o, ad) => { setSahne(o); setDurum(ad); }), []);

  useEffect(() => {
    const z = window.setInterval(() => setBilgi((b) => (b + 1) % BILGILER.length), 4200);
    return () => window.clearInterval(z);
  }, []);

  const b = BILGILER[bilgi];

  return (
    <div className="yukleme">
      <div className="yukleme-ic">
        <div className="yukleme-marka">
          <span className="yukleme-ikon" aria-hidden="true">🪕</span>
          <div>
            <div className="yukleme-ust">Dede Korkut ile Türk Tarihi</div>
            <h1 className="yukleme-baslik">D01 · Tarihin Kapısı</h1>
          </div>
        </div>

        <div className="yukleme-bilgi" key={bilgi}>
          <div className="yukleme-bilgi-baslik">{b.baslik}</div>
          <p>{b.metin}</p>
        </div>

        <div className="yukleme-cubuk">
          <div
            className="yukleme-dolgu"
            style={{ width: `${Math.round((ilerleme * 0.35 + sahne * 0.65) * 100)}%` }}
          />
        </div>
        <div className="yukleme-durum">
          {ilerleme < 1 ? "Duraklar okunuyor…" : `${durum}…`}
        </div>

        <div className="yukleme-kontroller">
          {KONTROLLER.map(([tus, ne]) => (
            <div key={tus} className="yukleme-kontrol">
              <kbd>{tus}</kbd>
              <span>{ne}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
