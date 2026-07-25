/**
 * DEDE KORKUT POZ SEÇİCİ — tek merkez
 *
 * Hangi anlatı durumunda hangi pozun gösterileceği yalnızca burada kararlaştırılır.
 * Bileşenler poz seçmez; yalnız verilen pozu çizer.
 *
 * Eşleme, ChatGPT'nin poz paketindeki kullanım tanımlarına birebir uyar.
 */

export type PozId =
  | "pose_01_karsilama"
  | "pose_02_anlatma"
  | "pose_03_isaret"
  | "pose_04_dusunme"
  | "pose_05_dinleme"
  | "pose_06_onay"
  | "pose_07_yonlendirme"
  | "pose_08_veda";

export const VARSAYILAN_POZ: PozId = "pose_01_karsilama";

export interface PozDurumu {
  faz: string;
  /** anlatı bloğunun sırası (0 = intro) */
  anlatiIndex: number;
  /** keşif sırasında bir hotspot açık mı */
  hotspotAcik: boolean;
  /** görevde ipucu görünüyor mu */
  ipucuVar: boolean;
  /** son cevap doğru muydu (görev fazında) */
  sonCevapDogru: boolean | null;
}

export function pozSec(d: PozDurumu): PozId {
  switch (d.faz) {
    case "gezinti":
      return "pose_01_karsilama";

    case "anlati":
      // ilk blok karşılama, sonrakiler anlatma
      return d.anlatiIndex === 0 ? "pose_01_karsilama" : "pose_02_anlatma";

    case "kesif":
      // bir nesne incelenirken işaret ediyor, boştayken bekliyor
      return d.hotspotAcik ? "pose_03_isaret" : "pose_05_dinleme";

    case "gorev":
      if (d.ipucuVar) return "pose_07_yonlendirme";
      if (d.sonCevapDogru === false) return "pose_07_yonlendirme";
      if (d.sonCevapDogru === true) return "pose_06_onay";
      return "pose_04_dusunme";

    case "odul":
      return "pose_06_onay";

    case "kapanis":
      return "pose_08_veda";

    case "bolumBitti":
      return "pose_08_veda";

    default:
      return VARSAYILAN_POZ;
  }
}

/** Poz için ekran okuyucu açıklaması */
export const POZ_ACIKLAMA: Record<PozId, string> = {
  pose_01_karsilama: "Dede Korkut seni karşılıyor",
  pose_02_anlatma: "Dede Korkut anlatıyor",
  pose_03_isaret: "Dede Korkut bir şeyi işaret ediyor",
  pose_04_dusunme: "Dede Korkut düşünmeye çağırıyor",
  pose_05_dinleme: "Dede Korkut bekliyor",
  pose_06_onay: "Dede Korkut onaylıyor",
  pose_07_yonlendirme: "Dede Korkut yol gösteriyor",
  pose_08_veda: "Dede Korkut uğurluyor",
};
