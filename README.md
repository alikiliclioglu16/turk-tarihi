# Dede Korkut ile Türk Tarihi Discovery Tour
## D01 — 2.5D Sahne Motoru · Sprint 1 Dikey Kesit

Model A: **ChatGPT** içerik, veri ve 2B görselleri üretir · **Claude** motoru ve kodu kurar.

---

## Kurulum

```bash
npm install
npm run dev
```

`http://localhost:3000` → "Keşfe Başla"

---

## Kabul kriterleri — durum

| # | Kriter | Durum |
|---|---|---|
| 1 | `/d01` route'u çalışır | ✅ |
| 2 | `d01-node-01.json` doğrudan okunur | ✅ |
| 3 | intro → main_a → main_b akışı | ✅ |
| 4 | Üç required hotspot tamamlanmadan görev açılmaz | ✅ |
| 5 | Doğru/yanlış feedback + 2. ve 4. deneme ipuçları | ✅ |
| 6 | Kart kazanılır | ✅ |
| 7 | Progress sayfa yenilemesinde korunur | ✅ |
| 8 | Masaüstü ve mobil düzen | ✅ |
| 9 | Node 02 eklemek bileşen değiştirmez | ✅ |
| 10 | Statik worksheet değil; keşif hissi | ✅ |

Node 02 ve 03 de yüklü ve oynanabilir (eşleştirme + sınıflandırma görevleri).

---

## Mimari

```
app/d01/page.tsx              Faz yönetimi — hangi fazda hangi bileşen
components/discovery2d/
  DiscoveryStage2D.tsx        Katmanlı sahne, parallax, kamera pan/zoom
  ParallaxLayer.tsx           Tek derinlik katmanı
  Hotspot2D.tsx               Etkileşim nesnesi (klavye erişimli)
  DedeKorkutGuide.tsx         Poz + anlatı + altyazı + tekrar dinle
  QuestEngine.tsx             Tüm görev tipleri, JSON'dan
  HintController.tsx          2./4. deneme ipuçları
  HistoryCardReward.tsx       Kart ödülü
  NodeProgress.tsx            Üst şerit ve erişilebilirlik anahtarları
  Efektler.tsx                Canvas 2D kıvılcım ve ocak parıltısı
  Placeholder.tsx             Görsel gelmeden önceki kontrollü yer tutucular
lib/
  manifest.ts                 TÜM görsel yolları burada — bileşene gömülü yok
  koordinat.ts                3B JSON koordinatı → 2B sahne yüzdesi adapteri
  store.ts                    Faz makinesi
  audio.ts                    Anlatı + ambiyans
  progress.ts                 localStorage (Supabase'e taşınabilir arayüz)
public/
  data/d01/                   Node JSON'ları
  assets/d01/zones|hotspots|dede-korkut|cards|ui
```

**Faz makinesi:** `gezinti → anlati → kesif → gorev → odul → kapanis → (sonraki) → bolumBitti`

---

## GÖRSEL EKLEME — ChatGPT teslimleri buraya

Her görsel için **iki adım**, kod değişikliği yok:

1. Dosyayı doğru klasöre koyun (aşağıdaki tabloya bakın).
2. `lib/manifest.ts` içinde ilgili kaydın `hazir: false` → `hazir: true` yapın.

| Varlık | Klasör | Beklenen dosya adı |
|---|---|---|
| Bölge gökyüzü | `public/assets/d01/zones/oba/` | `d01_zone_oba_sky.webp` |
| Bölge arka planı | aynı | `d01_zone_oba_bg.webp` |
| Orta plan | aynı | `d01_zone_oba_mid.webp` |
| Yakın orta plan | aynı | `d01_zone_oba_mid2.webp` |
| Ön plan | aynı | `d01_zone_oba_fg.webp` |
| Hotspot nesnesi | `public/assets/d01/hotspots/` | `d01_n01_hs_kopuz.webp` |
| Dede Korkut pozu | `public/assets/d01/dede-korkut/` | `dede_korkut_idle.webp` |
| Kart | `public/assets/d01/cards/` | `d01_card_01.webp` |

Manifestte tanımlı **tüm** dosya adları `lib/manifest.ts` içinde listelidir; ChatGPT'ye
üretim yaparken o dosyayı referans verin.

**Sahne katmanları:** 2560×1440, gökyüzü opak, diğerleri şeffaf PNG/WebP.
**Hotspot nesneleri:** 1024×1024 veya 1536×1536, şeffaf, sahneyle aynı ışık yönü.
**Dede Korkut:** 1536×2048, şeffaf, tam boy.

Görsel yoksa sahne çökmez; SVG yer tutucu gösterilir.

---

## Hotspot konumlandırma

Node JSON'ları 3B koordinatlarla yazıldı. `lib/koordinat.ts` bunları otomatik
olarak sahne yüzdesine çevirir. Bir hotspot yanlış yerde duruyorsa iki seçenek:

**A)** JSON'a opsiyonel `visual` alanı ekleyin (şema bozulmaz):
```json
"visual": {
  "hotspots": { "hs_kopuz": { "x": 68, "y": 74 } },
  "camera": { "x": 60, "y": 70, "zoom": 1.25 }
}
```

**B)** `lib/koordinat.ts` içindeki `BOLGE_SINIRLARI` değerlerini ayarlayın.

---

## Erişilebilirlik

Altyazı varsayılan açık (üst şeritten kapatılabilir) · tekrar dinle düğmesi ·
klavyeyle hotspot gezinme (Tab + Enter) · `prefers-reduced-motion` desteği
(parallax ve daktilo efekti kapanır) · durum hiçbir yerde yalnız renkle
bildirilmez (ikon + metin) · tüm etkileşimli öğelerde ARIA etiketi.

---

## Notlar

- R3F ve 3B sahne kritik yoldan çıkarıldı. Eski 3B kodu bu pakette yok;
  ileride tekil kahraman nesne için isteğe bağlı eklenebilir.
- Hesap sistemi ve kişisel veri toplama yok; ilerleme yalnız cihazda, anonim.
