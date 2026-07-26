"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { otDokusu } from "@/lib/textures";

/**
 * YAKIN BİTKİ ÖRTÜSÜ
 *
 * Uzak otlandırma (Dekor) tüm dünyayı seyrek kaplar. Bu bileşen ise
 * oyuncunun çevresindeki 42 metrelik alanı YOĞUN otlandırır ve oyuncu
 * yürüdükçe kendini yeniden konumlandırır.
 *
 * Sonuç: nereye giderseniz gidin ayağınızın dibi dolu görünür, ufuk
 * seyrek kalır. Ancient Egypt'in bitki yoğunluğu hissi buradan gelir.
 *
 * Üç bitki çeşidi tek instanced mesh içinde: uzun ot, kısa tutam, çalı.
 */

const ADET = 1900;
const YARICAP = 42;
const YENILEME_MESAFESI = 14; // oyuncu bu kadar yürüyünce yeniden dağıt

export function YakinBitkiler() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const doku = useMemo(() => otDokusu(), []);
  const gecici = useMemo(() => new THREE.Object3D(), []);
  const sonMerkez = useRef(new THREE.Vector2(1e9, 1e9));
  const ruzgar = useRef({ value: 0 });
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  /** deterministik dağılım — her yenilemede aynı desen çıkmasın */
  const dagilim = useMemo(() => {
    let t = 24601;
    const r = () => { t = (t * 1103515245 + 12345) & 0x7fffffff; return t / 0x7fffffff; };
    return Array.from({ length: ADET }, () => {
      const a = r() * Math.PI * 2;
      // merkeze yakın daha yoğun
      const d = Math.pow(r(), 0.62) * YARICAP;
      const tur = r();
      return {
        dx: Math.cos(a) * d,
        dz: Math.sin(a) * d,
        aci: r() * Math.PI,
        // çeşitler: uzun ot, kısa tutam, çalı
        // bozkır otu insan dizinden yüksek olmamalı
        olcek: tur < 0.55 ? 0.45 + r() * 0.3
             : tur < 0.85 ? 0.28 + r() * 0.18
             : 0.7 + r() * 0.35,
        renk: tur < 0.55 ? 0 : tur < 0.85 ? 1 : 2,
      };
    });
  }, []);

  /* rüzgâr — Dekor ile aynı dil */
  useEffect(() => {
    const m = mat.current;
    if (!m || m.userData.ruzgarEkli) return;
    m.userData.ruzgarEkli = true;
    m.onBeforeCompile = (shader) => {
      shader.uniforms.zaman = ruzgar.current;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\n uniform float zaman;")
        .replace("#include <begin_vertex>",
          `#include <begin_vertex>
           #ifdef USE_INSTANCING
             vec3 kok = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
           #else
             vec3 kok = vec3(0.0);
           #endif
           float ucOran = max(0.0, uv.y - 0.2) * 1.35;
           float dalga = sin(zaman * 1.9 + kok.x * 0.42 + kok.z * 0.31)
                       + sin(zaman * 3.3 + kok.z * 0.17) * 0.45;
           transformed.x += dalga * 0.16 * ucOran;
           transformed.z += dalga * 0.09 * ucOran;`);
    };
    m.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    ruzgar.current.value += delta;
    const im = ref.current;
    if (!im) return;

    const px = oyuncuKonumu.x;
    const pz = oyuncuKonumu.z;
    if (sonMerkez.current.distanceTo(new THREE.Vector2(px, pz)) < YENILEME_MESAFESI) return;
    sonMerkez.current.set(px, pz);

    for (let i = 0; i < ADET; i++) {
      const d = dagilim[i];
      const x = px + d.dx;
      const z = pz + d.dz;
      gecici.position.set(x, araziYukseklik(x, z) + 0.3 * d.olcek, z);
      gecici.rotation.set(0, d.aci, 0);
      gecici.scale.set(d.olcek, d.olcek, d.olcek);
      gecici.updateMatrix();
      im.setMatrixAt(i, gecici.matrix);
    }
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
  });

  /**
   * Instance renkleri BAŞLANGIÇTA doldurulur ve malzemeye needsUpdate
   * verilir. Aksi hâlde gölgelendirici renk niteliğini görmeden derlenir
   * ve bitkiler SİYAH çıkar.
   */
  const renkTamponu = useMemo(() => {
    const dizi = new Float32Array(ADET * 3);
    for (let i = 0; i < ADET; i++) {
      const d = dagilim[i];
      const c = d.renk === 0 ? [0.58, 0.68, 0.55]
              : d.renk === 1 ? [0.68, 0.72, 0.5]
              : [0.42, 0.55, 0.42];
      dizi[i * 3] = c[0]; dizi[i * 3 + 1] = c[1]; dizi[i * 3 + 2] = c[2];
    }
    return new THREE.InstancedBufferAttribute(dizi, 3);
  }, [dagilim]);

  useEffect(() => {
    const im = ref.current;
    if (!im) return;
    im.instanceColor = renkTamponu;
    im.instanceColor.needsUpdate = true;
    (im.material as THREE.Material).needsUpdate = true;
  }, [renkTamponu]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, ADET]}
      frustumCulled={false}
    >
      <planeGeometry args={[0.85, 0.6, 1, 3]} />
      <meshStandardMaterial
        ref={mat}
        map={doku}
        transparent
        alphaTest={0.35}
        side={THREE.DoubleSide}
        roughness={1}
        vertexColors
      />
    </instancedMesh>
  );
}
