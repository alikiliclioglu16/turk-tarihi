"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HALK, type HalkKaydi } from "@/lib/halk";
import { InsanModel } from "./models/InsanModel";
import { araziYukseklik } from "@/lib/terrain";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { useOyun } from "@/lib/store";
import { tik } from "@/lib/audio";

const GORUNUR = 65;   // metre
const BILGI_MESAFE = 6;

/** Tek bir kişi — yürüyense rotasında ilerler */
function Kisi({ k, onBilgi }: { k: HalkKaydi; onBilgi: (k: HalkKaydi) => void }) {
  const grup = useRef<THREE.Group>(null);
  const ilerleme = useRef(Math.random());
  const tohum = useMemo(() => Math.random() * 10, []);

  useFrame((_, delta) => {
    const g = grup.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);

    if (k.rota && k.rota.length > 1) {
      ilerleme.current += dt * 0.035;
      if (ilerleme.current >= 1) ilerleme.current -= 1;
      const n = k.rota.length;
      const p = ilerleme.current * n;
      const i = Math.floor(p) % n;
      const j = (i + 1) % n;
      const t = p - Math.floor(p);
      const x = k.rota[i][0] + (k.rota[j][0] - k.rota[i][0]) * t;
      const z = k.rota[i][1] + (k.rota[j][1] - k.rota[i][1]) * t;
      g.position.set(x, araziYukseklik(x, z), z);
      g.rotation.y = Math.atan2(k.rota[j][0] - k.rota[i][0], k.rota[j][1] - k.rota[i][1]);
    } else {
      g.position.set(k.pos[0], araziYukseklik(k.pos[0], k.pos[1]), k.pos[1]);
      g.rotation.y = k.yon ?? 0;
    }
  });

  return (
    <group
      ref={grup}
      onClick={(e) => {
        if (!k.bilgi) return;
        const d = Math.hypot(oyuncuKonumu.x - (grup.current?.position.x ?? 0),
                             oyuncuKonumu.z - (grup.current?.position.z ?? 0));
        if (d > BILGI_MESAFE * 3) return;
        e.stopPropagation();
        tik();
        onBilgi(k);
      }}
      onPointerOver={() => k.bilgi && (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <InsanModel
        aktivite={k.aktivite}
        renk={k.renk}
        kusakRenk={k.kusak}
        boy={k.boy}
        tohum={tohum}
      />
      {k.bilgi && (
        <sprite position={[0, 2.15, 0]} scale={[0.42, 0.42, 1]}>
          <spriteMaterial color="#F0D48A" transparent opacity={0.75} depthWrite={false} />
        </sprite>
      )}
    </group>
  );
}

/**
 * OBA HALKI
 * Yalnız oyuncuya 65 metre yakındaki figürler sahneye girer.
 */
export function Halk() {
  const [yakinlar, setYakinlar] = useState<HalkKaydi[]>([]);
  const sonKontrol = useRef(0);
  const sonAnahtar = useRef("");
  const bilgiAc = useOyun((s) => s.kisiBilgiAc);

  useFrame(({ clock }) => {
    if (clock.elapsedTime - sonKontrol.current < 0.6) return;
    sonKontrol.current = clock.elapsedTime;
    const liste = HALK.filter((k) => {
      const [x, z] = k.rota ? k.rota[0] : k.pos;
      return Math.hypot(x - oyuncuKonumu.x, z - oyuncuKonumu.z) < GORUNUR;
    });
    const anahtar = liste.map((k) => k.id).join(",");
    if (anahtar !== sonAnahtar.current) {
      sonAnahtar.current = anahtar;
      setYakinlar(liste);
    }
  });

  return (
    <group>
      {yakinlar.map((k) => (
        <Kisi key={k.id} k={k} onBilgi={(kk) => kk.bilgi && bilgiAc(kk.id, kk.bilgi.ad, kk.bilgi.metin)} />
      ))}
    </group>
  );
}
