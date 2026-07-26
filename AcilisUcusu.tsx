"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { D01_YERLESIM } from "@/lib/assets";
import { CARPISMA_YARICAP } from "@/lib/carpisma";
import { araziYukseklik } from "@/lib/terrain";
import { obaCadirlari } from "@/lib/buyukObaVeri";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";

/**
 * ZEMİN KARARMASI (contact AO)
 *
 * Nesnelerin tabanında yumuşak koyulaşma. Gerçek gölge değildir; nesnenin
 * zeminle temas ettiği yerde ışığın kapandığı gerçeğini taklit eder.
 *
 * Bu olmadan nesneler zemine "yapıştırılmış" gibi durur — zeminden hafifçe
 * havada duruyormuş hissi verir. Discovery Tour kalitesinde her nesnenin
 * dibinde bu koyulaşma vardır.
 *
 * Tek InstancedMesh, çarpım karışımı (multiply). Maliyeti tek çizim çağrısı.
 */

const GORUNUR = 130;

function halkaDokusu(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0.0, "rgba(40,34,26,1)");
  grad.addColorStop(0.35, "rgba(90,80,64,1)");
  grad.addColorStop(0.72, "rgba(200,192,176,1)");
  grad.addColorStop(1.0, "rgba(255,255,255,1)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface Leke { x: number; z: number; r: number }

export function ZeminGolgeleri() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const doku = useMemo(halkaDokusu, []);
  const gecici = useMemo(() => new THREE.Object3D(), []);
  const sonKontrol = useRef(0);

  const lekeler = useMemo<Leke[]>(() => {
    const liste: Leke[] = [];

    // yerleşimdeki nesneler
    for (const y of D01_YERLESIM) {
      const r = CARPISMA_YARICAP[y.kod];
      if (r === undefined || r <= 0.2) continue;
      liste.push({ x: y.pos[0], z: y.pos[2], r: r * (y.olcek ?? 1) * 1.55 });
    }

    // büyük obanın 320 çadırı
    for (const o of obaCadirlari()) {
      liste.push({
        x: o.x * DUNYA_OLCEK,
        z: o.z * DUNYA_OLCEK,
        r: (o.beyMi ? 3.3 : 2.75) * o.s * 1.5,
      });
    }

    return liste;
  }, []);

  useFrame(({ clock }) => {
    const im = ref.current;
    if (!im) return;
    if (clock.elapsedTime - sonKontrol.current < 0.5) return;
    sonKontrol.current = clock.elapsedTime;

    let sayac = 0;
    for (const l of lekeler) {
      const d = Math.hypot(l.x - oyuncuKonumu.x, l.z - oyuncuKonumu.z);
      if (d > GORUNUR) continue;
      gecici.position.set(l.x, araziYukseklik(l.x, l.z) + 0.055, l.z);
      gecici.rotation.set(-Math.PI / 2, 0, 0);
      gecici.scale.setScalar(l.r * 2);
      gecici.updateMatrix();
      im.setMatrixAt(sayac++, gecici.matrix);
      if (sayac >= lekeler.length) break;
    }
    im.count = sayac;
    im.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, lekeler.length]}
      frustumCulled={false}
      renderOrder={1}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={doku}
        transparent
        opacity={0.72}
        depthWrite={false}
        blending={THREE.MultiplyBlending}
      />
    </instancedMesh>
  );
}
