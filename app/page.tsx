"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ilerlemeYukle } from "@/lib/progress";

const DONEMLER = [
  { id: "d01", ad: "Tarihin Kapısı", alt: "Tarih nedir, hatıra nedir?", ikon: "🔥" },
  { id: "d02", ad: "Bozkırın Ufku", alt: "İlk Türkler ve bozkır hayatı", ikon: "🐎" },
  { id: "d03", ad: "Göktürk Yolu", alt: "Yazıtlar ve devlet geleneği", ikon: "🪨" },
  { id: "d04", ad: "Uygur Şehri", alt: "Yazı, sanat ve ticaret", ikon: "🏮" },
];

export default function Harita() {
  const [acik, setAcik] = useState<string[]>(["d01"]);
  const [tamam, setTamam] = useState<string[]>([]);

  useEffect(() => {
    const k = ilerlemeYukle();
    setAcik(k.acikDonemler);
    setTamam(k.tamamlananNodlar);
  }, []);

  return (
    <main className="harita">
      <header className="harita-ust">
        <div className="marka-kucuk">Dede Korkut ile</div>
        <h1 className="marka-buyuk">Türk Tarihi Discovery Tour</h1>
      </header>

      <div className="donem-listesi">
        {DONEMLER.map((d, i) => {
          const acikMi = acik.includes(d.id);
          const kod = `D${String(i + 1).padStart(2, "0")}`;
          return (
            <div key={d.id} className={`donem ${acikMi ? "acik" : "kilitli"}`}>
              <div className="donem-ikon">{acikMi ? d.ikon : "🔒"}</div>
              <div className="donem-bilgi">
                <div className="donem-kod">{kod}</div>
                <div className="donem-ad">{acikMi ? d.ad : "Sisli Topraklar"}</div>
                <div className="donem-alt">{acikMi ? d.alt : "Önceki dönemi tamamla"}</div>
                {d.id === "d01" && tamam.length > 0 && (
                  <div className="donem-alt">{tamam.length} durak tamamlandı</div>
                )}
              </div>
              {d.id === "d01" && (
                <Link className="ana-dugme kucuk" href="/d01">
                  {tamam.length > 0 ? "Devam Et" : "Keşfe Başla"}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <footer className="harita-alt">Faz 0 · Teknik Paket 1 · greybox varlıklarla</footer>
    </main>
  );
}
