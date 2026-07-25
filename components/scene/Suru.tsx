"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { SURU } from "@/lib/halk";
import { AssetModel } from "./AssetModel";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";

/** Otlaktaki koyunlar ve atlar — mesafeye göre çizilir */
export function Suru() {
  const [yakin, setYakin] = useState<number[]>([]);
  const son = useRef(0);
  const anahtar = useRef("");

  useFrame(({ clock }) => {
    if (clock.elapsedTime - son.current < 0.7) return;
    son.current = clock.elapsedTime;
    const liste: number[] = [];
    SURU.forEach((s, i) => {
      if (Math.hypot(s.pos[0] - oyuncuKonumu.x, s.pos[1] - oyuncuKonumu.z) < 70) liste.push(i);
    });
    const a = liste.join(",");
    if (a !== anahtar.current) { anahtar.current = a; setYakin(liste); }
  });

  return (
    <>
      {yakin.map((i) => {
        const s = SURU[i];
        return (
          <AssetModel
            key={`suru-${i}`}
            kod={s.kod}
            pos={[s.pos[0], 0, s.pos[1]]}
            rotY={(i % 7) * 0.9}
            olcek={s.olcek}
          />
        );
      })}
    </>
  );
}
