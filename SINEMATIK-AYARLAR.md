# Sinematik Katman — Ne Nerede Ayarlanır

Ancient Egypt'in görselliğini üç katman taşır. Varlık kalitesi (1. katman)
stüdyo işidir ve GLB modeller geldikçe düzelecek. **2. ve 3. katman bu
projede tamamen uygulanmıştır** — dosyaları ve ayar noktaları aşağıda.

## 2. Katman — Render teknolojisi

| Teknik | Dosya | Ayar |
|---|---|---|
| PCSS yumuşak gölge | `components/scene/D01Scene.tsx` | `<SoftShadows size samples focus />` |
| Gölge çözünürlüğü | `components/scene/Environment.tsx` | `shadow-mapSize`, `shadow-bias` |
| Ortam örtüşmesi (AO) | `D01Scene.tsx` | `<N8AO aoRadius intensity />` |
| IBL / ortam haritası | `components/scene/IBL.tsx` | gradyan durakları + `environmentIntensity` |
| Zemin sisi | `components/scene/Sis.tsx` | katman sayısı, `opak`, `hiz` |
| Atmosferik sis | `Environment.tsx` | `<fogExp2 args={["#0b1322", 0.015]} />` |

## 3. Katman — Sinematografi

| Teknik | Dosya | Ayar |
|---|---|---|
| Ton eşleme | `D01Scene.tsx` | `toneMapping`, `toneMappingExposure` |
| Bloom | `D01Scene.tsx` | `intensity`, `luminanceThreshold` |
| Renk derecelendirme | `components/scene/RenkDerecelendirme.tsx` | `golgeMavi`, `isikSicak`, `kontrast`, `doygunluk` |
| Film greni | aynı dosya | `gren` (0.02–0.05 arası tutun) |
| Kromatik sapma | `D01Scene.tsx` | `offset` |
| Alan derinliği | `D01Scene.tsx` | `focusDistance`, `bokehScale` |
| Vinyet | `D01Scene.tsx` | `offset`, `darkness` |
| Kamera nefesi | `components/scene/Player.tsx` | döngü sonundaki `camera.rotation` satırları |

## Performans düşerse

Sırayla kapatın (en pahalıdan ucuza):
1. `<DepthOfField />` — kaldırın
2. `<N8AO halfRes />` → zaten yarı çözünürlük; `intensity` düşürün veya kaldırın
3. `shadow-mapSize` 4096 → 2048
4. `<Sis />` katman sayısını 22'den 10'a indirin
5. `dpr={[1, 2]}` → `dpr={[1, 1.5]}`

Renk derecelendirmesi ve bloom neredeyse bedavadır; onları en sona bırakın.
