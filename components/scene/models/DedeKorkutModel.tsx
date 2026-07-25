"use client";

import { forwardRef } from "react";
import * as THREE from "three";

export interface DedeRefs {
  solKol: THREE.Group | null;
  sagKol: THREE.Group | null;
  govde: THREE.Group | null;
}

interface Props {
  solKolRef: React.RefObject<THREE.Group | null>;
  sagKolRef: React.RefObject<THREE.Group | null>;
  govdeRef?: React.RefObject<THREE.Group | null>;
}

/** Dede Korkut — yüz detaylı prosedürel model (GLB gelene kadar) */
export const DedeKorkutModel = forwardRef<THREE.Group, Props>(function DedeKorkutModel(
  { solKolRef, sagKolRef, govdeRef },
  ref
) {
  return (
    <group ref={ref}>
      <group ref={govdeRef}>
        {/* cübbe */}
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.34, 0.54, 1.35, 14]} />
          <meshStandardMaterial color="#EFE3C8" roughness={0.92} />
        </mesh>
        {/* cübbe ön şeridi */}
        <mesh position={[0, 0.94, 0.42]} rotation={[0.13, 0, 0]}>
          <boxGeometry args={[0.1, 1.28, 0.02]} />
          <meshStandardMaterial color="#B8433A" roughness={0.85} />
        </mesh>
        {/* omuz pelerini */}
        <mesh position={[0, 1.52, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.53, 0.42, 14]} />
          <meshStandardMaterial color="#B8433A" roughness={0.88} />
        </mesh>
        {/* kuşak */}
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.4, 0.42, 0.15, 14]} />
          <meshStandardMaterial color="#8E2F28" roughness={0.85} />
        </mesh>
        {/* altın toka */}
        <mesh position={[0, 1.05, 0.4]}>
          <boxGeometry args={[0.16, 0.11, 0.05]} />
          <meshStandardMaterial color="#C9A24B" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* baş */}
        <mesh position={[0, 1.94, 0]} castShadow>
          <sphereGeometry args={[0.24, 18, 14]} />
          <meshStandardMaterial color="#E8C9A8" roughness={0.8} />
        </mesh>
        {/* gözler */}
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 1.98, 0.21]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial color="#2A2118" roughness={0.35} />
          </mesh>
        ))}
        {/* kaşlar */}
        {[-0.09, 0.09].map((x) => (
          <mesh key={`k${x}`} position={[x, 2.045, 0.215]} rotation={[0, 0, x > 0 ? -0.16 : 0.16]}>
            <boxGeometry args={[0.09, 0.024, 0.02]} />
            <meshStandardMaterial color="#FAF6EC" roughness={1} />
          </mesh>
        ))}
        {/* burun */}
        <mesh position={[0, 1.93, 0.245]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.035, 0.1, 7]} />
          <meshStandardMaterial color="#E0BC98" roughness={0.8} />
        </mesh>
        {/* bıyık */}
        {[-1, 1].map((s) => (
          <mesh key={`b${s}`} position={[0.08 * s, 1.868, 0.2]} rotation={[0, 0, s * (Math.PI / 2 + 0.55)]}>
            <coneGeometry args={[0.03, 0.17, 7]} />
            <meshStandardMaterial color="#FAF6EC" roughness={1} />
          </mesh>
        ))}
        {/* sakal */}
        <mesh position={[0, 1.7, 0.1]} rotation={[0.22, 0, 0]} castShadow>
          <coneGeometry args={[0.2, 0.52, 12]} />
          <meshStandardMaterial color="#FAF6EC" roughness={1} />
        </mesh>
        {/* börk + kürk kenar */}
        <mesh position={[0, 2.25, 0]} castShadow>
          <coneGeometry args={[0.24, 0.44, 14]} />
          <meshStandardMaterial color="#B8433A" roughness={0.82} />
        </mesh>
        <mesh position={[0, 2.06, 0]}>
          <cylinderGeometry args={[0.265, 0.275, 0.13, 14]} />
          <meshStandardMaterial color="#F2E9D8" roughness={1} />
        </mesh>
      </group>

      {/* sol kol */}
      <group ref={solKolRef} position={[-0.37, 1.56, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.72, 10]} />
          <meshStandardMaterial color="#EFE3C8" roughness={0.92} />
        </mesh>
        <mesh position={[0, -0.76, 0]}>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color="#E8C9A8" roughness={0.8} />
        </mesh>
      </group>

      {/* sağ kol + asa */}
      <group ref={sagKolRef} position={[0.37, 1.56, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.72, 10]} />
          <meshStandardMaterial color="#EFE3C8" roughness={0.92} />
        </mesh>
        <mesh position={[0, -0.76, 0]}>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color="#E8C9A8" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.58, 0.07]} castShadow>
          <cylinderGeometry args={[0.032, 0.042, 1.9, 8]} />
          <meshStandardMaterial color="#6E4B26" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.4, 0.07]}>
          <sphereGeometry args={[0.062, 10, 8]} />
          <meshStandardMaterial color="#5A3D20" roughness={0.65} />
        </mesh>
      </group>

      {/* çizmeler */}
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} position={[x, 0.08, 0.05]} castShadow>
          <boxGeometry args={[0.17, 0.16, 0.32]} />
          <meshStandardMaterial color="#4A3520" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
});
