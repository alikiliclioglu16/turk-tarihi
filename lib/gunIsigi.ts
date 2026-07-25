/**
 * GÜN IŞIĞI — öğlen 13:00
 *
 * Sahne geceden gündüze alındı. Öğlen güneşi yüksekte ve hafif batıya
 * kaymış durumda; gölgeler kısa ve keskin, gökyüzü açık mavi, ufukta
 * sıcak pus var. Discovery Tour'un Mısır sahnelerindeki aydınlık,
 * ferah ve keşfe davet eden his buradan gelir.
 */

/** Güneşin konumu — 13:00, yaz, orta kuşak */
export const GUNES_YUKSEKLIK = 62;     // derece
export const GUNES_ACI = 205;          // derece (güneybatıya hafif kaymış)
export const GUNES_UZAKLIK = 400;

export function gunesKonumu(): [number, number, number] {
  const y = (GUNES_YUKSEKLIK * Math.PI) / 180;
  const a = (GUNES_ACI * Math.PI) / 180;
  return [
    Math.cos(y) * Math.sin(a) * GUNES_UZAKLIK,
    Math.sin(y) * GUNES_UZAKLIK,
    Math.cos(y) * Math.cos(a) * GUNES_UZAKLIK,
  ];
}

export const GUN = {
  gokUst: "#3E7CC4",
  gokOrta: "#8FBFE4",
  gokUfuk: "#DCD6BE",
  gunesRenk: "#FFF4DC",
  gunesGuc: 3.1,
  gokIsigiUst: "#9CC4EA",
  gokIsigiZemin: "#C2A97E",
  gokIsigiGuc: 1.05,
  sisRenk: "#C8CBB8",
  sisYogunluk: 0.0016,
  pozlama: 1.0,
};
