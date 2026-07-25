# Dede Korkut ile Türk Tarihi Discovery Tour
## Teknik Görev Paketi 1.1 — D01 Oynanabilir Omurga + Görsel Yükseltme

Bu paket, D01 bölümünün **oynanabilir çekirdeğidir**. Tam ürün değil; üzerine
varlıkların, durakların ve seslerin eklendiği çalışan iskelet.

---

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` açın → "Keşfe Başla".

**Kontroller:** Ok tuşları veya WASD ile yürüyün · fareyle sürükleyerek kamerayı
çevirin · dokunmatik cihazlarda sol alttaki joystick.

---

## Bu pakette çalışan şeyler

| Sistem | Durum |
|---|---|
| Dönem haritası, D01 kilidi ve ilerleme göstergesi | ✅ |
| React Three Fiber sahnesi, gece gökyüzü, ay, ocak ateşi | ✅ |
| Yükselti fonksiyonlu arazi (karakter araziyi takip eder) | ✅ |
| Üçüncü şahıs Dede Korkut kontrolcüsü + takip kamerası | ✅ |
| Klavye + fare + mobil joystick | ✅ |
| GLB yükleme altyapısı (greybox yedekli) | ✅ |
| JSON'dan beslenen durak sistemi | ✅ |
| Işık sütunlu hedef gösterimi ve yakınlık tetikleyicisi | ✅ |
| Anlatı paneli (daktilo efekti, atlanabilir) | ✅ |
| Hotspot keşif sistemi ve zorunlu nokta kontrolü | ✅ |
| Görev paneli — `secim` tipi tam çalışır | ✅ |
| Kademeli ipucu (2. ve 4. deneme) | ✅ |
| Kart ödülü ve kapanış repliği | ✅ |
| Yerel ilerleme kaydı (localStorage) | ✅ |
| Prosedürel detaylı modeller (otağ, ocak, sandık, balbal, kopuz) | ✅ |
| Bloom, ACES ton eşleme, vinyet (sinematik katman) | ✅ |
| Kıvılcım, duman, ot, kaya, dağ silüetleri | ✅ |
| Eşleştirme / çoklu seçim görev tipi | ✅ |
| 2. durak (Ocak Ateşi ve Oba) | ✅ |
| Ses oynatma | ⏳ Paket 4 |
| Kalan görev tipleri (sırala, sınıflandır, bağlantı) | ⏳ Paket 5 |
| Supabase senkronizasyonu | ⏳ Paket 6 |

---

## Yeni durak eklemek

1. ChatGPT'nin ürettiği JSON'u `public/data/d01/d01-node-02.json` olarak kaydedin.
2. `app/d01/page.tsx` içindeki `NODE_DOSYALARI` listesine dosya yolunu ekleyin.

Kod değişikliği gerekmez. Duraklar `order` alanına göre otomatik sıralanır.

---

## GLB varlık eklemek

Bir model hazır olduğunda:

1. Dosyayı `public/assets/d01/` klasörüne koyun (örn. `a02_kopuz.glb`).
2. `lib/assets.ts` içindeki ilgili kaydı güncelleyin:

```ts
A02: {
  kod: "A02", ad: "Kopuz",
  path: "/assets/d01/a02_kopuz.glb",   // ← dosya yolu
  hazir: true,                          // ← false yerine true
  greybox: { ... }                      // dokunmayın, yedek olarak kalsın
},
```

Sahne otomatik olarak greybox yerine gerçek modeli yükler. Model yüklenemezse
greybox'a düşer — yani hiçbir zaman boş ekran görmezsiniz.

**Varlığın sahnedeki yeri** `lib/assets.ts` içindeki `D01_YERLESIM` dizisinden
ayarlanır. Konumlar metre cinsindendir; ateş `[0,0,0]` noktasındadır.

---

## Klasör düzeni

```
app/
  page.tsx              Dönem haritası
  d01/page.tsx          D01 bölümü — faz yönetimi burada
  globals.css           Tüm stiller ve renk değişkenleri
components/
  scene/                3B: arazi, karakter, atmosfer, hotspot, varlık yükleyici
  ui/                   2B: anlatı, görev, kart, HUD, joystick
lib/
  types.ts              Tur veri şemasının TypeScript karşılığı
  store.ts              Oyun akışı (zustand) — faz makinesi burada
  terrain.ts            Arazi yükseklik fonksiyonu (sahne + oyuncu ortak kullanır)
  assets.ts             Varlık kayıt defteri ve yerleşim planı
  input.ts              Klavye/joystick girdisi (React state dışında)
  progress.ts           Yerel ilerleme kaydı
public/
  data/d01/             Durak JSON dosyaları
  assets/d01/           GLB modeller (şimdilik boş)
  audio/d01/            Ses dosyaları (şimdilik boş)
```

---

## Faz makinesi

Bölüm akışı `lib/store.ts` içinde tek yerden yönetilir:

```
gezinti → anlati → kesif → gorev → odul → kapanis → (sonraki durak) → bolumBitti
```

Her fazda hangi panelin görüneceği `app/d01/page.tsx` içinde belirlenir.
Yeni bir faz eklemek gerekirse tek değişiklik noktası bu ikilidir.

---

## Notlar

- Faz 0'da hesap sistemi ve kişisel veri toplama **yoktur**. İlerleme yalnızca
  kullanıcının cihazında, anonim olarak tutulur.
- Olay kayıtları geliştirme modunda yalnız konsola yazılır (`lib/progress.ts`).
- Karakter ve tüm nesneler şu an greybox'tır; görsel değerlendirme için
  değil, ölçek ve oynanış testi içindir.
