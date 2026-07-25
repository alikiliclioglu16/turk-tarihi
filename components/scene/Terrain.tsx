"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { araziYukseklik, SINIR_IC, DUNYA_YARICAP } from "@/lib/terrain";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";
import { cimDokusu, kuruToprakDokusu, kayaZeminDokusu, patikaDokusu } from "@/lib/textures";
import { BOLGELER, BOLGE_SIRASI } from "@/lib/bolgeler";

/**
 * ARAZİ
 *
 * Dört dokunun eğime, yüksekliğe ve yerleşime göre harmanlandığı zemin.
 * Harman ağırlıkları köşe noktalarında CPU'da hesaplanır, gölgelendiricide
 * karıştırılır. Böylece:
 *   - dik yamaçlarda kaya çıkar
 *   - yükseklerde ot seyrelir, toprak baskın olur
 *   - dere kenarında zemin nemli ve koyu olur
 *   - bölgeler arası rota üzerinde ayak basmış patika belirir
 *
 * Işık, gölge ve sis MeshStandardMaterial üzerinden çalışmaya devam eder;
 * harmanlama `onBeforeCompile` ile içine enjekte edilir.
 */

const BOYUT = 880;
const BOLME = 260;

/** Bölge merkezleri arası rota — patika buradan geçer */
function rotaNoktalari(): [number, number][] {
  return BOLGE_SIRASI.map((id) => {
    const b = BOLGELER[id];
    return [b.merkez[0] * DUNYA_OLCEK, b.merkez[1] * DUNYA_OLCEK] as [number, number];
  });
}

function rotayaUzaklik(x: number, z: number, rota: [number, number][]): number {
  let en = Infinity;
  for (let i = 0; i < rota.length - 1; i++) {
    const [ax, az] = rota[i];
    const [bx, bz] = rota[i + 1];
    const dx = bx - ax, dz = bz - az;
    const uz2 = dx * dx + dz * dz;
    let t = uz2 ? ((x - ax) * dx + (z - az) * dz) / uz2 : 0;
    t = Math.max(0, Math.min(1, t));
    en = Math.min(en, Math.hypot(x - (ax + dx * t), z - (az + dz * t)));
  }
  return en;
}

