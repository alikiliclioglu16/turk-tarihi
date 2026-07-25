"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ahsapDokusu, keceDokusu, kilimDokusu, tamgaDokusu } from "@/lib/textures";

/* ============================================================
   PROSEDÜREL VARLIK MODELLERİ
   GLB gelene kadar sahnede duracak "yüksek özenli yer tutucular".
   Her biri, gerçek modeli geldiğinde tek satırla devre dışı kalır.
   ============================================================ */

export function OtagModel({ olcek = 1 }: { olcek?: number }) {
  const kece = useMemo(() => keceDokusu(), []);
  const kilim = useMemo(() => kilimDokusu(), []);
  const ahsap = useMemo(() => ahsapDokusu(), []);

  return (
    <group scale={olcek}>
      {/* keçe gövde */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.6, 2.9, 2.0, 18]} />
        <meshStandardMaterial map={kece} roughness={0.95} />
      </mesh>
      {/* konik çatı */}
      <mesh position={[0, 2.95, 0]} castShadow>
        <coneGeometry args={[3.1, 1.9, 18]} />
        <meshStandardMaterial color="#C9BA98" roughness={0.95} />
      </mesh>
      {/* kilim kuşağı */}
      <mesh position={[0, 1.62, 0]}>
        <cylinderGeometry args={[2.93, 2.95, 0.55, 18, 1, true]} />
        <meshStandardMaterial map={kilim} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* kapı çerçevesi */}
      <mesh position={[0, 0.9, 2.86]}>
        <boxGeometry args={[1.25, 1.8, 0.1]} />
        <meshStandardMaterial map={ahsap} roughness={0.8} />
      </mesh>
      {/* keçe kapı örtüsü */}
      <mesh position={[0, 0.95, 2.93]}>
        <planeGeometry args={[1.05, 1.6]} />
        <meshStandardMaterial map={kilim} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* tepe halkası (duman deliği) */}
      <mesh position={[0, 3.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.32, 0.5, 14]} />
        <meshStandardMaterial color="#4C3116" side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      {/* gergi ipleri */}
      {[0.6, 2.1, 3.6, 5.1].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 3.4, 0.6, Math.sin(a) * 3.4]} rotation={[0, -a, 0.5]}>
          <cylinderGeometry args={[0.02, 0.02, 2.4, 5]} />
          <meshStandardMaterial color="#8A7A5C" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function OcakModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  const taslar = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => {
        const a = (i / 11) * Math.PI * 2;
        return {
          pos: [Math.cos(a) * 1.15, 0.14, Math.sin(a) * 1.15] as [number, number, number],
          rot: [Math.random() * 3, Math.random() * 3, Math.random() * 3] as [number, number, number],
          s: 0.8 + Math.random() * 0.5,
        };
      }),
    []
  );

  return (
    <group>
      {taslar.map((t, i) => (
        <mesh key={i} position={t.pos} rotation={t.rot} scale={t.s} castShadow>
          <dodecahedronGeometry args={[0.24, 0]} />
          <meshStandardMaterial color="#3E4A5E" roughness={1} flatShading />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.22, 0]} rotation={[0, (i / 5) * Math.PI * 2, Math.PI / 2.25]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 1.6, 7]} />
          <meshStandardMaterial map={ahsap} color="#4C3116" roughness={1} />
        </mesh>
      ))}
      {/* kararmış kül tabakası */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.05, 20]} />
        <meshStandardMaterial color="#1C1A18" roughness={1} />
      </mesh>
    </group>
  );
}

