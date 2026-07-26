"use client";

import { useOyun } from "@/lib/store";
import { pozSec } from "@/lib/pozSecici";

const POZ_DOSYA: Record<string, string> = {
  pose_01_karsilama: "/assets/d01/characters/dede-korkut/dedekorkut_pose_01_karsilama.webp",
  pose_02_anlatma: "/assets/d01/characters/dede-korkut/dedekorkut_pose_02_anlatma.webp",
  pose_03_isaret: "/assets/d01/characters/dede-korkut/dedekorkut_pose_03_isaret.webp",
  pose_04_dusunme: "/assets/d01/characters/dede-korkut/dedekorkut_pose_04_dusunme.webp",
  pose_05_dinleme: "/assets/d01/characters/dede-korkut/dedekorkut_pose_05_dinleme.webp",
  pose_06_onay: "/assets/d01/characters/dede-korkut/dedekorkut_pose_06_onay.webp",
  pose_07_yonlendirme: "/assets/d01/characters/dede-korkut/dedekorkut_pose_07_yonlendirme.webp",
  pose_08_veda: "/assets/d01/characters/dede-korkut/dedekorkut_pose_08_veda.webp",
};

/**
 * ANLATICI PORTRESİ
 *
 * Dede Korkut artık dünyada yürümüyor — dış ses anlatıcıdır.
 * Boyalı pozlar burada, anlatı panelinin yanında kullanılıyor;
 * anlatının durumuna göre pozu değişir.
 */
export function DedeYuz({ boyut = 96 }: { boyut?: number }) {
  const faz = useOyun((s) => s.faz);
  const anlatiIndex = useOyun((s) => s.anlatiIndex);
  const aktifHotspotId = useOyun((s) => s.aktifHotspotId);
  const ipucu = useOyun((s) => s.ipucu);

  const poz = pozSec({
    faz, anlatiIndex,
    hotspotAcik: Boolean(aktifHotspotId),
    ipucuVar: Boolean(ipucu),
    sonCevapDogru: null,
  });
  const yol = POZ_DOSYA[poz];

  return (
    <div className="anlatici-portre" style={{ width: boyut, height: boyut * 1.28 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={poz} src={yol} alt="Dede Korkut" className="anlatici-img" />
    </div>
  );
}
