"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GUN, gunesKonumu } from "@/lib/gunIsigi";

/**
 * GÜNDÜZ ATMOSFERİ — öğlen 13:00
 * Gökyüzü kubbesi, güneş kursu, bulutlar ve ufuk pusu.
 */
export function SahneAtmosferi() {
  const bulutlar = useRef<THREE.Group>(null);
  const gunes = useMemo(() => gunesKonumu(), []);

  const gokMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          ust: { value: new THREE.Color(GUN.gokUst) },
          orta: { value: new THREE.Color(GUN.gokOrta) },
          ufuk: { value: new THREE.Color(GUN.gokUfuk) },
          gunesYon: { value: new THREE.Vector3(...gunes).normalize() },
        },
        vertexShader: `
          varying vec3 vYon;
          void main(){
            vYon = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform vec3 ust; uniform vec3 orta; uniform vec3 ufuk;
          uniform vec3 gunesYon;
          varying vec3 vYon;
          void main(){
            float h = clamp(vYon.y, -0.1, 1.0);
            vec3 renk = mix(ufuk, orta, smoothstep(0.0, 0.28, h));
            renk = mix(renk, ust, smoothstep(0.22, 0.75, h));
            // güneş çevresinde parlaklık
            float g = max(dot(normalize(vYon), gunesYon), 0.0);
            renk += vec3(1.0, 0.94, 0.78) * pow(g, 12.0) * 0.55;
            renk += vec3(1.0, 0.96, 0.86) * pow(g, 3.0) * 0.10;
            gl_FragColor = vec4(renk, 1.0);
          }`,
      }),
    [gunes]
  );

  const bulutVeri = useMemo(() => {
    let t = 4242;
    const r = () => { t = (t * 1103515245 + 12345) & 0x7fffffff; return t / 0x7fffffff; };
    return Array.from({ length: 26 }, () => {
      const a = r() * Math.PI * 2;
      const d = 240 + r() * 320;
      return {
        pos: [Math.cos(a) * d, 150 + r() * 110, Math.sin(a) * d] as [number, number, number],
        olcek: 70 + r() * 130,
        hiz: 0.15 + r() * 0.25,
        opak: 0.5 + r() * 0.4,
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (!bulutlar.current) return;
    const dt = Math.min(delta, 0.1);
    bulutlar.current.children.forEach((c, i) => {
      c.position.x += bulutVeri[i].hiz * dt * 3;
      if (c.position.x > 640) c.position.x = -640;
      c.lookAt(0, c.position.y, 0);
    });
  });

  return (
    <>
      <mesh material={gokMat} renderOrder={-1}>
        <sphereGeometry args={[760, 32, 20]} />
      </mesh>

      {/* güneş kursu */}
      <mesh position={gunes}>
        <sphereGeometry args={[16, 20, 20]} />
        <meshBasicMaterial color="#FFFBEF" />
      </mesh>

      {/* bulutlar */}
      <group ref={bulutlar}>
        {bulutVeri.map((b, i) => (
          <mesh key={i} position={b.pos}>
            <planeGeometry args={[b.olcek, b.olcek * 0.42]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={b.opak * 0.5} depthWrite={false} />
          </mesh>
        ))}
      </group>

      <fogExp2 attach="fog" args={[GUN.sisRenk, GUN.sisYogunluk]} />
    </>
  );
}
