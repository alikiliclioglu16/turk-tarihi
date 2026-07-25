"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lekeDokusu } from "@/lib/textures";
import { araziYukseklik } from "@/lib/terrain";

/** Ocak alevi, yükselen kıvılcımlar, duman ve titreşen ışık */
export function AtesEfekti({ pos = [0, 0, 0] as [number, number, number] }) {
  const alev1 = useRef<THREE.Mesh>(null);
  const alev2 = useRef<THREE.Mesh>(null);
  const isik = useRef<THREE.PointLight>(null);
  const kivGeo = useRef<THREE.BufferGeometry>(null);
  const dumanGrup = useRef<THREE.Group>(null);
  const leke = useMemo(() => lekeDokusu(), []);

  const KIV = 26;
  const kivVeri = useMemo(
    () =>
      Array.from({ length: KIV }, () => ({
        t: Math.random(),
        hx: (Math.random() - 0.5) * 0.6,
        hz: (Math.random() - 0.5) * 0.6,
        hiz: 0.35 + Math.random() * 0.55,
      })),
    []
  );
  const kivPos = useMemo(() => new Float32Array(KIV * 3), []);
  const dumanVeri = useMemo(() => Array.from({ length: 9 }, () => ({ t: Math.random() })), []);

  const y = araziYukseklik(pos[0], pos[2]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    if (alev1.current) {
      alev1.current.scale.y = 1 + Math.sin(t * 9) * 0.18;
      alev1.current.scale.x = alev1.current.scale.z = 1 + Math.sin(t * 7) * 0.09;
      alev1.current.rotation.y = t * 0.7;
    }
    if (alev2.current) {
      alev2.current.scale.y = 1 + Math.sin(t * 11 + 1) * 0.2;
      alev2.current.rotation.y = -t * 1.1;
    }
    if (isik.current) {
      isik.current.intensity = 26 + Math.sin(t * 8.5) * 5 + Math.sin(t * 21.3) * 2.5;
    }

    if (kivGeo.current) {
      const attr = kivGeo.current.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < KIV; i++) {
        const v = kivVeri[i];
        v.t += dt * v.hiz;
        if (v.t > 1) {
          v.t = 0;
          v.hx = (Math.random() - 0.5) * 0.6;
          v.hz = (Math.random() - 0.5) * 0.6;
        }
        attr.setXYZ(
          i,
          v.hx * (1 + v.t * 2.2) + Math.sin(t * 3 + i) * 0.07,
          0.7 + v.t * 3.4,
          v.hz * (1 + v.t * 2.2) + Math.cos(t * 2.4 + i) * 0.07
        );
      }
      attr.needsUpdate = true;
    }

    if (dumanGrup.current) {
      dumanGrup.current.children.forEach((c, i) => {
        const v = dumanVeri[i];
        v.t += dt * 0.22;
        if (v.t > 1) v.t = 0;
        const k = v.t;
        c.position.set(Math.sin(k * 9) * 0.4 * k, 1.6 + k * 5.5, Math.cos(k * 7) * 0.35 * k);
        const s = 0.6 + k * 2.6;
        c.scale.set(s, s, 1);
        const m = (c as THREE.Sprite).material as THREE.SpriteMaterial;
        m.opacity = 0.22 * Math.sin(k * Math.PI);
      });
    }
  });

  return (
    <group position={[pos[0], y, pos[2]]}>
      <pointLight ref={isik} color="#f0a44a" intensity={26} distance={34} decay={2} position={[0, 1.4, 0]} />

      <mesh ref={alev1} position={[0, 0.82, 0]}>
        <coneGeometry args={[0.45, 1.4, 10]} />
        <meshBasicMaterial color="#e5703a" transparent opacity={0.92} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={alev2} position={[0, 0.96, 0]}>
        <coneGeometry args={[0.3, 1.0, 8]} />
        <meshBasicMaterial color="#f7d08a" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* parıltı */}
      <sprite position={[0, 1.1, 0]} scale={[5, 5, 1]}>
        <spriteMaterial map={leke} color="#f0a44a" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      {/* kıvılcımlar */}
      <points>
        <bufferGeometry ref={kivGeo}>
          <bufferAttribute attach="attributes-position" args={[kivPos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffb066" size={0.085} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* duman */}
      <group ref={dumanGrup}>
        {dumanVeri.map((_, i) => (
          <sprite key={i} scale={[1, 1, 1]}>
            <spriteMaterial map={leke} color="#b6c2d8" transparent opacity={0} depthWrite={false} />
          </sprite>
        ))}
      </group>
    </group>
  );
}
