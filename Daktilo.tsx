"use client";

import { useOyun } from "@/lib/store";
import { DedeYuz } from "./DedeYuz";

/** Oba halkına dokununca açılan kısa kültür notu */
export function KisiPanel() {
  const bilgi = useOyun((s) => s.kisiBilgi);
  const kapat = useOyun((s) => s.kisiBilgiKapat);
  if (!bilgi) return null;

  return (
    <div className="alt-panel">
      <div className="panel kisi-panel">
        <div className="anlatan">
          <DedeYuz boyut={34} />
          <div style={{ flex: 1 }}>
            <div className="anlatan-ad">👤 {bilgi.ad}</div>
            <div className="anlatan-yer">Oba hayatı</div>
          </div>
        </div>
        <p className="anlati-metin kucuk">{bilgi.metin}</p>
        <button className="ana-dugme" onClick={kapat}>Devam Et</button>
      </div>
    </div>
  );
}
