"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { bonusKesifler } from "@/lib/bonusKesifler";
import { useOyun } from "@/lib/store";
import { tik } from "@/lib/audio";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { lekeDokusu } from "@/lib/textures";

const GORUNUR_MESAFE = 55; // metre — bu uzaklıktan öteye çizilmez

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
      {bonusKesifler.map((b) => {
        const acildi = bulunan.includes(b.id);
        return (
          <group
            key={b.id}
            position={b.pos}
            userData={{ tx: b.pos[0], ty: b.pos[1], tz: b.pos[2] }}
            onClick={(e) => {
              if (!tiklanabilir) return;
              e.stopPropagation();
              tik();
              bonusBul(b.id);
            }}
            onPointerOver={() => tiklanabilir && (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          >
            <mesh>
              <octahedronGeometry args={[acildi ? 0.1 : 0.14, 0]} />
              <meshBasicMaterial
                color={acildi ? "#4BB3A9" : "#F0D48A"}
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