export function SacayakKazanModel() {
  return (
    <group>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.62, 1.2, Math.sin(a) * 0.62]}
            rotation={[Math.cos(a) * 0.26, 0, -Math.sin(a) * 0.26]}
            castShadow
          >
            <cylinderGeometry args={[0.045, 0.05, 2.6, 6]} />
            <meshStandardMaterial color="#3A2A18" roughness={0.9} />
          </mesh>
        );
      })}
      <mesh position={[0, 2.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.55, 5]} />
        <meshStandardMaterial color="#2C2C34" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.42, 18, 12, 0, Math.PI * 2, Math.PI * 0.34, Math.PI * 0.66]} />
        <meshStandardMaterial color="#2C2C34" metalness={0.55} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 2.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.45, 16]} />
        <meshStandardMaterial color="#1E1E24" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function SandikModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.88, 0.95]} />
        <meshStandardMaterial map={ahsap} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.88, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.48, 0.48, 1.6, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial map={ahsap} roughness={0.8} />
      </mesh>
      {[-0.52, 0.52].map((x) => (
        <mesh key={x} position={[x, 0.46, 0]}>
          <boxGeometry args={[0.11, 0.94, 1.0]} />
          <meshStandardMaterial color="#4A4238" metalness={0.55} roughness={0.55} />
        </mesh>
      ))}
      {/* kilit */}
      <mesh position={[0, 0.76, 0.5]}>
        <boxGeometry args={[0.22, 0.28, 0.09]} />
        <meshStandardMaterial color="#C9A24B" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* köşe pulları */}
      {[[-0.74, 0.06, 0.44], [0.74, 0.06, 0.44], [-0.74, 0.06, -0.44], [0.74, 0.06, -0.44]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
          <meshStandardMaterial color="#4A4238" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function BalbalModel({ olcek = 1 }: { olcek?: number }) {
  const tamga = useMemo(() => tamgaDokusu(), []);
  return (
    <group scale={olcek} rotation={[0.03, 0, 0.04]}>
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 2.0, 0.42]} />
        <meshStandardMaterial map={tamga} roughness={1} />
      </mesh>
      {/* yontulmuş baş */}
      <mesh position={[0, 2.06, 0.02]} castShadow>
        <sphereGeometry args={[0.28, 12, 10]} />
        <meshStandardMaterial color="#5A6474" roughness={1} flatShading />
      </mesh>
      {/* taban taşları */}
      {[[-0.4, 0.06, 0.3], [0.42, 0.06, -0.26], [0.1, 0.05, 0.44]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[i, i * 2, i * 0.5]}>
          <dodecahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#4A5568" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function KopuzModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group rotation={[0, 0, -0.12]}>
      <mesh position={[0, 0.18, 0.25]} scale={[1, 0.45, 1.5]} castShadow>
        <sphereGeometry args={[0.3, 16, 12]} />
        <meshStandardMaterial map={ahsap} color="#8A6238" roughness={0.6} />
      </mesh>
      {/* deri kapak */}
      <mesh position={[0, 0.31, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 18]} />
        <meshStandardMaterial color="#C9A882" roughness={0.85} />
      </mesh>
      {/* sap */}
      <mesh position={[0, 0.24, -0.45]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 1.15, 8]} />
        <meshStandardMaterial color="#5A3D20" roughness={0.6} />
      </mesh>
      {/* burgu */}
      <mesh position={[0.07, 0.3, -0.98]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.18, 6]} />
        <meshStandardMaterial color="#3A2A18" roughness={0.7} />
      </mesh>
      {/* teller */}
      {[-0.025, 0.025].map((x) => (
        <mesh key={x} position={[x, 0.33, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 1.25, 4]} />
          <meshStandardMaterial color="#EDE3CB" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function KilimModel() {
  const kilim = useMemo(() => kilimDokusu(), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
      <planeGeometry args={[2.8, 1.9]} />
      <meshStandardMaterial map={kilim} roughness={1} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function KayaModel({ olcek = 1 }: { olcek?: number }) {
  return (
    <mesh scale={[olcek, olcek * 0.7, olcek]} position={[0, 0.16 * olcek, 0]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.42, 0]} />
      <meshStandardMaterial color="#46536A" roughness={1} flatShading />
    </mesh>
  );
}
