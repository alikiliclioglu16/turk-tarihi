"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { bonusKesifler, bonusKesifBul } from "@/lib/bonusKesifler";
import { OGRENME_NOKTALARI } from "@/lib/ogrenmeNoktalari";

/** Serbest keşif: Meraklı Gözler + bölge öğrenme noktaları */
const TUM_KESIFLER = [...bonusKesifler, ...OGRENME_NOKTALARI];

// store'un keşif kartı üretebilmesi için köprü
if (typeof globalThis !== "undefined") {
  (globalThis as {
    __bonusMetin?: (id: string) => {
      ad: string; metin: string; kaynakNotu: string | null; tip: string | null;
    } | null;
  }).__bonusMetin =
    (id: string) => {
      const b = TUM_KESIFLER.find((x) => x.id === id) ?? bonusKesifBul(id);
      if (!b) return null;
      return {
        ad: b.ad, metin: b.metin,
        kaynakNotu: b.kaynakNotu ?? null,
        tip: (b as { tip?: string }).tip ?? null,
      };
    };
}
import { useOyun } from "@/lib/store";
import { tik } from "@/lib/audio";
import { oyuncuKonumu, kameraOdaklan } from "@/lib/oyuncuKonum";
import { lekeDokusu } from "@/lib/textures";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";

const GORUNUR_MESAFE = 95;

/** Öğrenme noktası türüne göre renk — mini haritayla aynı dil */
const TIP_RENK: Record<string, string> = {
  zanaat: "#F0A44A", kultur: "#E06AA8", yasam: "#7FD46A",
  yapi: "#C9A24B", doga: "#5FC7D8", tarih: "#B98CE8", bonus: "#F0D48A",
}; // metre — bu uzaklıktan öteye çizilmez

/**
 * MERAKLI GÖZLER
 *
 * Ana tur ilerlemesinden bağımsız çalışır: hangi durakta olursan ol,
 * yakınındaki keşifler görünür ve dokunulabilir.
 *
 * Performans notu: her işaret için ayrı ışık KULLANILMAZ. 32 nokta ışığı
 * sahneyi kilitler. Bunun yerine katkısal karışımlı sprite parıltısı
 * kullanılır — görsel etki aynı, maliyet neredeyse sıfır.
 */
export function BonusKesifler() {
  const bulunan = useOyun((s) => s.bulunanBonuslar);
  const bonusBul = useOyun((s) => s.bonusBul);
  const faz = useOyun((s) => s.faz);
  const grup = useRef<THREE.Group>(null);
  const leke = useMemo(() => lekeDokusu(), []);

  // panel açıkken tıklama kapalı, ama işaretler görünür kalır
  const tiklanabilir = faz === "gezinti" || faz === "kesif";

  useFrame(({ clock }) => {
    if (!grup.current) return;
    const t = clock.elapsedTime;
    grup.current.children.forEach((c, i) => {
      const veri = c.userData as { tx: number; ty: number; tz: number };
      const d = Math.hypot(veri.tx - oyuncuKonumu.x, veri.tz - oyuncuKonumu.z);
      const gorunur = d < GORUNUR_MESAFE;
      c.visible = gorunur;
      if (!gorunur) return;
      c.position.y = veri.ty + Math.sin(t * 1.5 + i) * 0.14;
      c.rotation.y = t * 0.6 + i;
      // uzaktakiler soluklaşsın
      const kucuk = c.children[0] as THREE.Mesh;
      const mat = kucuk.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.min(1, (GORUNUR_MESAFE - d) / 12) * 0.95;
    });
  });

  return (
    <group ref={grup}>
      {TUM_KESIFLER.map((b) => {
        const acildi = bulunan.includes(b.id);
        const p: [number, number, number] = [b.pos[0]*DUNYA_OLCEK, b.pos[1]*DUNYA_OLCEK, b.pos[2]*DUNYA_OLCEK];
        return (
          <group
            key={b.id}
            position={p}
            userData={{ tx: p[0], ty: p[1], tz: p[2] }}
            onClick={(e) => {
              if (!tiklanabilir) return;
              e.stopPropagation();
              tik();
              kameraOdaklan(p[0], p[1], p[2]);
              bonusBul(b.id);
            }}
            onPointerOver={() => tiklanabilir && (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          >
            <mesh>
              <octahedronGeometry args={[acildi ? 0.1 : 0.14, 0]} />
              <meshBasicMaterial
                color={acildi ? "#4BB3A9" : (TIP_RENK[(b as { tip?: string }).tip ?? "bonus"] ?? "#F0D48A")}
                transparent
                opacity={acildi ? 0.5 : 0.95}
              />
            </mesh>
            {/* ışık yerine katkısal parıltı — 32 nokta ışığından kaçınır */}
            <sprite scale={acildi ? [0.7, 0.7, 1] : [1.15, 1.15, 1]}>
              <spriteMaterial
                map={leke}
                color={acildi ? "#4BB3A9" : "#F0D48A"}
                transparent
                opacity={acildi ? 0.3 : 0.6}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
            <mesh visible={false}>
              <sphereGeometry args={[0.6, 6, 6]} />
              <meshBasicMaterial />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
