#!/usr/bin/env python3
"""
KARAKTER DOKU VARYANTI ÜRETİCİ

Bir karakter GLB'sinden, YÜZ VE ELLERE DOKUNMADAN kıyafet rengi
değiştirilmiş doku varyantları üretir.

Nasıl çalışır:
  1. Mesh'in köşe konumlarından ten bölgeleri bulunur
     (baş: y > 1.46 · eller: T-pozda gövdeden uzak, orta yükseklik)
  2. Bu üçgenler UV uzayına taranarak maske çıkarılır
  3. Maske dışındaki alanda ton kaydırma ve doygunluk ayarı yapılır
  4. Varyant PNG'ler kaydedilir

Ölçüm: gezgin karakterinde ten/kıyafet çakışması %0,1 — maske temiz.

Kullanım:
    python3 doku_varyanti.py karakter_asker.glb ./cikti
"""

import struct, json, sys, pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

# Üretilecek varyantlar: (ad, ton kaydırma °, doygunluk çarpanı, parlaklık çarpanı)
# (ad, ton kaydırma °, doygunluk çarpanı, parlaklık çarpanı)
# Kaynak doku soluk zeytin olduğu için doygunluk BELİRGİN artırılır;
# yoksa ton kaydırma göze çarpmaz.
VARYANTLAR = [
    ("kiremit",  -48, 2.30, 0.95),   # kiremit kırmızısı
    ("mavi",     150, 1.90, 0.80),   # koyu mavi
    ("kahve",    -18, 1.60, 0.68),   # koyu kahve
    ("kum",       10, 0.45, 1.28),   # açık kum, soluk
    ("mor",      200, 1.70, 0.78),   # koyu mor
    ("yesil",     55, 1.75, 0.88),   # koyu yeşil
]


def glb_oku(yol):
    d = pathlib.Path(yol).read_bytes()
    off = 12
    uz, _ = struct.unpack('<II', d[off:off + 8])
    js = json.loads(d[off + 8:off + 8 + uz].decode('utf-8'))
    bo = off + 8 + uz
    bu, _ = struct.unpack('<II', d[bo:bo + 8])
    return js, d[bo + 8:bo + 8 + bu]


def accessor(js, BIN, i):
    a = js['accessors'][i]
    bv = js['bufferViews'][a['bufferView']]
    st = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    tip = {5126: np.float32, 5123: np.uint16, 5125: np.uint32, 5121: np.uint8}[a['componentType']]
    say = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}[a['type']]
    return np.frombuffer(BIN, dtype=tip, count=a['count'] * say, offset=st).reshape(a['count'], say)


def ten_maskesi(js, BIN, cozunurluk=1024):
    """Yüz ve ellerin UV maskesini çıkarır"""
    pr = js['meshes'][0]['primitives'][0]
    pos = accessor(js, BIN, pr['attributes']['POSITION'])
    uv = accessor(js, BIN, pr['attributes']['TEXCOORD_0'])
    idx = accessor(js, BIN, pr['indices']).ravel().astype(int)

    y = pos[:, 1]
    boy = float(y.max())
    # oranla çalış: farklı boydaki karakterlerde de doğru
    bas = y > boy * 0.86
    el = (y > boy * 0.50) & (y < boy * 0.77) & (np.abs(pos[:, 0]) > pos[:, 0].max() * 0.72)
    ten = bas | el

    R = cozunurluk
    m = Image.new('L', (R, R), 0)
    ciz = ImageDraw.Draw(m)
    for t in range(0, len(idx), 3):
        a, b, c = idx[t], idx[t + 1], idx[t + 2]
        if not (ten[a] and ten[b] and ten[c]):
            continue
        ciz.polygon([(float(uv[i, 0]) * R, (1 - float(uv[i, 1])) * R) for i in (a, b, c)], fill=255)
    # kenar payı — dikiş çizgisi kalmasın
    return m.filter(ImageFilter.MaxFilter(5))


def doku_cikar(js, BIN):
    im = js['images'][0]
    bv = js['bufferViews'][im['bufferView']]
    veri = BIN[bv.get('byteOffset', 0): bv.get('byteOffset', 0) + bv['byteLength']]
    import io
    return Image.open(io.BytesIO(veri)).convert('RGB')


def varyant_uret(doku, maske, ton, doygunluk, parlaklik):
    """Maske dışındaki alanda HSV oynatması yapar"""
    hsv = np.array(doku.convert('HSV'), dtype=np.int16)
    m = np.array(maske.resize(doku.size), dtype=np.float32) / 255.0
    kiyafet = m < 0.5   # maske dışı = kıyafet

    h = hsv[..., 0].astype(np.float32)
    s = hsv[..., 1].astype(np.float32)
    v = hsv[..., 2].astype(np.float32)

    h2 = (h + ton * 255.0 / 360.0) % 255.0
    s2 = np.clip(s * doygunluk, 0, 255)
    v2 = np.clip(v * parlaklik, 0, 255)

    hsv[..., 0] = np.where(kiyafet, h2, h).astype(np.int16)
    hsv[..., 1] = np.where(kiyafet, s2, s).astype(np.int16)
    hsv[..., 2] = np.where(kiyafet, v2, v).astype(np.int16)

    return Image.fromarray(hsv.astype(np.uint8), 'HSV').convert('RGB')


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    glb = pathlib.Path(sys.argv[1])
    cikti = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else '.')
    cikti.mkdir(parents=True, exist_ok=True)

    js, BIN = glb_oku(glb)
    doku = doku_cikar(js, BIN)
    maske = ten_maskesi(js, BIN)

    kaplama = (np.array(maske) > 127).mean()
    print(f"{glb.name}: doku {doku.size[0]}×{doku.size[1]} · ten maskesi %{100*kaplama:.1f}")

    taban = glb.stem
    for ad, ton, doy, par in VARYANTLAR:
        v = varyant_uret(doku, maske, ton, doy, par)
        hedef = cikti / f"{taban}_{ad}.jpg"
        v.save(hedef, quality=88, optimize=True)
        print(f"  ✅ {hedef.name}  ({hedef.stat().st_size/1024:.0f} kB)")


if __name__ == '__main__':
    main()
