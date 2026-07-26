"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ahsapDokusu } from "@/lib/textures";

/* ============================================================
   HAYVANLAR — obanın canlıları
   Hepsi düşük parçalı; yakın mesafede çizilir, uzakta siluete düşer.
   ============================================================ */

export function InekModel({ olcek = 1, renk = "#6B4A32" }: { olcek?: number; renk?: string }) {
  const bas = useRef<THREE.Group>(null);
  const kuyruk = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (bas.current) bas.current.rotation.x = 0.35 + Math.sin(t * 0.6) * 0.22; // otluyor
    if (kuyruk.current) kuyruk.current.rotation.z = 2.7 + Math.sin(t * 2.2) * 0.25;
  });
  return (
    <group scale={olcek}>
      <mesh position={[0, 1.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.46, 1.0, 6, 12]} />
        <meshStandardMaterial color={renk} roughness={0.9} />
      </mesh>
      <group ref={bas} position={[0.95, 1.05, 0]}>
        <mesh position={[0.3, -0.1, 0]} castShadow>
          <boxGeometry args={[0.55, 0.34, 0.32]} />
          <meshStandardMaterial color={renk} roughness={0.9} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.16, 0.1, 0.14 * s]} rotation={[0, 0, 0.6 * s]}>
            <coneGeometry args={[0.05, 0.22, 6]} />
            <meshStandardMaterial color="#E8DCC0" roughness={0.7} />
          </mesh>
        ))}
      </group>
      {([[0.5, 1], [0.5, -1], [-0.5, 1], [-0.5, -1]] as const).map(([bx, sy], i) => (
        <mesh key={i} position={[bx, 0.42, 0.26 * sy]} castShadow>
          <cylinderGeometry args={[0.09, 0.075, 0.9, 6]} />
          <meshStandardMaterial color="#4A3524" roughness={0.9} />
        </mesh>
      ))}
      <mesh ref={kuyruk} position={[-0.95, 1.0, 0]} rotation={[0, 0, 2.7]}>
        <cylinderGeometry args={[0.04, 0.02, 0.8, 5]} />
        <meshStandardMaterial color="#3A2A1C" roughness={1} />
      </mesh>
    </group>
  );
}

export function EsekModel({ olcek = 1 }: { olcek?: number }) {
  const kulak = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (kulak.current) kulak.current.rotation.z = Math.sin(clock.elapsedTime * 1.4) * 0.18;
  });
  return (
    <group scale={olcek}>
      <mesh position={[0, 0.85, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.32, 0.75, 6, 10]} />
        <meshStandardMaterial color="#8A8079" roughness={0.92} />
      </mesh>
      <mesh position={[0.66, 1.1, 0]} rotation={[0, 0, -0.7]} castShadow>
        <capsuleGeometry args={[0.14, 0.36, 5, 8]} />
        <meshStandardMaterial color="#8A8079" roughness={0.92} />
      </mesh>
      <mesh position={[0.92, 1.34, 0]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[0.42, 0.2, 0.2]} />
        <meshStandardMaterial color="#8A8079" roughness={0.92} />
      </mesh>
      <group ref={kulak} position={[0.82, 1.5, 0]}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0, 0.1, 0.08 * s]} rotation={[0, 0, -0.15]}>
            <capsuleGeometry args={[0.035, 0.2, 4, 6]} />
            <meshStandardMaterial color="#8A8079" roughness={0.92} />
          </mesh>
        ))}
      </group>
      {([[0.4, 1], [0.4, -1], [-0.4, 1], [-0.4, -1]] as const).map(([bx, sy], i) => (
        <mesh key={i} position={[bx, 0.34, 0.18 * sy]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.7, 6]} />
          <meshStandardMaterial color="#6E655E" roughness={0.92} />
        </mesh>
      ))}
      {/* semer */}
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.5, 0.14, 0.5]} />
        <meshStandardMaterial color="#A8382F" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function KopekModel({ olcek = 1 }: { olcek?: number }) {
  const grup = useRef<THREE.Group>(null);
  const kuyruk = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (kuyruk.current) kuyruk.current.rotation.y = Math.sin(t * 6) * 0.5;
    if (grup.current) grup.current.position.y = Math.abs(Math.sin(t * 2)) * 0.02;
  });
  return (
    <group ref={grup} scale={olcek}>
      <mesh position={[0, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.16, 0.42, 5, 8]} />
        <meshStandardMaterial color="#7A6248" roughness={0.95} />
      </mesh>
      <mesh position={[0.38, 0.52, 0]} castShadow>
        <boxGeometry args={[0.24, 0.18, 0.17]} />
        <meshStandardMaterial color="#7A6248" roughness={0.95} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.32, 0.64, 0.07 * s]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.045, 0.12, 5]} />
          <meshStandardMaterial color="#5E4A34" roughness={0.95} />
        </mesh>
      ))}
      {([[0.2, 1], [0.2, -1], [-0.2, 1], [-0.2, -1]] as const).map(([bx, sy], i) => (
        <mesh key={i} position={[bx, 0.17, 0.1 * sy]}>
          <cylinderGeometry args={[0.035, 0.03, 0.34, 5]} />
          <meshStandardMaterial color="#5E4A34" roughness={0.95} />
        </mesh>
      ))}
      <mesh ref={kuyruk} position={[-0.34, 0.5, 0]} rotation={[0, 0, 0.9]}>
        <cylinderGeometry args={[0.03, 0.02, 0.3, 5]} />
        <meshStandardMaterial color="#5E4A34" roughness={1} />
      </mesh>
    </group>
  );
}

