"use client";

import { useEffect, useMemo, useRef } from "react";
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
  const otMat = useRef<THREE.MeshStandardMaterial>(null);
  const ruzgarZaman = useRef({ value: 0 });

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
      if (Math.hypot(x, z) > 360) continue;
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
      if (Math.hypot(x, z) > 350) continue;
      const s = 0.35 + rnd() * 1.1;
      gecici.position.set(x, araziYukseklik(x, z) + 0.14 * s, z);
      gecici.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      gecici.scale.set(s, s * 0.65, s);
      gecici.updateMatrix();
      kaya.push(gecici.matrix.clone());
    }

    for (let i = 0; i < DAG_SAYISI; i++) {
      const a = (i / DAG_SAYISI) * Math.PI * 2 + rnd() * 0.3;
      const r = 480 + rnd() * 70;
      const s = 1 + rnd() * 1.1;
      gecici.position.set(Math.cos(a) * r, -22, Math.sin(a) * r);
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

  /**
   * RÜZGÂR
   * Otların üst köşeleri gölgelendiricide salınır. Kök sabit kalır,
   * uç oynar; bozkır sürekli hareket hâlinde görünür.
   */
  useEffect(() => {
    const m = otMat.current;
    if (!m || m.userData.ruzgarEkli) return;
    m.userData.ruzgarEkli = true;
    m.onBeforeCompile = (shader) => {
      shader.uniforms.zaman = ruzgarZaman.current;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\n uniform float zaman;")
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           #ifdef USE_INSTANCING
             vec3 kok = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
           #else
             vec3 kok = vec3(0.0);
           #endif
           float ucOran = max(0.0, uv.y - 0.25) * 1.3;
           float dalga = sin(zaman * 1.7 + kok.x * 0.35 + kok.z * 0.27)
                       + sin(zaman * 2.9 + kok.x * 0.11) * 0.4;
           transformed.x += dalga * 0.13 * ucOran;
           transformed.z += dalga * 0.07 * ucOran;`
        );
    };
    m.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    ruzgarZaman.current.value += delta;
  });

  /**
   * Matrisler karelere yayılarak yazılır — tek karede 2600 ot yazmak
   * tarayıcıyı kilitliyordu. Kare başına 400 kayıt yazılıyor.
   */
  const yazildi = useRef(false);
  const imlec = useRef(0);
  useFrame(() => {
    if (yazildi.current) return;
    const ot = otRef.current, kaya = kayaRef.current, dag = dagRef.current;
    if (!ot || !kaya || !dag) return;

    const PARCA = 400;
    let kalan = PARCA;
    while (kalan > 0) {
      const i = imlec.current;
      if (i < veriler.ot.length) {
        ot.setMatrixAt(i, veriler.ot[i]);
      } else if (i < veriler.ot.length + veriler.kaya.length) {
        kaya.setMatrixAt(i - veriler.ot.length, veriler.kaya[i - veriler.ot.length]);
      } else if (i < veriler.ot.length + veriler.kaya.length + veriler.dag.length) {
        const j = i - veriler.ot.length - veriler.kaya.length;
        dag.setMatrixAt(j, veriler.dag[j]);
      } else {
        [ot, kaya, dag].forEach((m) => {
          m.instanceMatrix.needsUpdate = true;
          m.computeBoundingSphere();
        });
        yazildi.current = true;
        return;
      }
      imlec.current++;
      kalan--;
    }
    [ot, kaya, dag].forEach((m) => { m.instanceMatrix.needsUpdate = true; });
  });

  return (
    <>
      <instancedMesh ref={otRef} args={[undefined, undefined, veriler.ot.length]} frustumCulled>
        <planeGeometry args={[0.9, 0.62, 1, 3]} />
        <meshStandardMaterial
          ref={otMat}
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
        {/* Gündüz ufku: uzaklıkla pusa karışan soğuk gri-mavi */}
        <meshStandardMaterial color="#8C9AA8" roughness={1} flatShading fog />
      </instancedMesh>
    </>
  );
}
