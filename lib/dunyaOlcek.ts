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
 * 2.9 → duraklar arası rota ~1000 m (koşuyla ~2 dk). Bölgeler
 * birbirine yakın, aralar boş kalmıyor.
 * oba mahalleleriyle birlikte toplam gezinme 9–11 dakika.
 */
export const DUNYA_OLCEK = 4.0;

export function olcekle(p: [number, number, number]): [number, number, number] {
  return [p[0] * DUNYA_OLCEK, p[1] * DUNYA_OLCEK, p[2] * DUNYA_OLCEK];
}
