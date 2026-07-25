"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";
import { otDokusu } from "@/lib/textures";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";

/**
 * BOZKIR DEKORU — instancing ile
 *
 * Önceden her ot demeti ve kaya ayrı bir mesh'ti; 350+ çizim çağrısı
 * demekti. Şimdi hepsi tek InstancedMesh içinde: ot için 1, kaya için 1,
 * dağ silüetleri için 1 çağrı. Görsel aynı, maliyet yüzde biri.
 */

const OT_SAYISI = 2600;
const KAYA_SAYISI = 260;
const DAG_SAYISI = 26;

export function Dekor() {
  const otTex = useMemo(() => otDokusu(), []);
  const otRef = useRef<THREE.InstancedMesh>(null);
  const kayaRef = useRef<THREE.InstancedMesh>(null);
  const dagRef = useRef<THREE.InstancedMesh>(null);

  const veriler = useMemo(() => {
    const gecici = new THREE.Object3D();
    const ot: THREE.Matrix4[] = [];
    const kaya: THREE.Matrix4[] = [];
    const dag: THREE.Matrix4[] = [];

    // deterministik dağılım — her açılışta aynı manzara
    let tohum = 1337;
    const rnd = () => {
      tohum = (tohum * 1103515245 + 12345) & 0x7fffffff;
      return tohum / 0x7fffffff;
    };

    for (let i = 0; i < OT_SAYISI; i++) {
      const x = (rnd() - 0.5) * 700;
      const z = (rnd() - 0.5) * 720;
      if (Math.hypot(x, z) > 350) continue;
      const s = 0.7 + rnd() * 1.3;
      gecici.position.set(x, araziYukseklik(x, z) + 0.3 * s, z);
      gecici.rotation.set(0, rnd() * Math.PI, 0);
      gecici.scale.set(s, s, s);
      gecici.updateMatrix();
      ot.push(gecici.matrix.clone());
    }

    for (let i = 0; i < KAYA_SAYISI; i++) {
      const x = (rnd() - 0.5) * 680;
      const z = (rnd() - 0.5) * 700;
      if (Math.hypot(x, z) > 340) continue;
      const s = 0.35 + rnd() * 1.1;
      gecici.position.set(x, araziYukseklik(x, z) + 0.14 * s, z);
      gecici.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      gecici.scale.set(s, s * 0.65, s);
      gecici.updateMatrix();
      kaya.push(gecici.matrix.clone());
    }

    for (let i = 0; i < DAG_SAYISI; i++) {
      const a = (i / DAG_SAYISI) * Math.PI * 2 + rnd() * 0.3;
      const r = 400 + rnd() * 90;
      const s = 1 + rnd() * 1.1;
      gecici.position.set(Math.cos(a) * r, 2, Math.sin(a) * r);
      gecici.rotation.set(0, rnd() * Math.PI, 0);
      gecici.scale.set(46 * s, 40 * s, 46 * s);
      gecici.updateMatrix();
      dag.push(gecici.matrix.clone());
    }

    return { ot, kaya, dag };
  }, []);

  // matrisleri bir kez yaz
  useMemo(() => {
    const yaz = (ref: React.RefObject<THREE.InstancedMesh | null>, m: THREE.Matrix4[]) => {
      const im = ref.current;
      if (!im) return;
      m.forEach((mat, i) => im.setMatrixAt(i, mat));
      im.instanceMatrix.needsUpdate = true;
    };
    // ilk karede ref'ler hazır olacağı için useFrame içinde tetiklenir
    return yaz;
  }, []);

  const yazildi = useRef(false);
  useFrame(() => {
    if (yazildi.current) return;
    const yaz = (im: THREE.InstancedMesh | null, m: THREE.Matrix4[]) => {
      if (!im) return false;
      m.forEach((mat, i) => im.setMatrixAt(i, mat));
      im.instanceMatrix.needsUpdate = true;
      im.computeBoundingSphere();
      return true;
    };
    const a = yaz(otRef.current, veriler.ot);
    const b = yaz(kayaRef.current, veriler.kaya);
    const c = yaz(dagRef.current, veriler.dag);
    if (a && b && c) yazildi.current = true;
  });

  return (
    <>
      <instancedMesh ref={otRef} args={[undefined, undefined, veriler.ot.length]} frustumCulled>
        <planeGeometry args={[0.9, 0.62]} />
        <meshStandardMaterial
          map={otTex}
          transparent
          alphaTest={0.35}
          side={THREE.DoubleSide}
          roughness={1}
          color="#93AFA4"
        />
      </instancedMesh>

      <instancedMesh ref={kayaRef} args={[undefined, undefined, veriler.kaya.length]} castShadow receiveShadow frustumCulled>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#42506A" roughness={1} flatShading />
      </instancedMesh>

      <instancedMesh ref={dagRef} args={[undefined, undefined, veriler.dag.length]} frustumCulled>
        <coneGeometry args={[1, 1, 5]} />
        <meshBasicMaterial color="#101c30" />
      </instancedMesh>
    </>
  );
}
