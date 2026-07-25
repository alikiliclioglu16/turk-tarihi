"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GUN, gunesKonumu } from "@/lib/gunIsigi";

/**
 * GÜNDÜZ ATMOSFERİ — öğlen 13:00
 * Gökyüzü kubbesi, güneş kursu, bulutlar ve ufuk pusu.
 */
export function SahneAtmosferi({ gunesKursu }: { gunesKursu?: React.RefObject<THREE.Mesh | null> }) {
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

  /** Bulut dokusu — yumuşak kenarlı, katmanlı kütle */
  const bulutDoku = useMemo(() => {
    const B = 256;
    const c = document.createElement("canvas");
    c.width = c.height = B;
    const g = c.getContext("2d")!;
    let t = 991;
    const r = () => { t = (t * 1103515245 + 12345) & 0x7fffffff; return t / 0x7fffffff; };
    for (let i = 0; i < 34; i++) {
      const x = 40 + r() * (B - 80);
      const y = B * 0.42 + (r() - 0.5) * B * 0.34;
      const rad = 22 + r() * 48;
      const grad = g.createRadialGradient(x, y, 0, x, y, rad);
      grad.addColorStop(0, "rgba(255,255,255,0.62)");
      grad.addColorStop(0.55, "rgba(252,250,246,0.34)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(x, y, rad, 0, Math.PI * 2);
      g.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  /** Üç katman bulut — farklı yükseklik ve hızda, hacim hissi verir */
  const bulutVeri = useMemo(() => {
    let t = 4242;
    const r = () => { t = (t * 1103515245 + 12345) & 0x7fffffff; return t / 0x7fffffff; };
    return Array.from({ length: 54 }, (_, i) => {
      const katman = i % 3;
      const a = r() * Math.PI * 2;
      const d = 260 + r() * 340 + katman * 70;
      return {
        pos: [
          Math.cos(a) * d,
          130 + katman * 55 + r() * 60,
          Math.sin(a) * d,
        ] as [number, number, number],
        olcek: 90 + r() * 170 + katman * 40,
        hiz: 0.1 + r() * 0.2 + katman * 0.06,
        opak: 0.35 + r() * 0.4 - katman * 0.06,
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

      {/* güneş kursu — ışın efektinin kaynağı */}
      <mesh position={gunes} ref={gunesKursu}>
        <sphereGeometry args={[18, 22, 22]} />
        <meshBasicMaterial color="#FFFBEF" fog={false} />
      </mesh>

      {/* bulutlar */}
      <group ref={bulutlar}>
        {bulutVeri.map((b, i) => (
          <mesh key={i} position={b.pos} renderOrder={-1}>
            <planeGeometry args={[b.olcek, b.olcek * 0.46]} />
            <meshBasicMaterial
              map={bulutDoku}
              color="#FFFFFF"
              transparent
              opacity={b.opak}
              depthWrite={false}
              fog={false}
            />
          </mesh>
        ))}
      </group>

      <fogExp2 attach="fog" args={[GUN.sisRenk, GUN.sisYogunluk]} />
    </>
  );
}
