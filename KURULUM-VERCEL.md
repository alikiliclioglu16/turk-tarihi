# Node.js Kurmadan Yayına Alma — GitHub + Vercel

**Kısa cevap: evet, bilgisayarınıza hiçbir şey kurmadan çalıştırabilirsiniz.**

Node.js aslında bu projenin yazıldığı dil ortamı — ondan kaçış yok. Ama onu
*sizin bilgisayarınızda* çalıştırmak zorunda değilsiniz. Vercel'in sunucuları
Node.js'i sizin adınıza çalıştırır. Siz sadece dosyaları GitHub'a koyarsınız.

Sonuç: projeye internetten erişilebilen bir adres (`...vercel.app`), telefondan
bile açabilirsiniz, ekibinize link atabilirsiniz.

---

## Adım 1 — GitHub hesabı ve depo

1. [github.com](https://github.com) → **Sign up** (ücretsiz).
2. Giriş yaptıktan sonra sağ üstteki **+** → **New repository**.
3. **Repository name:** `dede-korkut-tour`
4. **Private** seçin (proje şimdilik size özel kalsın).
5. **Create repository** deyin.

## Adım 2 — Dosyaları yükleyin (sürükle-bırak)

Açılan sayfada **"uploading an existing file"** bağlantısına tıklayın.

`dk` klasörünü açın, **içindeki her şeyi** seçin (Ctrl+A) ve tarayıcı
penceresine sürükleyin.

> ⚠️ `dk` klasörünün kendisini değil, **içindekileri** yükleyin. Yani
> `app`, `components`, `lib`, `public`, `package.json` en üst seviyede olmalı.

> ⚠️ İçinde `node_modules` klasörü **varsa yüklemeyin** — çok büyüktür ve
> gereksizdir. Zaten gönderdiğim pakette yok.

Aşağıdaki kutuya "ilk yükleme" yazıp **Commit changes** deyin.

## Adım 3 — Vercel'e bağlayın

1. [vercel.com](https://vercel.com) → **Sign up** → **Continue with GitHub**.
2. **Add New** → **Project**.
3. `dede-korkut-tour` deposunu bulun → **Import**.
4. Hiçbir ayarı değiştirmeyin (Vercel Next.js'i tanır) → **Deploy**.

2-3 dakika bekleyin. Bittiğinde `https://dede-korkut-tour.vercel.app` gibi bir
adres verilir. Açın — proje çalışıyor.

## Adım 4 — Bundan sonrası

Yeni bir dosya eklemek (JSON durak, GLB model, ses kaydı) için:

1. GitHub'da deponuza gidin.
2. İlgili klasöre girin (örn. `public` → `data` → `d01`).
3. **Add file** → **Upload files** → dosyayı sürükleyin → **Commit changes**.

Vercel bunu otomatik görür ve 2 dakika içinde siteyi kendiliğinden günceller.
Hiçbir komut yazmanıza gerek yok.

---

## Supabase ne zaman devreye girecek?

Şimdi değil. Supabase, kullanıcı hesapları ve cihazlar arası ilerleme kaydı
için gerekli — bu **Paket 6**. Şu an ilerleme zaten tarayıcıda saklanıyor ve
Faz 0 için bu yeterli. Erken eklemek sadece karmaşıklık getirir.

---

## Peki yerel Node.js'i hiç kurmayayım mı?

İkisinin de yeri var:

| | Vercel (bulut) | Yerel Node.js |
|---|---|---|
| Kurulum | Yok | Node.js gerekir |
| Değişikliği görme | 2 dakika | Anında |
| Link paylaşma | ✅ | ❌ |
| Telefonda test | ✅ | Zor |

**Önerim:** Vercel'i ana yönteminiz yapın. Yerel kurulum zaten çalışıyor;
hızlı denemeler için elinizin altında dursun, ama zorunlu değil.
