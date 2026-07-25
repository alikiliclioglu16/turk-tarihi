/**
 * Arazi yüksekliği. Zemin mesh'i ve oyuncu kontrolcüsü AYNI fonksiyonu
 * kullanır; böylece karakter hiçbir zaman zemine gömülmez veya havada kalmaz.
 */
export function araziYukseklik(x: number, z: number): number {
  const d = Math.sqrt(x * x + z * z);
  const kampDuzlugu = Math.max(0, 1 - d / 16); // kamp alanı düz kalsın
  const tepe =
    Math.sin(x * 0.07) * Math.cos(z * 0.055) * 1.9 +
    Math.sin(x * 0.19 + 3.0) * Math.sin(z * 0.15) * 0.8;
  return tepe * (1 - kampDuzlugu);
}

/** Dünya sınırı (metre). D01 planı: ~250x250 m */
export const DUNYA_YARICAP = 120;
