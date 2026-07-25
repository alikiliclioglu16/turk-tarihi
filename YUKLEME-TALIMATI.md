# TEMİZ KURULUM — Depoyu Sıfırlayıp Bu Paketi Yükleyin

Önceki deploy'ların hata vermesinin iki sebebi vardı:

1. Güncelleme zip'inin **dış klasörü** olduğu gibi yüklendi → depoda
   `GUNCELLEME-oba-buyume/app/...` diye iç içe bir kopya oluştu.
2. 2.5D denemesinden kalan dosyalar (`components/discovery2d/`) hâlâ
   depodaydı ve artık var olmayan dosyaları çağırıyordu.

Bu paket **eksiksiz ve derlenmiş** bir projedir. Depoyu sıfırlayıp bunu
yüklemek, dosya dosya temizlemekten çok daha hızlı ve güvenli.

---

## ADIM 1 — Eski depoyu temizleyin

**En hızlı yol:** GitHub'da deponuzu açın, klavyeden **nokta tuşuna ( . )**
basın. Tarayıcıda bir kod editörü açılır. Sol taraftaki dosya listesinden
**tüm klasörleri seçip silin** (sağ tık → Delete). Sonra sol üstteki kaynak
kontrol simgesinden değişikliği **Commit** edin.

**Alternatif:** Yeni bir depo oluşturun (`turk-tarihi-v2` gibi) ve Vercel'de
projeyi yeni depoya bağlayın. Eski depoya hiç dokunmazsınız.

---

## ADIM 2 — Bu paketi yükleyin

Zip'i açın. İçinde şunları göreceksiniz:

```
app/          components/     lib/          public/
package.json  package-lock.json
next.config.mjs   tsconfig.json   next-env.d.ts
README.md     SINEMATIK-AYARLAR.md
```

GitHub → **Add file → Upload files** → **bu dosya ve klasörlerin hepsini**
seçip sürükleyin → **Commit changes**.

### ⚠️ En sık yapılan hata

| ❌ Yanlış | ✅ Doğru |
|---|---|
| Zip'in dış klasörünü sürüklemek | Dış klasörün **içindekileri** sürüklemek |
| Depoda `dk-3d-hibrit/app/...` oluşur | Depoda `app/...` oluşur |

Deponun ana sayfasında `app`, `components`, `lib`, `public` ve
`package.json` **doğrudan görünmeli**. Araya başka bir klasör adı girmemeli.

---

## ADIM 3 — Vercel ayarını kontrol edin

Settings → Build and Deployment → **Framework Preset = Next.js** olmalı.
(Daha önce "Other" ayarlıydı, düzelttiniz — yeni depo açarsanız tekrar bakın.)

---

## Bu pakette ne var

- 3B dünya: arazi, gece gökyüzü, ay, ocak ateşi, kıvılcım, duman, sis
- **Boyalı Dede Korkut** — 8 poz, normal haritalı, ışığa tepki veren
- Büyütülmüş oba: 4 otağ, tuğ direği, ağıl ve koyunlar, kağnı, dokuma
  tezgâhı, kurutma sehpası, odun yığınları, tulum sehpası, mızrak rafı
- **Meraklı Gözler:** 8 bonus keşif + sayaç
- 3 durak (kopuz · ocak · sandık) tam oynanabilir
- Sinematik katman: PCSS gölge, N8AO, IBL, bloom, gece renk derecelendirmesi,
  film greni, kromatik sapma, alan derinliği, kamera nefesi
- Ses: sentez ambiyans + gerçek kayıt desteği
- Yerel ilerleme kaydı

## Bundan sonraki güncellemeler

Node 04–10 JSON'ları geldiğinde delta paketler göndereceğim. Onlarda da
aynı kural: **dış klasörü değil, içindekileri yükleyin.**
