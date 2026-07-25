# D01 — 3B Dünya + Boyalı Karakter (Hibrit)

**Ancient Egypt modu:** gerçek 3B dünyada yürüyorsunuz; karakter ve nesneler
ChatGPT'nin boyadığı yüksek kaliteli 2B görsellerden geliyor.

## Neden hibrit

| Katman | Nerede çözülüyor |
|---|---|
| **Varlık kalitesi** (eski darboğaz) | ChatGPT'nin 2B çizimleri — GLB üretimine gerek yok |
| **Render teknolojisi** | Gerçek 3B: PCSS gölge, N8AO, IBL, hacimsel sis |
| **Sinematografi** | Bloom, gece renk derecelendirmesi, gren, kromatik sapma, alan derinliği, kamera nefesi |

3B'nin derinliği ve gezinme özgürlüğü + 2B'nin sanat kalitesi. GLB üretim
darboğazı tamamen ortadan kalkıyor.

## Kurulum

```bash
npm install
npm run dev
```

## Karakter nasıl çalışıyor

`components/scene/models/DedeKorkutBillboard.tsx`

Boyalı poz, 3B dünyada dik duran bir düzleme uygulanır ve kameraya döner
(billboard tekniği). Karakter sahnenin ışığını alır, zemine gölge düşürür,
derinlikte doğru yerde durur. Yürürken adım ritmi, dururken nefes hareketi
uygulanır. Poz, oyun durumuna göre `lib/pozSecici.ts` tarafından seçilir ve
geçişte yumuşak solma olur.

## Nesneleri de boyalı görsele çevirmek

Aynı teknik hotspot nesneleri için de kullanılabilir. ChatGPT'den şeffaf
WebP geldiğinde `components/scene/AssetModel.tsx` içindeki prosedürel
modelin yerine billboard konur — dosya yolu `lib/assets.ts`'ten okunur.

## Sinematik ayarlar

`SINEMATIK-AYARLAR.md` dosyasına bakın: hangi efektin hangi dosyada
ayarlandığı ve performans düşerse neyi hangi sırayla kapatacağınız yazılı.
