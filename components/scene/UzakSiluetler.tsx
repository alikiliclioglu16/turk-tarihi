"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { D01_YERLESIM } from "@/lib/assets";
import { araziYukseklik } from "@/lib/terrain";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";

/**
 * UZAK SİLUETLER — mesafe kademesi (LOD)
 *
 * Yakındaki nesneler tam detayla çizilir (YakinVarliklar). Bu bileşen
 * onun tamamlayıcısıdır: uzaktaki nesneleri basitleştirilmiş kütlelerle,
 * instancing ile çizer.
 *
 * Sonuç: obadan ufka baktığınızda Balbal Sırtı'ndaki taşları, su
 * kenarındaki söğütleri ve eski yurdun yıkıntılarını görürsünüz —
 * dünya boş görünmez, gitmek için sebep doğar.
 */

/** Hangi kod hangi basit kütleyle temsil edilir */
type Kutle = "otag" | "dikTas" | "agac" | "yigin" | "direk" | "kaya" | "yok";

const KUTLE: Record<string, Kutle> = {
  A04: "otag", A03: "yigin", A05: "yok", A06: "direk", A07: "dikTas", A08: "yok",
  B13: "yok", B14: "yok", B15: "yigin", B16: "direk", B17: "direk", B18: "yigin",
  B19: "direk", B20: "direk", B21: "direk",
  E01: "dikTas", E02: "kaya", E03: "dikTas", E04: "kaya", E05: "kaya",
  F01: "agac", F02: "kaya", F03: "yok", F04: "direk", F05: "direk", F06: "yok", F07: "yok",
  G01: "yigin", G02: "yok", G03: "yigin", G04: "yok", G05: "yok",
  G06: "direk", G07: "yigin", G08: "yok",
  H04: "direk", P01: "otag", P02: "yigin", P03: "direk", P04: "yok",
  O01: "otag", O02: "direk", O03: "direk", O04: "direk", O05: "yigin", O06: "yok",
  C01: "kaya", C05: "yok",
};

const YAKIN = 105;   // bu mesafeden yakında detaylı model çiziliyor
const UZAK = 460;    // bu mesafeden öte hiç çizilmiyor

interface Grup {
  kutle: Kutle;
  noktalar: { x: number; y: number; z: number; s: number; r: number }[];
}

export function UzakSiluetler() {
  const gruplar = useMemo<Grup[]>(() => {
    const harita = new Map<Kutle, Grup["noktalar"]>();
    for (const y of D01_YERLESIM) {
      const k = KUTLE[y.kod] ?? "yok";
      if (k === "yok") continue;
      const [x, , z] = y.pos;
      if (!harita.has(k)) harita.set(k, []);
      harita.get(k)!.push({
        x, y: araziYukseklik(x, z), z,
        s: y.olcek ?? 1,
        r: y.rotY ?? 0,
      });
    }
    return [...harita.entries()].map(([kutle, noktalar]) => ({ kutle, noktalar }));
  }, []);

  return (
    <>
      {gruplar.map((g) => (
        <SiluetGrubu key={g.kutle} grup={g} />
      ))}
    </>
  );
}

function SiluetGrubu({ grup }: { grup: Grup }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const gecici = useMemo(() => new THREE.Object3D(), []);
  const sonKontrol = useRef(0);

  useFrame(({ clock }) => {
    const im = ref.current;
    if (!im) return;
    if (clock.elapsedTime - sonKontrol.current < 0.4) return;
    sonKontrol.current = clock.elapsedTime;

    let sayac = 0;
    for (const n of grup.noktalar) {
      const d = Math.hypot(n.x - oyuncuKonumu.x, n.z - oyuncuKonumu.z);
      // yalnız uzak aralıkta göster — yakında detaylı model devrede
      if (d < YAKIN || d > UZAK) continue;
      gecici.position.set(n.x, n.y, n.z);
      gecici.rotation.set(0, n.r, 0);
      gecici.scale.setScalar(n.s);
      gecici.updateMatrix();
      im.setMatrixAt(sayac++, gecici.matrix);
    }
    im.count = sayac;
    im.instanceMatrix.needsUpdate = true;
  });

  const adet = grup.noktalar.length;

  switch (grup.kutle) {
    case "otag":
      return (
        <instancedMesh ref={ref} args={[undefined, undefined, adet]} castShadow frustumCulled={false}>
          <coneGeometry args={[3.0, 4.2, 8]} />
          <meshStandardMaterial color="#CFC3A4" roughness={0.98} />
        </instancedMesh>
      );
    case "dikTas":
      return (
        <instancedMesh ref={ref} args={[undefined, undefined, adet]} castShadow frustumCulled={false}>
          <boxGeometry args={[0.8, 3.0, 0.6]} />
          <meshStandardMaterial color="#7B8492" roughness={1} />
        </instancedMesh>
      );
    case "agac":
      return (
        <instancedMesh ref={ref} args={[undefined, undefined, adet]} castShadow frustumCulled={false}>
          <sphereGeometry args={[2.6, 8, 6]} />
          <meshStandardMaterial color="#5A7355" roughness={1} flatShading />
        </instancedMesh>
      );
    case "yigin":
      return (
        <instancedMesh ref={ref} args={[undefined, undefined, adet]} castShadow frustumCulled={false}>
          <boxGeometry args={[2.4, 1.2, 1.8]} />
          <meshStandardMaterial color="#8A8574" roughness={1} />
        </instancedMesh>
      );
    case "direk":
      return (
        <instancedMesh ref={ref} args={[undefined, undefined, adet]} castShadow frustumCulled={false}>
          <cylinderGeometry args={[0.14, 0.18, 2.6, 5]} />
          <meshStandardMaterial color="#7A6448" roughness={1} />
        </instancedMesh>
      );
    default:
      return (
        <instancedMesh ref={ref} args={[undefined, undefined, adet]} castShadow frustumCulled={false}>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color="#6E7686" roughness={1} flatShading />
        </instancedMesh>
      );
  }
}
