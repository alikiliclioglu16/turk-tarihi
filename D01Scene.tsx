"use client";

import { useMemo, useState } from "react";
import { useOyun } from "@/lib/store";
import { bonusKesifler } from "@/lib/bonusKesifler";
import { OGRENME_NOKTALARI } from "@/lib/ogrenmeNoktalari";

/**
 * FİNAL DEĞERLENDİRMESİ
 *
 * On durağın hepsi tamamlandığında açılır. Yeni bilgi ölçmez;
 * bölümün ana kavramlarını bir araya getirir. Ceza yoktur, yanlışta
 * açıklama verilir ve tekrar denenebilir.
 */

interface Soru {
  soru: string;
  secenekler: { metin: string; dogru: boolean; aciklama: string }[];
}

const SORULAR: Soru[] = [
  {
    soru: "Geçmişi öğrenmek için önce ne yaparız?",
    secenekler: [
      { metin: "Gördüğümüzü dikkatle inceleriz", dogru: true, aciklama: "Doğru. Gözlem her çıkarımın başlangıcıdır." },
      { metin: "En hızlı tahmini yaparız", dogru: false, aciklama: "Tahmin gözlemden sonra gelir. Önce bakmak gerekir." },
      { metin: "Buluntuyu yerinden alırız", dogru: false, aciklama: "Buluntu yerinden alınınca bağlamı kaybolur." },
    ],
  },
  {
    soru: "Bir taş figürün elindeki kap için ne söyleyebiliriz?",
    secenekler: [
      { metin: "Elinde kap benzeri bir şekil var", dogru: true, aciklama: "Bu bir gözlemdir; doğrudan görülür." },
      { metin: "Kesinlikle bir hükümdardı", dogru: false, aciklama: "Bu kanıtsız bir kesinlik. Gözlemle desteklenmiyor." },
      { metin: "Tören için yapılmıştı", dogru: false, aciklama: "Bu bir yorum; kaynak ve uzmanlık ister." },
    ],
  },
  {
    soru: "Aşınmış bir yazıtın silinmiş kısmı için doğru tutum nedir?",
    secenekler: [
      { metin: "Bilmiyoruz demek", dogru: true, aciklama: "Bilmediğini kabul etmek de bilimin parçasıdır." },
      { metin: "Benzer yazıtlardan uydurmak", dogru: false, aciklama: "Uydurmak kaynağı bozar; sonraki araştırmayı yanıltır." },
      { metin: "Metni tamamlayıp yazmak", dogru: false, aciklama: "Tamamlama ancak uzman ve kaynakla, açıkça belirtilerek yapılır." },
    ],
  },
  {
    soru: "İnsanlar neden her yere değil, bazı yerlere konardı?",
    secenekler: [
      { metin: "Su, otlak ve güvenli zemin birlikte arandığı için", dogru: true, aciklama: "Doğru. Yer seçimi tek değil, çok sebebe bağlıydı." },
      { metin: "Yalnız suya en yakın yer seçildiği için", dogru: false, aciklama: "Yalnız su yetmez; taşkın riski ve otlak da hesaba katılırdı." },
      { metin: "Rastgele karar verildiği için", dogru: false, aciklama: "Yer seçimi yılların birikmiş bilgisiydi." },
    ],
  },
  {
    soru: "Zamanla değişen ve süren şeyler için ne söylenebilir?",
    secenekler: [
      { metin: "Biçimler değişebilir, ihtiyaçlar sürebilir", dogru: true, aciklama: "Doğru. Değişim ve süreklilik birlikte okunur." },
      { metin: "Hiçbir şey değişmedi", dogru: false, aciklama: "Bu özcü bir iddia; tarihsel gerçekle bağdaşmaz." },
      { metin: "Her şey tamamen değişti", dogru: false, aciklama: "Bazı ihtiyaç ve değerler biçim değiştirerek sürer." },
    ],
  },
];

export function FinalSinavi() {
  const bitir = useOyun((s) => s.sinaviBitir);
  const bulunan = useOyun((s) => s.bulunanBonuslar);
  const toplamKesif = useMemo(() => bonusKesifler.length + OGRENME_NOKTALARI.length, []);

  const [adim, setAdim] = useState(0);
  const [secili, setSecili] = useState<number | null>(null);
  const [dogruSayisi, setDogruSayisi] = useState(0);
  const [bittiMi, setBittiMi] = useState(false);

  const s = SORULAR[adim];

  const sec = (i: number) => {
    if (secili !== null) return;
    setSecili(i);
    if (s.secenekler[i].dogru) setDogruSayisi((d) => d + 1);
  };

  const ilerle = () => {
    if (adim + 1 < SORULAR.length) {
      setAdim(adim + 1);
      setSecili(null);
    } else {
      setBittiMi(true);
    }
  };

  if (bittiMi) {
    return (
      <div className="ortu">
        <div className="rozet">🔥</div>
        <h2 className="baslik">Tarihin Kapısı tamamlandı</h2>
        <p className="alt-yazi">
          {dogruSayisi} / {SORULAR.length} doğru · {bulunan.length} / {toplamKesif} keşif
        </p>
        <p className="alt-yazi">
          Geçmişi anlamanın yolu izlere bakmaktan, soru sormaktan ve
          bilmediğini kabul etmekten geçer. Bunu öğrendin.
        </p>
        <button className="ana-dugme buyuk" onClick={bitir}>Bölümü Kapat 🧰</button>
      </div>
    );
  }

  return (
    <div className="ortu">
      <div className="sinav-kutu">
        <div className="sinav-ust">Final Değerlendirmesi · {adim + 1}/{SORULAR.length}</div>
        <h2 className="gorev-soru">{s.soru}</h2>
        <div className="secenekler">
          {s.secenekler.map((o, i) => (
            <button
              key={i}
              className={`secenek ${secili === i ? (o.dogru ? "dogru" : "yanlis") : ""}`}
              onClick={() => sec(i)}
              disabled={secili !== null}
            >
              {o.metin}
            </button>
          ))}
        </div>
        {secili !== null && (
          <>
            <p className={`geri-bildirim ${s.secenekler[secili].dogru ? "olumlu" : "olumsuz"}`}>
              {s.secenekler[secili].aciklama}
            </p>
            <button className="ana-dugme" onClick={ilerle}>
              {adim + 1 < SORULAR.length ? "Sonraki Soru →" : "Sonucu Gör"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
