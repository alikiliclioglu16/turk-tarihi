"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SU_KOTU } from "@/lib/terrain";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";

/**
 * DERE
 *
 * Düz mavi düzlem yerine akan su. Üç katman birleşir:
 *   1. Normal haritalı dalgalanma — iki farklı hızda kayan desen
 *   2. Fresnel — dik bakınca dibi, yatık bakınca gökyüzü yansıması
 *   3. Kıyı köpüğü — kenarlarda beyazlaşma, yavaş kayan çizgiler
 *
 * Akış yönü dere yatağını takip eder.
 */

const YOL: [number, number][] = [
  [86, -8], [80, 6], [70, 18], [60, 28], [52, 34], [44, 40],
];

/** Su yüzeyi için dalga normal dokusu */
function dalgaDokusu(): THREE.CanvasTexture {
  const B = 256;
  const c = document.createElement("canvas");
  c.width = c.height = B;
  const g = c.getContext("2d")!;
  const veri = g.createImageData(B, B);

  const gurultu = (x: number, y: number, olcek: number) => {
    const s = Math.sin(x * olcek) * Math.cos(y * olcek * 1.3)
            + Math.sin((x + y) * olcek * 0.7) * 0.6;
    return s;
  };

  for (let y = 0; y < B; y++) {
    for (let x = 0; x < B; x++) {
      const i = (y * B + x) * 4;
      const h = gurultu(x, y, 0.09) + gurultu(x, y, 0.21) * 0.5;
      const hx = gurultu(x + 1, y, 0.09) + gurultu(x + 1, y, 0.21) * 0.5;
      const hy = gurultu(x, y + 1, 0.09) + gurultu(x, y + 1, 0.21) * 0.5;
      const dx = (h - hx) * 2.2;
      const dy = (h - hy) * 2.2;
      const uz = Math.hypot(dx, dy, 1);
      veri.data[i] = ((dx / uz) * 0.5 + 0.5) * 255;
      veri.data[i + 1] = ((dy / uz) * 0.5 + 0.5) * 255;
      veri.data[i + 2] = ((1 / uz) * 0.5 + 0.5) * 255;
      veri.data[i + 3] = 255;
    }
  }
  g.putImageData(veri, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function Dere() {
  const dalga = useMemo(dalgaDokusu, []);
  const zaman = useRef({ value: 0 });

  const parcalar = useMemo(() => {
    const liste: { pos: [number, number, number]; aci: number; uz: number }[] = [];
    for (let i = 0; i < YOL.length - 1; i++) {
      const [ax, az] = YOL[i].map((v) => v * DUNYA_OLCEK) as [number, number];
      const [bx, bz] = YOL[i + 1].map((v) => v * DUNYA_OLCEK) as [number, number];
      const uz = Math.hypot(bx - ax, bz - az);
      liste.push({
        pos: [(ax + bx) / 2, SU_KOTU, (az + bz) / 2],
        aci: Math.atan2(bx - ax, bz - az),
        uz: uz + 3,
      });
    }
    return liste;
  }, []);

  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2E6B7A"),
      roughness: 0.14,
      metalness: 0.35,
      transparent: true,
      opacity: 0.9,
      normalMap: dalga,
      normalScale: new THREE.Vector2(0.7, 0.7),
    });

    m.onBeforeCompile = (shader) => {
      shader.uniforms.zaman = zaman.current;
      shader.uniforms.dalgaHarita = { value: dalga };

      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\n varying vec2 vSuUv;\n varying vec3 vSuKonum;")
        .replace("#include <begin_vertex>",
          `#include <begin_vertex>
           vSuUv = uv;
           vSuKonum = (modelMatrix * vec4(position, 1.0)).xyz;`);

      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>",
          `#include <common>
           uniform float zaman;
           uniform sampler2D dalgaHarita;
           varying vec2 vSuUv;
           varying vec3 vSuKonum;`)
        .replace("#include <map_fragment>",
          `
          // iki katman dalga, farklı hız ve yön — akış hissi
          vec2 akis1 = vSuUv * vec2(3.0, 9.0) + vec2(0.0, -zaman * 0.16);
          vec2 akis2 = vSuUv * vec2(5.0, 14.0) + vec2(zaman * 0.05, -zaman * 0.27);
          float d1 = texture2D(dalgaHarita, akis1).b;
          float d2 = texture2D(dalgaHarita, akis2).b;
          float parilti = pow(max(d1 * d2, 0.0), 3.0);

          // fresnel: yatık bakışta gökyüzü, dik bakışta dip
          vec3 bakis = normalize(cameraPosition - vSuKonum);
          float fres = pow(1.0 - max(dot(bakis, vec3(0.0, 1.0, 0.0)), 0.0), 2.6);

          vec3 dipRenk = vec3(0.12, 0.28, 0.33);
          vec3 yuzeyRenk = vec3(0.55, 0.74, 0.82);
          vec3 suRenk = mix(dipRenk, yuzeyRenk, fres);
          suRenk += vec3(1.0, 0.98, 0.9) * parilti * 0.55;

          // kıyı köpüğü: kenarlara yaklaşınca beyazlaşma
          float kenar = 1.0 - smoothstep(0.0, 0.16, min(vSuUv.x, 1.0 - vSuUv.x));
          float kopukDalga = texture2D(dalgaHarita, vSuUv * vec2(8.0, 20.0) + vec2(0.0, -zaman * 0.35)).r;
          float kopuk = kenar * smoothstep(0.35, 0.75, kopukDalga);
          suRenk = mix(suRenk, vec3(0.92, 0.95, 0.95), kopuk * 0.8);

          diffuseColor.rgb = suRenk;
          diffuseColor.a *= mix(0.82, 0.96, fres);
          `);
    };
    m.customProgramCacheKey = () => "dere-akis-v1";
    return m;
  }, [dalga]);

  useFrame((_, delta) => {
    zaman.current.value += delta;
  });

  return (
    <group>
      {parcalar.map((p, i) => (
        <mesh
          key={i}
          position={p.pos}
          rotation={[-Math.PI / 2, 0, -p.aci]}
          material={mat}
          receiveShadow
        >
          <planeGeometry args={[9.5 * DUNYA_OLCEK * 0.42, p.uz, 8, 16]} />
        </mesh>
      ))}
    </group>
  );
}
