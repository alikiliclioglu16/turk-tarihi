"use client";

import { useOyun } from "@/lib/store";
import { bonusKesifBul, BONUS_TOPLAM } from "@/lib/bonusKesifler";
import { DedeYuz } from "./DedeYuz";

/** Bonus keşif bulunduğunda açılan küçük bilgi kartı */
export function BonusPanel() {
  const aktifId = useOyun((s) => s.aktifBonusId);
  const kapat = useOyun((s) => s.bonusKapat);
  const bulunan = useOyun((s) => s.bulunanBonuslar);
  if (!aktifId) return null;
  const b = bonusKesifBul(aktifId);
  if (!b) return null;

  return (
    <div className="alt-panel">
      <div className="panel bonus-panel">
        <div className="anlatan">
          <DedeYuz boyut={36} />
          <div style={{ flex: 1 }}>
            <div className="anlatan-ad">✨ {b.ad}</div>
            <div className="anlatan-yer">
              Meraklı Gözler · {bulunan.length}/{BONUS_TOPLAM}
            </div>
          </div>
        </div>
        <p className="anlati-metin kucuk">{b.metin}</p>
        <button className="ana-dugme" onClick={kapat}>Devam Et</button>
      </div>
    </div>
  );
}

/** Üst şeritte gösterilen sayaç */
export function BonusSayac() {
  const bulunan = useOyun((s) => s.bulunanBonuslar);
  return (
    <span className="bonus-sayac" title="Meraklı Gözler — obada bulunabilecek keşifler">
      ✨ {bulunan.length}/{BONUS_TOPLAM}
    </span>
  );
}
