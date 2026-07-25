"use client";

import { forwardRef, useMemo } from "react";
import { Effect } from "postprocessing";
import { wrapEffect } from "@react-three/postprocessing";
import * as THREE from "three";

/**
 * GECE RENK DERECELENDİRMESİ
 *
 * Discovery Tour'un gece sahnelerindeki sıcak–soğuk gerilimini kurar:
 * gölgeler laciverte kayar, ışıklar kehribara. Üstüne S eğrisi kontrast,
 * ince film greni ve merkeze doğru toplayan lens karakteri.
 *
 * Bu, "AAA hissi"nin geometriden bağımsız kısmıdır.
 */
const fragman = /* glsl */ `
uniform float golgeMavi;
uniform float isikSicak;
uniform float kontrast;
uniform float gren;
uniform float doygunluk;
uniform float zaman;

float rastgele(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 c = inputColor.rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));

  // gölgelere gökyüzü mavisi (gündüz gölgeleri soğuktur)
  c += vec3(0.014, 0.024, 0.048) * (1.0 - smoothstep(0.0, 0.5, l)) * golgeMavi;

  // ışıklara güneş sıcaklığı
  c *= mix(vec3(1.0), vec3(1.06, 1.02, 0.94), smoothstep(0.35, 1.0, l) * isikSicak);

  // doygunluk
  float gri = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(gri), c, doygunluk);

  // S eğrisi kontrast
  c = clamp((c - 0.5) * kontrast + 0.5, 0.0, 2.0);

  // film greni — gece çekimlerinin dokusu
  float g = rastgele(uv * 1024.0 + fract(zaman) * 91.7);
  c += (g - 0.5) * gren;

  outputColor = vec4(c, inputColor.a);
}
`;

class RenkDerecelendirmeEffect extends Effect {
  constructor({
    golgeMavi = 1.0,
    isikSicak = 1.0,
    kontrast = 1.07,
    gren = 0.012,
    doygunluk = 1.1,
  } = {}) {
    super("RenkDerecelendirme", fragman, {
      uniforms: new Map<string, THREE.Uniform>([
        ["golgeMavi", new THREE.Uniform(golgeMavi)],
        ["isikSicak", new THREE.Uniform(isikSicak)],
        ["kontrast", new THREE.Uniform(kontrast)],
        ["gren", new THREE.Uniform(gren)],
        ["doygunluk", new THREE.Uniform(doygunluk)],
        ["zaman", new THREE.Uniform(0)],
      ]),
    });
  }

  update(_renderer: THREE.WebGLRenderer, _input: THREE.WebGLRenderTarget, dt: number) {
    const u = this.uniforms.get("zaman");
    if (u) u.value += dt;
  }
}

const Sarmalanmis = wrapEffect(RenkDerecelendirmeEffect);

export const RenkDerecelendirme = forwardRef<
  RenkDerecelendirmeEffect,
  {
    golgeMavi?: number;
    isikSicak?: number;
    kontrast?: number;
    gren?: number;
    doygunluk?: number;
  }
>(function RenkDerecelendirme(props, ref) {
  const p = useMemo(() => props, [props]);
  return <Sarmalanmis ref={ref} {...p} />;
});