export function Terrain() {
  const mesh = useRef<THREE.Mesh>(null);
  const cim = useMemo(() => cimDokusu(), []);
  const toprak = useMemo(() => kuruToprakDokusu(), []);
  const kaya = useMemo(() => kayaZeminDokusu(), []);
  const patika = useMemo(() => patikaDokusu(), []);

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(BOYUT, BOYUT, BOLME, BOLME);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const rota = rotaNoktalari();

    // harman ağırlıkları: r=çim, g=toprak, b=kaya, a=patika
    const harman = new Float32Array(pos.count * 4);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = araziYukseklik(x, z);
      pos.setY(i, y);

      // eğim: komşu örneklerden
      const e = 2.5;
      const yx = araziYukseklik(x + e, z) - araziYukseklik(x - e, z);
      const yz = araziYukseklik(x, z + e) - araziYukseklik(x, z - e);
      const egim = Math.min(1, Math.hypot(yx, yz) / (e * 2) * 1.5);

      // yükseklik (tasarım birimine göre normalize)
      const yNorm = Math.min(1, Math.max(0, y / (30 * DUNYA_OLCEK)));

      // dünya kenarı: kaya kuşağı
      const merkezUz = Math.hypot(x, z) / DUNYA_OLCEK;
      const kenar = Math.min(1, Math.max(0, (merkezUz - SINIR_IC * 0.85) / (SINIR_IC * 0.3)));

      // rota patikası
      const dRota = rotayaUzaklik(x, z, rota);
      const patikaG = Math.max(0, 1 - dRota / 9);

      // oba merkezi: çok basılmış toprak
      const dOba = Math.hypot(x, z - 4 * DUNYA_OLCEK);
      const obaG = Math.max(0, 1 - dOba / (34 * DUNYA_OLCEK)) * 0.75;

      let kayaG = Math.min(1, egim * 1.4 + kenar * 1.2 + yNorm * 0.35);
      let toprakG = Math.min(1, 0.35 + yNorm * 0.5 + obaG);
      let cimG = Math.max(0, 1 - kayaG * 0.9 - yNorm * 0.35 - obaG * 0.6);
      const patG = Math.min(1, patikaG * patikaG * 1.4 + obaG * 0.5);

      // dere kenarı: nemli, ot yoğun
      const suYakin = Math.max(0, 1 - Math.abs(y - (-3.4 * DUNYA_OLCEK)) / 8);
      cimG += suYakin * 0.5;

      const toplam = cimG + toprakG + kayaG + patG + 0.0001;
      harman[i * 4] = cimG / toplam;
      harman[i * 4 + 1] = toprakG / toplam;
      harman[i * 4 + 2] = kayaG / toplam;
      harman[i * 4 + 3] = patG / toplam;

      void toprakG; void kayaG;
    }

    g.setAttribute("harman", new THREE.BufferAttribute(harman, 4));
    g.computeVertexNormals();
    return g;
  }, []);

  const mat = useMemo(() => {
    [cim, toprak, kaya, patika].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1, 1);
    });

    const m = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 0,
    });

    m.onBeforeCompile = (shader) => {
      shader.uniforms.cimHarita = { value: cim };
      shader.uniforms.toprakHarita = { value: toprak };
      shader.uniforms.kayaHarita = { value: kaya };
      shader.uniforms.patikaHarita = { value: patika };

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
           attribute vec4 harman;
           varying vec4 vHarman;
           varying vec3 vDunyaKonum;`
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           vHarman = harman;
           vDunyaKonum = (modelMatrix * vec4(position, 1.0)).xyz;`
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
           uniform sampler2D cimHarita;
           uniform sampler2D toprakHarita;
           uniform sampler2D kayaHarita;
           uniform sampler2D patikaHarita;
           varying vec4 vHarman;
           varying vec3 vDunyaKonum;`
        )
        .replace(
          "#include <map_fragment>",
          `
          // iki ölçekte örnekle — yakında ayrıntı, uzakta desen tekrarı gizlensin
          vec2 uvYakin = vDunyaKonum.xz * 0.32;
          vec2 uvUzak  = vDunyaKonum.xz * 0.045;

          vec4 h = vHarman;
          float t = h.x + h.y + h.z + h.w;
          h /= max(t, 0.0001);

          vec3 yakin =
              texture2D(cimHarita,    uvYakin).rgb * h.x
            + texture2D(toprakHarita, uvYakin).rgb * h.y
            + texture2D(kayaHarita,   uvYakin).rgb * h.z
            + texture2D(patikaHarita, uvYakin).rgb * h.w;

          vec3 uzak =
              texture2D(cimHarita,    uvUzak).rgb * h.x
            + texture2D(toprakHarita, uvUzak).rgb * h.y
            + texture2D(kayaHarita,   uvUzak).rgb * h.z
            + texture2D(patikaHarita, uvUzak).rgb * h.w;

          // kameraya uzaklığa göre karıştır
          float mesafe = length(vDunyaKonum - cameraPosition);
          float k = smoothstep(28.0, 130.0, mesafe);
          vec3 zeminRenk = mix(yakin, uzak * 1.04, k);

          // büyük ölçekli renk dalgalanması — tekdüzelik kırılır
          float dalga = sin(vDunyaKonum.x * 0.011) * cos(vDunyaKonum.z * 0.009);
          zeminRenk *= 0.94 + dalga * 0.07;

          diffuseColor.rgb *= zeminRenk;
          `
        );
    };
    m.customProgramCacheKey = () => "arazi-harman-v1";
    return m;
  }, [cim, toprak, kaya, patika]);

  return <mesh ref={mesh} geometry={geo} material={mat} receiveShadow frustumCulled={false} />;
}

export { DUNYA_YARICAP };
