"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ahsapDokusu } from "@/lib/textures";

/**
 * EL NESNESİ
 *
 * Zanaatkârın ve askerin elindeki alet. Karakter meshine kalıcı
 * eklenmez — ayrı nesne olarak sağ el hizasına konur.
 *
 * Konumlar karakterin sağ eli için ayarlıdır (yaklaşık 0.34, 1.05, 0.16).
 */

const EL = new THREE.Vector3(0.34, 1.02, 0.18);

export function ElNesnesi({ kod }: { kod: string }) {
  const ahsap = useMemo(() => ahsapDokusu(), []);

  switch (kod) {
    case "cekic":
      return (
        <group position={EL} rotation={[0.4, 0, -0.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.03, 0.42, 6]} />
            <meshStandardMaterial map={ahsap} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.24, 0]} castShadow>
            <boxGeometry args={[0.09, 0.14, 0.09]} />
            <meshStandardMaterial color="#5A6068" metalness={0.6} roughness={0.5} />
          </mesh>
        </group>
      );

    case "yay":
      return (
        <group position={[EL.x - 0.1, EL.y + 0.05, EL.z + 0.16]} rotation={[0, 0.25, 0.15]}>
          <mesh castShadow>
            <torusGeometry args={[0.46, 0.022, 6, 18, Math.PI * 1.15]} />
            <meshStandardMaterial color="#6E4B26" roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 0.84, 4]} />
            <meshStandardMaterial color="#D8CCB0" roughness={1} />
          </mesh>
        </group>
      );

    case "kilic":
      return (
        <group position={EL} rotation={[0.15, 0, -0.55]}>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.026, 0.16, 6]} />
            <meshStandardMaterial color="#6E4B26" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.17, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.03, 0.2, 0.05]} />
            <meshStandardMaterial color="#8A7A5C" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.055, 0.72, 0.016]} />
            <meshStandardMaterial color="#9AA3AE" metalness={0.72} roughness={0.32} />
          </mesh>
        </group>
      );

    case "ok":
      return (
        <group position={EL} rotation={[0.2, 0.3, -1.35]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.62, 5]} />
            <meshStandardMaterial color="#8A6A3E" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <coneGeometry args={[0.018, 0.07, 5]} />
            <meshStandardMaterial color="#8A93A6" metalness={0.6} roughness={0.45} />
          </mesh>
        </group>
      );

    case "kepce":
      return (
        <group position={EL} rotation={[0.9, 0, -0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.018, 0.55, 5]} />
            <meshStandardMaterial map={ahsap} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry args={[0.09, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial map={ahsap} roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
        </group>
      );

    case "asa":
      return (
        <group position={[EL.x, EL.y - 0.35, EL.z]} rotation={[0.06, 0, -0.06]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.022, 0.028, 1.55, 6]} />
            <meshStandardMaterial map={ahsap} roughness={0.92} />
          </mesh>
        </group>
      );

    case "kopuz":
      return (
        <group position={[EL.x - 0.16, EL.y - 0.18, EL.z + 0.2]} rotation={[0.35, 0, -0.5]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <sphereGeometry args={[0.14, 12, 10]} />
            <meshStandardMaterial map={ahsap} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.36, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.026, 0.78, 6]} />
            <meshStandardMaterial map={ahsap} roughness={0.88} />
          </mesh>
          {[-0.012, 0, 0.012].map((o, i) => (
            <mesh key={i} position={[o, 0.2, 0.045]}>
              <cylinderGeometry args={[0.0025, 0.0025, 0.9, 3]} />
              <meshStandardMaterial color="#E4DCC8" roughness={1} />
            </mesh>
          ))}
        </group>
      );

    default:
      return null;
  }
}
