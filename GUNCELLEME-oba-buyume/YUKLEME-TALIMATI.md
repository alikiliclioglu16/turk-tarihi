# Güncelleme — Oba Büyümesi + Derinleştirilmiş Karakter

**Önemli:** Bu güncelleme **3B hibrit sürümün** üzerine gelir
(`dede-korkut-3d-hibrit.zip`). Önce onu yüklediğinizden emin olun.

## Yükleme

GitHub → deponuz → **Add file → Upload files** → bu klasördeki
**`lib`, `components`, `app`, `public`** klasörlerini birden sürükleyin →
**Commit changes**. Vercel 2 dakikada güncellenir.

---

## 1. Dede Korkut derinleşti

Görselden gerçek GLB üretmek bu ortamda mümkün değil (ayrıntı aşağıda),
ama billboard artık düz bir çıkartma değil:

- **Prosedürel normal haritası:** Boyalı görselin parlaklık farklarından
  yükseklik haritası çıkarılıyor. Yüz, sakal, cübbe kıvrımları artık ateşin
  ışığına gerçekten tepki veriyor — yanından geçerken gölgeleniyor.
- **Silindirik bükülme:** Düzlem hafifçe kavisli; kenarlar geriye kıvrılıyor,
  hacim hissi doğuyor.
- **Zemin gölgesi** ve yürüyüş ritmi korunuyor.

### Gerçek 3B karakter istiyorsanız

Mevcut pozlar GLB için uygun kaynak değil: hepsi aynı açıdan, T-pozu yok.
ChatGPT'den **ayrı bir T-poz seti** isteyin — ön, yan, arka, kollar tam yana
açık, avuçlar aşağı, düz gri arka plan. Bu seti Hyper3D Rodin'e
(multi-image fusion + T-Pose enforcement açık) verip GLB alın, sonra Meshy'de
auto-rig + yürüme animasyonu ekleyin. GLB gelirse `lib/assets.ts` üzerinden
billboard'ın yerine takarım.

---

## 2. Oba büyüdü

| Yeni | Nerede |
|---|---|
| 3. ve 4. otağ | Kampın iki yanında, uzakta |
| **Tuğ direği** | Obanın merkez işareti, at kılı püsküllü |
| **Hayvan ağılı + 4 koyun** | Doğu tarafı |
| **Yüklü kağnı** | Batı — göç hazırlığı |
| **Dokuma tezgâhı** | Kilim yarı dokunmuş hâlde, çözgü iplikleriyle |
| **Kurutma sehpası** | Et ve deri asılı |
| **Odun yığınları** | İstiflenmiş |
| **Su tulumu sehpası** | Üç ayaklı, asılı deri tulum |
| **Mızrak rafı** | Dekor olarak, asılı — kullanım yok |
| Kayalar | Kamp çevresine dağıtıldı |

Kamp alanı yaklaşık iki katına çıktı; artık gerçekten "gezilecek" bir yer.

---

## 3. Yeni sistem: Meraklı Gözler

Ana turun dışında **8 bonus keşif** eklendi. Obayı gezerken parlayan küçük
işaretler görürsünüz; dokununca kısa bir bilgi kartı açılır ve sayaç artar
(üst şeritte ✨ ile gösteriliyor).

Bunlar ilerlemeyi engellemez, ceza yoktur — amaç çocuğun **etrafa bakma**
davranışını ödüllendirmek. Metinler kısa ve düşündürücü:

> *"Bu araba yüklü duruyor. Demek ki yakında yola çıkılacak. Göç, bir günde
> karar verilen bir iş değildir."*

Görev sırasında dikkat dağıtmasın diye anlatı ve görev fazlarında gizleniyor.

**İçerik eklemek:** `lib/bonusKesifler.ts` — tek dosya, JSON gibi liste.
Her keşfin `kaynakNotu` alanı var; tarihsel iddia içerenler doldurulmalı.

---

## Kontrol listesi

- [ ] Dede Korkut ateşin yanından geçerken yüzü ışık alıyor
- [ ] Obada dolaşınca yeni yapılar görünüyor (ağıl, kağnı, tezgâh, tuğ)
- [ ] Parlayan bonus işaretlerine dokununca bilgi kartı açılıyor
- [ ] Üst şeritte ✨ sayacı artıyor
- [ ] Görev sırasında bonus işaretleri kayboluyor