export function KediModel({ olcek = 1 }: { olcek?: number }) {
  const kuyruk = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (kuyruk.current) kuyruk.current.rotation.x = Math.sin(clock.elapsedTime * 1.6) * 0.35;
  });
  return (
    <group scale={olcek}>
      <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.095, 0.24, 5, 8]} />
        <meshStandardMaterial color="#9A8A72" roughness={0.95} />
      </mesh>
      <mesh position={[0.22, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial color="#9A8A72" roughness={0.95} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.22, 0.4, 0.05 * s]}>
          <coneGeometry args={[0.035, 0.09, 5]} />
          <meshStandardMaterial color="#8A7A62" roughness={0.95} />
        </mesh>
      ))}
      <mesh ref={kuyruk} position={[-0.2, 0.3, 0]} rotation={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.014, 0.34, 5]} />
        <meshStandardMaterial color="#8A7A62" roughness={1} />
      </mesh>
    </group>
  );
}

export function AhirModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {/* sundurma direkleri */}
      {([[-3, -2], [3, -2], [-3, 2], [3, 2]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, 1.3, z]} castShadow>
          <cylinderGeometry args={[0.13, 0.15, 2.6, 7]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      {/* çatı */}
      <mesh position={[0, 2.75, 0]} rotation={[0.12, 0, 0]} castShadow>
        <boxGeometry args={[7.2, 0.16, 5.0]} />
        <meshStandardMaterial color="#9A8558" roughness={1} />
      </mesh>
      {/* saman yığını */}
      <mesh position={[-2.2, 0.55, 0.8]} castShadow>
        <cylinderGeometry args={[0.9, 1.05, 1.1, 10]} />
        <meshStandardMaterial color="#C9A863" roughness={1} />
      </mesh>
      {/* yemlik */}
      <mesh position={[1.8, 0.4, -1.4]} castShadow>
        <boxGeometry args={[2.6, 0.5, 0.7]} />
        <meshStandardMaterial map={ahsap} roughness={0.92} />
      </mesh>
      {/* arka çit */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={`c${i}`} position={[-3.4 + i * 0.85, 0.7, -2.6]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 1.4, 5]} />
          <meshStandardMaterial map={ahsap} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/** Gökyüzünde daire çizen kartal */
export function Kartal({ merkez, yaricap = 40, yukseklik = 34, hiz = 0.12 }:
  { merkez: [number, number]; yaricap?: number; yukseklik?: number; hiz?: number }) {
  const grup = useRef<THREE.Group>(null);
  const solKanat = useRef<THREE.Mesh>(null);
  const sagKanat = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const a = t * hiz;
    if (grup.current) {
      grup.current.position.set(
        merkez[0] + Math.cos(a) * yaricap,
        yukseklik + Math.sin(t * 0.4) * 3,
        merkez[1] + Math.sin(a) * yaricap
      );
      grup.current.rotation.y = -a + Math.PI / 2;
      grup.current.rotation.z = 0.25;
    }
    const cirp = Math.sin(t * 2.4) * 0.28;
    if (solKanat.current) solKanat.current.rotation.z = 0.1 + cirp;
    if (sagKanat.current) sagKanat.current.rotation.z = -0.1 - cirp;
  });

  return (
    <group ref={grup}>
      <mesh castShadow>
        <capsuleGeometry args={[0.22, 0.9, 4, 8]} />
        <meshStandardMaterial color="#4A3A28" roughness={0.9} />
      </mesh>
      <mesh ref={solKanat} position={[0, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.05, 2.4]} />
        <meshStandardMaterial color="#3E3222" roughness={0.95} />
      </mesh>
      <mesh ref={sagKanat} position={[0, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.05, 2.4]} />
        <meshStandardMaterial color="#3E3222" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.05, 0.62]}>
        <sphereGeometry args={[0.17, 8, 8]} />
        <meshStandardMaterial color="#E8DCC0" roughness={0.9} />
      </mesh>
    </group>
  );
}
