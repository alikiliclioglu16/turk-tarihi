"use client";

import { useMemo } from "react";
import * as THREE from "three";

/** Gece gökyüzü, yıldızlar, ay, ateş ışığı ve alevler */
export function SahneAtmosferi() {
  const yildizGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 900;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 140 + Math.random() * 25;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.random() * Math.PI * 0.44 + 0.05;
      p[i * 3] = r * Math.sin(ph) * Math.cos(th);
      p[i * 3 + 1] = r * Math.cos(ph);
      p[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);

  const gokMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          ust: { value: new THREE.Color("#050a16") },
          ufuk: { value: new THREE.Color("#2a3f6a") },
        },
        vertexShader: `varying float vY;
          void main(){ vY = normalize(position).y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 ust; uniform vec3 ufuk; varying float vY;
          void main(){ float t = clamp(vY*1.7+0.22, 0.0, 1.0);
          gl_FragColor = vec4(mix(ufuk, ust, t), 1.0); }`,
      }),
    []
  );

  return (
    <>
      <mesh material={gokMat}>
        <sphereGeometry args={[170, 24, 16]} />
      </mesh>

      <points geometry={yildizGeo}>
        <pointsMaterial color="#f7ebd3" size={0.6} sizeAttenuation transparent opacity={0.85} />
      </points>

      <mesh position={[-62, 58, -95]}>
        <sphereGeometry args={[5, 24, 24]} />
        <meshBasicMaterial color="#f4eddb" />
      </mesh>

      <fogExp2 attach="fog" args={["#0b1322", 0.015]} />
      {/* kenar ışığı: nesneleri geceden ayıran soğuk kontur */}
      <directionalLight color="#7794cf" intensity={0.45} position={[38, 16, -46]} />
      <ambientLight color="#2c3d63" intensity={0.35} />
      <directionalLight
        color="#93abda"
        intensity={0.6}
        position={[-45, 55, -35]}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
        shadow-normalBias={0.022}
      />
    </>
  );
}
