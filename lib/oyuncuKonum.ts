/**
 * Oyuncunun anlık dünya konumu ve baktığı yön.
 * Ayrıca kameranın geçici olarak odaklanacağı nokta.
 */
export const oyuncuKonumu = { x: 0, y: 0, z: 12, aci: Math.PI };

/**
 * KEŞİF ODAĞI
 * Bir keşif noktası açıldığında kamera kısa bir yay çizerek o nesneye
 * bakar. `guc` 0→1 yükselir, sonra 1→0 iner.
 */
export const kameraOdak = {
  aktif: false,
  x: 0, y: 0, z: 0,
  guc: 0,
  baslangic: 0,
};

export function kameraOdaklan(x: number, y: number, z: number): void {
  kameraOdak.aktif = true;
  kameraOdak.x = x;
  kameraOdak.y = y;
  kameraOdak.z = z;
  kameraOdak.baslangic = performance.now();
}

export function kameraOdakBirak(): void {
  kameraOdak.aktif = false;
}
