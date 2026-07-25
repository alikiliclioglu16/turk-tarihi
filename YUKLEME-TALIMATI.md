# Güncelleme: Dede Korkut Poz Seti

**Bu klasörde yalnızca değişen dosyalar var.** Diğer hiçbir dosyaya dokunmayın.

---

## GitHub'a nasıl yükleyeceksiniz

Bu klasörün içindeki yapı, deponuzdaki yapıyla **birebir aynı**. Her dosyayı
kendi klasörüne koyacaksınız; GitHub aynı adlı dosyaların üzerine yazar.

### Yol 1 — Toplu (önerilen, tek seferde)

1. GitHub'da deponuzu açın: `alikiliclioglu16/turk-tarihi`
2. **Add file → Upload files**
3. Bu klasörün içindeki **`public`, `lib`, `components`, `app`** klasörlerinin
   dördünü birden sürükleyip bırakın.
4. Altta "ilk poz seti" yazıp **Commit changes**.

GitHub klasör yapısını koruyarak yükler ve aynı adlı dosyaların üzerine yazar.
Vercel 2 dakika içinde siteyi kendiliğinden günceller.

### Yol 2 — Tek tek

Aşağıdaki 12 dosyayı ilgili klasörlere yükleyin:

| Dosya | Depodaki yeri |
|---|---|
| 8 adet `.webp` | `public/assets/d01/characters/dede-korkut/` |
| `manifest.ts` | `lib/` |
| `pozSecici.ts` | `lib/` *(yeni dosya)* |
| `DedeKorkutGuide.tsx` | `components/discovery2d/` |
| `page.tsx` | `app/d01/` |
| `globals.css` | `app/` |

---

## Ne değişti

**Yeni:** `lib/pozSecici.ts` — hangi anlatı durumunda hangi pozun görüneceğine
karar veren tek merkez. Bileşenler artık poz seçmiyor, yalnız çiziyor.

**Güncellendi:**
- `lib/manifest.ts` — 8 poz `hazir: true` olarak bağlandı, yollar
  `assets/d01/characters/dede-korkut/` olarak düzeltildi.
- `components/discovery2d/DedeKorkutGuide.tsx` — `poseId`, `side`, `visible`,
  `ariaLabel`, `className` props'ları; 220 ms crossfade; `object-fit: contain`.
- `app/d01/page.tsx` — poz seçimi merkezi modüle bağlandı.
- `app/globals.css` — poz geçiş animasyonu, oran koruma, mobil yükseklik sınırı.

---

## Poz eşlemesi

| Durum | Poz |
|---|---|
| Durağa davet, ilk anlatı bloğu | `01_karsilama` |
| main_a / main_b anlatıları | `02_anlatma` |
| Bir hotspot incelenirken | `03_isaret` |
| Görev açıldığında | `04_dusunme` |
| Keşif sırasında beklerken | `05_dinleme` |
| Doğru cevap, kart ödülü | `06_onay` |
| Yanlış cevap, ipucu | `07_yonlendirme` |
| Kapanış, bölüm sonu | `08_veda` |

E�lemeyi değiştirmek isterseniz tek dosya: `lib/pozSecici.ts` içindeki `pozSec`.

---

## Kontrol listesi (yükledikten sonra)

- [ ] `/d01` açılıyor
- [ ] Dede Korkut görseli çıkıyor (SVG yer tutucu değil)
- [ ] Durak başında karşılama, anlatırken anlatma pozu geliyor
- [ ] Hotspota dokununca işaret pozuna geçiyor, geçiş yumuşak
- [ ] Yanlış cevapta yönlendirme, doğru cevapta onay pozu
- [ ] Mobilde karakter ekranı boğmuyor, kırpılmıyor
