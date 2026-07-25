"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { araziYukseklik, SINIR_IC, DUNYA_YARICAP } from "@/lib/terrain";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";
import { cimDokusu, kuruToprakDokusu, kayaZeminDokusu, patikaDokusu } from "@/lib/textures";
import { BOLGELER, BOLGE_SIRASI } from "@/lib/bolgeler";
import { useFrame } from "@react-three/fiber";

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

/** Yumuşak bulut deseni — büyük lekeler hâlinde */
function bulutDesenUret(): THREE.CanvasTexture {
  const B = 256;
  const c = document.createElement("canvas");
  c.width = c.height = B;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, B, B);
  g.globalCompositeOperation = "lighter";
  let tohum = 8821;
  const r = () => { tohum = (tohum * 1103515245 + 12345) & 0x7fffffff; return tohum / 0x7fffffff; };
  for (let i = 0; i < 90; i++) {
    const x = r() * B, y = r() * B, rad = 18 + r() * 52;
    const grad = g.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function Terrain() {
  const mesh = useRef<THREE.Mesh>(null);
  const bulutDokusu = useMemo(bulutDesenUret, []);
  const bulutZaman = useRef({ value: 0 });

  useFrame((_, delta) => {
    bulutZaman.current.value += delta;
  });
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
      shader.uniforms.bulutHarita = { value: bulutDokusu };
      shader.uniforms.bulutZaman = bulutZaman.current;

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
           uniform sampler2D bulutHarita;
           uniform float bulutZaman;
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

          // ---- BULUT GÖLGELERİ ----
          // Gökyüzünden geçen büyük gölge lekeleri. İki katman farklı
          // hızda kayar; manzara sürekli değişiyormuş gibi görünür.
          vec2 bUv1 = vDunyaKonum.xz * 0.0032 + vec2(bulutZaman * 0.0042, bulutZaman * 0.0018);
          vec2 bUv2 = vDunyaKonum.xz * 0.0019 - vec2(bulutZaman * 0.0026, bulutZaman * 0.0011);
          float b1 = texture2D(bulutHarita, bUv1).r;
          float b2 = texture2D(bulutHarita, bUv2).r;
          float bulut = smoothstep(0.42, 0.78, b1 * 0.65 + b2 * 0.55);
          zeminRenk *= mix(1.0, 0.74, bulut);

          diffuseColor.rgb *= zeminRenk;
          `
        );
    };
    m.customProgramCacheKey = () => "arazi-harman-v2";
    return m;
  }, [cim, toprak, kaya, patika, bulutDokusu]);

  return <mesh ref={mesh} geometry={geo} material={mat} receiveShadow frustumCulled={false} />;
}

export { DUNYA_YARICAP };
