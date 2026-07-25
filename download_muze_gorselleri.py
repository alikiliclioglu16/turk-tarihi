#!/usr/bin/env python3
"""D01 müze görsellerini indirir, 1024 px ve 500 kB sınırına uyarlar."""

from __future__ import annotations

import io
import json
import sys
from pathlib import Path

try:
    import requests
    from PIL import Image
except ImportError:
    raise SystemExit("Gerekli paketler: pip install requests pillow")

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "d01-muze-referanslari.json"
OUT = ROOT / "muze-gorselleri"
OUT.mkdir(parents=True, exist_ok=True)

data = json.loads(MANIFEST.read_text(encoding="utf-8"))
failures: list[str] = []

for item in data["referanslar"]:
    target = OUT / item["dosyaAdi"]
    try:
        response = requests.get(
            item["gorselUrl"],
            timeout=60,
            headers={"User-Agent": "D01-Educational-Research/1.0"},
        )
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
        image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)

        quality = 88
        while quality >= 55:
            buffer = io.BytesIO()
            image.save(buffer, format="JPEG", quality=quality, optimize=True)
            if len(buffer.getvalue()) <= 500 * 1024:
                target.write_bytes(buffer.getvalue())
                break
            quality -= 5
        else:
            raise RuntimeError("500 kB sınırına indirilemedi")

        print(f"OK  {target.name}")
    except Exception as exc:
        failures.append(f"{item['dosyaAdi']}: {exc}")
        print(f"HATA {item['dosyaAdi']}: {exc}", file=sys.stderr)

if failures:
    (OUT / "INDIRME_HATALARI.txt").write_text(
        "\n".join(failures) + "\n", encoding="utf-8"
    )
    raise SystemExit(1)

print(f"Başarılı: {len(data['referanslar'])} görsel indirildi.")
