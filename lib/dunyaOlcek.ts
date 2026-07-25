/**
 * DÜNYA ÖLÇEĞİ
 *
 * Node JSON'larındaki koordinatlar ~160×180 metrelik bir dünya tanımlıyordu;
 * bu, yürüyerek 2 dakikada bitiyordu. ChatGPT'nin entegrasyon notu greybox
 * sonrası koordinat kalibrasyonuna izin veriyor.
 *
 * Bu çarpan tüm dünya koordinatlarına uygulanır: node konumları, hotspotlar,
 * bonus keşifler, arazi kontrol noktaları ve varlık yerleşimi.
 * JSON dosyalarına DOKUNULMAZ — dönüşüm yükleme anında yapılır.
 *
 * 4.2 → dünya ~630×710 m; duraklar arası yürüyüş ~1450 m (≈5.5 dk),
 * oba mahalleleriyle birlikte toplam gezinme 9–11 dakika.
 */
export const DUNYA_OLCEK = 4.2;

export function olcekle(p: [number, number, number]): [number, number, number] {
  return [p[0] * DUNYA_OLCEK, p[1] * DUNYA_OLCEK, p[2] * DUNYA_OLCEK];
}
