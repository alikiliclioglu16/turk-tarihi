"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ahsapDokusu, keceDokusu, kilimDokusu, tamgaDokusu } from "@/lib/textures";

/* ============================================================
   BALBAL SIRTI
   ============================================================ */

export function BuyukBalbalModel() {
  const tamga = useMemo(() => tamgaDokusu(), []);
  return (
    <group>
      <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 2.9, 0.56]} />
        <meshStandardMaterial map={tamga} roughness={1} />
      </mesh>
      <mesh position={[0, 3.0, 0.03]} castShadow>
        <sphereGeometry args={[0.36, 14, 12]} />
        <meshStandardMaterial color="#5A6474" roughness={1} flatShading />
      </mesh>
      {/* kâse tutan el kabartması */}
      <mesh position={[0, 1.55, 0.3]}>
        <cylinderGeometry args={[0.14, 0.16, 0.12, 12]} />
        <meshStandardMaterial color="#4E5766" roughness={1} />
      </mesh>
      {/* taban taşları */}
      {[[-0.5, 0.35], [0.55, -0.3], [0.15, 0.55]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.1, z]} rotation={[i, i * 2, i]} castShadow>
          <dodecahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#4A5568" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function DevrikBalbalModel() {
  const tamga = useMemo(() => tamgaDokusu(), []);
  return (
    <group rotation={[0, 0.4, 1.35]} position={[0, 0.3, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.9, 0.42]} />
        <meshStandardMaterial map={tamga} roughness={1} />
      </mesh>
      <mesh position={[0, 1.02, 0]} castShadow>
        <sphereGeometry args={[0.26, 12, 10]} />
        <meshStandardMaterial color="#5A6474" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

export function YazitTasiModel() {
  const tamga = useMemo(() => tamgaDokusu(), []);
  return (
    <group>
      {/* ana blok — kırık kenarlı */}
      <mesh position={[0, 1.1, 0]} rotation={[0.04, 0.1, -0.03]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 2.2, 0.45]} />
        <meshStandardMaterial map={tamga} roughness={1} />
      </mesh>
      {/* kopmuş köşe boşluğu — koyu gölge parçası */}
      <mesh position={[0.42, 1.95, 0.24]} rotation={[0.3, 0.2, 0.5]}>
        <boxGeometry args={[0.42, 0.5, 0.12]} />
        <meshStandardMaterial color="#1A1F28" roughness={1} />
      </mesh>
      {/* aşınmış yüzey — okunamaz oyuklar (gerçek yazı YOK) */}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i}
          position={[-0.3 + (i % 3) * 0.28, 1.85 - Math.floor(i / 3) * 0.28, 0.235]}
          rotation={[0, 0, (i % 5) * 0.3]}>
          <boxGeometry args={[0.035, 0.13 + (i % 3) * 0.04, 0.012]} />
          <meshStandardMaterial color="#3C4552" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.95, 0.24, 8]} />
        <meshStandardMaterial color="#46536A" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

export function TasDizisiModel() {
  const taslar = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({
      pos: [i * 0.85 - 3.4, 0.14, Math.sin(i * 1.3) * 0.4] as [number, number, number],
      s: 0.6 + ((i * 7) % 5) * 0.12,
      rot: [i, i * 1.7, i * 0.6] as [number, number, number],
    })),
    []
  );
  return (
    <group>
      {taslar.map((t, i) => (
        <mesh key={i} position={t.pos} scale={t.s} rotation={t.rot} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#4A5568" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function KayalikYamacModel({ olcek = 1 }: { olcek?: number }) {
  const parcalar = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({
      pos: [Math.cos(i * 1.4) * 2.2, 0.3 + (i % 3) * 0.5, Math.sin(i * 1.9) * 1.8] as [number, number, number],
      s: 0.8 + (i % 4) * 0.35,
      rot: [i * 0.7, i, i * 0.4] as [number, number, number],
    })),
    []
  );
  return (
    <group scale={olcek}>
      {parcalar.map((p, i) => (
        <mesh key={i} position={p.pos} scale={[p.s, p.s * 0.7, p.s]} rotation={p.rot} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color="#3E4A5E" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   SU BAŞI
   ============================================================ */

export function SogutModel({ olcek = 1 }: { olcek?: number }) {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  const dallar = useMemo(
    () => Array.from({ length: 22 }, (_, i) => {
      const a = (i / 22) * Math.PI * 2;
      const r = 1.6 + ((i * 5) % 7) * 0.24;
      return {
        pos: [Math.cos(a) * r, 3.4 - ((i * 3) % 5) * 0.28, Math.sin(a) * r] as [number, number, number],
        boy: 1.6 + ((i * 11) % 6) * 0.34,
      };
    }),
    []
  );
  return (
    <group scale={olcek}>
      <mesh position={[0, 1.9, 0]} rotation={[0.05, 0, 0.06]} castShadow>
        <cylinderGeometry args={[0.24, 0.42, 3.8, 9]} />
        <meshStandardMaterial map={ahsap} color="#5A4A38" roughness={1} />
      </mesh>
      {/* sarkan dallar */}
      {dallar.map((d, i) => (
        <mesh key={i} position={[d.pos[0], d.pos[1] - d.boy / 2, d.pos[2]]} castShadow>
          <cylinderGeometry args={[0.035, 0.012, d.boy, 5]} />
          <meshStandardMaterial color="#3E5548" roughness={1} />
        </mesh>
      ))}
      {/* yaprak kütlesi */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[2.5, 14, 10]} />
        <meshStandardMaterial color="#334A3E" roughness={1} flatShading transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

export function DereTaslariModel() {
  const taslar = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({
      pos: [(i % 6) * 0.9 - 2.4 + Math.sin(i) * 0.4, 0.08, Math.floor(i / 6) * 0.8 - 0.8 + Math.cos(i * 2) * 0.3] as [number, number, number],
      s: 0.35 + ((i * 13) % 5) * 0.12,
      rot: [i, i * 1.3, i * 0.8] as [number, number, number],
    })),
    []
  );
  return (
    <group>
      {taslar.map((t, i) => (
        <mesh key={i} position={t.pos} scale={[t.s, t.s * 0.55, t.s]} rotation={t.rot} receiveShadow>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#5A6470" roughness={0.75} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function SazlikModel() {
  const saplar = useMemo(
    () => Array.from({ length: 26 }, (_, i) => ({
      x: (Math.random() - 0.5) * 2.4,
      z: (Math.random() - 0.5) * 1.6,
      boy: 0.9 + Math.random() * 0.9,
      egim: (Math.random() - 0.5) * 0.3,
    })),
    []
  );
  return (
    <group>
      {saplar.map((s, i) => (
        <mesh key={i} position={[s.x, s.boy / 2, s.z]} rotation={[s.egim, 0, s.egim * 0.7]}>
          <cylinderGeometry args={[0.012, 0.022, s.boy, 4]} />
          <meshStandardMaterial color="#6B7A52" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function SuSehpasiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 1.1, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 1.15, 6]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* asılı tulum */}
      <mesh position={[0, 0.72, 0]} scale={[1, 1.25, 1]} castShadow>
        <sphereGeometry args={[0.24, 12, 10]} />
        <meshStandardMaterial color="#6B4A2E" roughness={0.92} />
      </mesh>
      {/* oluk */}
      <mesh position={[0, 0.28, 0.35]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.9, 0.06, 0.26]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
    </group>
  );
}

export function BaglamaDiregiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      <mesh position={[0, 0.75, 0]} rotation={[0, 0, 0.05]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 1.5, 7]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.48, 0]}>
        <sphereGeometry args={[0.11, 10, 8]} />
        <meshStandardMaterial color="#5A3D20" roughness={0.85} />
      </mesh>
      {/* sarkan ip */}
      <mesh position={[0.16, 1.05, 0.05]} rotation={[0.2, 0, 0.5]}>
        <cylinderGeometry args={[0.018, 0.018, 0.9, 5]} />
        <meshStandardMaterial color="#8A7A5C" roughness={1} />
      </mesh>
    </group>
  );
}

export function AtModel({ olcek = 1 }: { olcek?: number }) {
  const at = "#4A3826";
  const yele = "#241A10";
  return (
    <group scale={olcek}>
      <mesh position={[0, 1.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.44, 0.8, 6, 12]} />
        <meshStandardMaterial color={at} roughness={0.88} />
      </mesh>
      <mesh position={[0.82, 1.5, 0]} rotation={[0, 0, -0.75]} castShadow>
        <capsuleGeometry args={[0.2, 0.55, 5, 10]} />
        <meshStandardMaterial color={at} roughness={0.88} />
      </mesh>
      <mesh position={[1.24, 1.82, 0]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[0.52, 0.24, 0.24]} />
        <meshStandardMaterial color={at} roughness={0.88} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[1.12, 2.08, 0.09 * s]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.05, 0.16, 5]} />
          <meshStandardMaterial color={at} roughness={0.9} />
        </mesh>
      ))}
      {([[0.55, 1], [0.55, -1], [-0.55, 1], [-0.55, -1]] as const).map(([bx, s], i) => (
        <mesh key={i} position={[bx, 0.56, 0.22 * s]} castShadow>
          <cylinderGeometry args={[0.075, 0.06, 1.15, 6]} />
          <meshStandardMaterial color={at} roughness={0.88} />
        </mesh>
      ))}
      <mesh position={[0.86, 1.76, 0]} rotation={[0, 0, -0.7]}>
        <boxGeometry args={[0.5, 0.5, 0.07]} />
        <meshStandardMaterial color={yele} roughness={1} />
      </mesh>
      <mesh position={[-0.86, 1.06, 0]} rotation={[0, 0, 2.6]}>
        <coneGeometry args={[0.11, 0.85, 6]} />
        <meshStandardMaterial color={yele} roughness={1} />
      </mesh>
    </group>
  );
}

export function KovaModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.15, 0.32, 12]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.016, 6, 16]} />
        <meshStandardMaterial color="#4A4238" metalness={0.5} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.36, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.18, 0.014, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#4A4238" metalness={0.5} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ============================================================
   ESKİ YURT YERİ
   ============================================================ */

export function OtagIskeletiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  const kafes = useMemo(() => Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2), []);
  return (
    <group>
      {/* dikey kafes çubukları — bazıları kırık */}
      {kafes.map((a, i) => {
        const kirik = i % 5 === 0;
        const boy = kirik ? 0.8 + (i % 3) * 0.3 : 1.9;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.5, boy / 2, Math.sin(a) * 2.5]}
            rotation={[Math.cos(a) * 0.08, 0, -Math.sin(a) * 0.08]} castShadow>
            <cylinderGeometry args={[0.045, 0.055, boy, 5]} />
            <meshStandardMaterial map={ahsap} color="#4A3A26" roughness={1} />
          </mesh>
        );
      })}
      {/* çatı çubukları — çoğu düşmüş */}
      {kafes.filter((_, i) => i % 3 === 0).map((a, i) => (
        <mesh key={`c${i}`} position={[Math.cos(a) * 1.3, 2.4, Math.sin(a) * 1.3]}
          rotation={[Math.sin(a) * 0.9, 0, Math.cos(a) * -0.9]} castShadow>
          <cylinderGeometry args={[0.035, 0.045, 2.3, 5]} />
          <meshStandardMaterial map={ahsap} color="#4A3A26" roughness={1} />
        </mesh>
      ))}
      {/* yere düşmüş parçalar */}
      {[[1.8, 0.6], [-2.2, -1.1], [0.4, 2.6]].map(([x, z], i) => (
        <mesh key={`d${i}`} position={[x, 0.06, z]} rotation={[0, i * 1.2, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 1.7, 5]} />
          <meshStandardMaterial map={ahsap} color="#3E3020" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function SonmusOcakModel() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <circleGeometry args={[1.0, 20]} />
        <meshStandardMaterial color="#26221E" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[0.6, 18]} />
        <meshStandardMaterial color="#9A958C" roughness={1} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.02, 0.11, Math.sin(a) * 1.02]}
            rotation={[i, i * 1.4, i * 0.5]} castShadow>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#2E3038" roughness={1} flatShading />
          </mesh>
        );
      })}
      {/* kömürleşmiş odun */}
      {[[0.2, 0.15], [-0.25, -0.1]].map(([x, z], i) => (
        <mesh key={`o${i}`} position={[x, 0.08, z]} rotation={[0, i * 1.1, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.07, 0.7, 6]} />
          <meshStandardMaterial color="#1C1A18" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function YikikDuvarModel({ olcek = 1 }: { olcek?: number }) {
  const taslar = useMemo(
    () => Array.from({ length: 22 }, (_, i) => {
      const sira = Math.floor(i / 6);
      const sut = i % 6;
      const dus = sira > 1 && (i * 7) % 3 === 0;
      return {
        pos: [sut * 0.62 - 1.55 + (sira % 2) * 0.3, dus ? 0.14 : 0.2 + sira * 0.36, dus ? 0.7 + (i % 3) * 0.3 : 0] as [number, number, number],
        rot: [dus ? 1.2 : 0, (i * 0.4) % 1, dus ? (i % 4) * 0.5 : 0] as [number, number, number],
        s: 0.85 + ((i * 5) % 4) * 0.1,
      };
    }),
    []
  );
  return (
    <group scale={olcek}>
      {taslar.map((t, i) => (
        <mesh key={i} position={t.pos} rotation={t.rot} scale={t.s} castShadow receiveShadow>
          <boxGeometry args={[0.58, 0.32, 0.4]} />
          <meshStandardMaterial color="#57606E" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function KirikCanakModel() {
  const parcalar = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({
      pos: [Math.cos(i * 1.8) * (0.3 + i * 0.14), 0.04, Math.sin(i * 2.3) * (0.3 + i * 0.12)] as [number, number, number],
      rot: [Math.PI / 2 + (i % 3) * 0.3, i * 0.9, 0] as [number, number, number],
      s: 0.5 + (i % 4) * 0.15,
    })),
    []
  );
  return (
    <group>
      {parcalar.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={p.rot} scale={p.s} receiveShadow castShadow>
          <sphereGeometry args={[0.22, 10, 6, 0, Math.PI * 0.7, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#9A6E4E" roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export function YariGomuluKapModel() {
  return (
    <group>
      {/* toprak yığını */}
      <mesh position={[0, 0.06, 0]} scale={[1, 0.4, 1]} receiveShadow>
        <sphereGeometry args={[0.55, 14, 10]} />
        <meshStandardMaterial color="#3A3226" roughness={1} />
      </mesh>
      {/* kabın görünen üst kısmı */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.3, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color="#8A6248" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.19, 0.026, 6, 16]} />
        <meshStandardMaterial color="#7A5540" roughness={0.95} />
      </mesh>
    </group>
  );
}

export function CurumusDirekModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      <mesh position={[0, 0.62, 0]} rotation={[0.09, 0, 0.14]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 1.24, 7]} />
        <meshStandardMaterial map={ahsap} color="#3E3020" roughness={1} />
      </mesh>
      {/* çürümüş tepe */}
      <mesh position={[0.08, 1.26, 0.02]} rotation={[0.4, 0.3, 0.2]}>
        <coneGeometry args={[0.1, 0.26, 5]} />
        <meshStandardMaterial color="#33281A" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

export function HoyukModel({ olcek = 1 }: { olcek?: number }) {
  return (
    <group scale={olcek}>
      <mesh position={[0, 0.9, 0]} scale={[1, 0.35, 1]} receiveShadow castShadow>
        <sphereGeometry args={[5.2, 20, 14]} />
        <meshStandardMaterial color="#2E3630" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

export function SolmusKilimModel() {
  const kilim = useMemo(() => kilimDokusu(), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0.2, 0]} position={[0, 0.03, 0]} receiveShadow>
      <planeGeometry args={[1.5, 1.0]} />
      <meshStandardMaterial map={kilim} color="#8A8078" roughness={1} side={THREE.DoubleSide} transparent opacity={0.82} />
    </mesh>
  );
}

/* ============================================================
   ORTAK
   ============================================================ */

export function YonDiregiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, 0.04]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 2.2, 7]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* bağlı bezler */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.12 + i * 0.03, 1.85 - i * 0.22, 0.02]} rotation={[0, 0, 0.4 + i * 0.2]}>
          <planeGeometry args={[0.34, 0.1]} />
          <meshStandardMaterial
            color={i === 0 ? "#B8433A" : i === 1 ? "#D9CBAA" : "#4BB3A9"}
            roughness={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/** Dere yüzeyi — hafif dalgalanan saydam düzlem */
export function SuYuzeyiModel() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[9, 62, 1, 1]} />
      <meshStandardMaterial
        color="#1E3A4A"
        roughness={0.12}
        metalness={0.5}
        transparent
        opacity={0.82}
      />
    </mesh>
  );
}

/* ============================================================
   OBA MAHALLELERİ — pazar, zanaat, talim
   ============================================================ */

export function PazarTezgahiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  const kilim = useMemo(() => kilimDokusu(), []);
  return (
    <group>
      {/* tezgâh */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.1, 0.9]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {[[-1.05, 0.38], [1.05, 0.38], [-1.05, -0.38], [1.05, -0.38]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]} castShadow>
          <cylinderGeometry args={[0.055, 0.06, 0.72, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      {/* gölgelik direkleri ve bez */}
      {[-1.1, 1.1].map((x) => (
        <mesh key={`d${x}`} position={[x, 1.35, -0.42]} castShadow>
          <cylinderGeometry args={[0.05, 0.055, 2.0, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 2.28, 0.05]} rotation={[0.32, 0, 0]}>
        <planeGeometry args={[2.7, 1.35]} />
        <meshStandardMaterial map={kilim} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* tezgâhtaki mal: kaplar, top kumaş, sepet */}
      <mesh position={[-0.7, 0.87, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.14, 0.2, 10]} />
        <meshStandardMaterial color="#8A6238" roughness={0.9} />
      </mesh>
      <mesh position={[-0.2, 0.87, 0.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.5, 10]} />
        <meshStandardMaterial map={kilim} roughness={0.95} />
      </mesh>
      <mesh position={[0.45, 0.86, -0.1]} castShadow>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#7A5A3A" roughness={0.95} />
      </mesh>
      <mesh position={[0.95, 0.9, 0.1]} castShadow>
        <boxGeometry args={[0.34, 0.26, 0.3]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
    </group>
  );
}

export function DemirciOcagiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {/* ocak yığını */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.95, 0.9, 10]} />
        <meshStandardMaterial color="#4A4038" roughness={1} flatShading />
      </mesh>
      {/* köz */}
      <mesh position={[0, 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 14]} />
        <meshBasicMaterial color="#E5703A" transparent opacity={0.9} />
      </mesh>
      <pointLight color="#ff8a3c" intensity={7} distance={9} decay={2} position={[0, 1.1, 0]} />
      {/* körük */}
      <mesh position={[-1.05, 0.7, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.7, 0.3, 0.45]} />
        <meshStandardMaterial color="#6B4A2E" roughness={0.9} />
      </mesh>
      {/* örs ve kütük */}
      <mesh position={[1.5, 0.4, 0.2]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.8, 9]} />
        <meshStandardMaterial map={ahsap} roughness={0.95} />
      </mesh>
      <mesh position={[1.5, 0.92, 0.2]} castShadow>
        <boxGeometry args={[0.62, 0.24, 0.26]} />
        <meshStandardMaterial color="#3C4048" metalness={0.65} roughness={0.45} />
      </mesh>
      {/* su teknesi */}
      <mesh position={[0.4, 0.2, 1.3]} castShadow>
        <cylinderGeometry args={[0.35, 0.3, 0.4, 10]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* duvara dayalı yapılmış uçlar */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-1.7 + i * 0.22, 0.5, -0.9]} rotation={[0.25, 0, 0.12]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.1, 5]} />
          <meshStandardMaterial color="#8A93A6" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function TalimHedefiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.9, 0]} rotation={[0.12, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 1.8, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      {/* saman hedef */}
      <mesh position={[0, 1.45, 0.06]} rotation={[0.12, 0, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.22, 16]} />
        <meshStandardMaterial color="#C9A863" roughness={1} />
      </mesh>
      <mesh position={[0, 1.45, 0.18]} rotation={[Math.PI / 2 + 0.12, 0, 0]}>
        <ringGeometry args={[0.16, 0.24, 18]} />
        <meshStandardMaterial color="#A8382F" side={THREE.DoubleSide} roughness={1} />
      </mesh>
      {/* saplanmış oklar */}
      {[[0.1, 1.5], [-0.14, 1.38], [0.05, 1.62]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.34]} rotation={[Math.PI / 2 + 0.12, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.55, 5]} />
          <meshStandardMaterial color="#6E4B26" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function AsikOyunuModel() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[1.1, 18]} />
        <meshStandardMaterial color="#3A3226" roughness={1} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        const r = 0.25 + (i % 3) * 0.22;
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0.07, Math.sin(a) * r]} rotation={[i, i * 1.4, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.06, 3, 6]} />
            <meshStandardMaterial color="#E8DCC0" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ============================================================
   ZANAAT SAHNELERİ — işin yapıldığı yer görünsün
   ============================================================ */

export function OkYapimTezgahiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.9, 0.12, 0.75]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {([[-0.8, 0.3], [0.8, 0.3], [-0.8, -0.3], [0.8, -0.3]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.28, z]}>
          <cylinderGeometry args={[0.05, 0.055, 0.55, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      {/* düzeltilen ok gövdeleri */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`o${i}`} position={[-0.6 + i * 0.3, 0.63, 0.16]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.014, 0.8, 5]} />
          <meshStandardMaterial color="#8A6A3E" roughness={0.9} />
        </mesh>
      ))}
      {/* tüy demeti */}
      <mesh position={[0.7, 0.66, -0.2]}>
        <coneGeometry args={[0.1, 0.22, 7]} />
        <meshStandardMaterial color="#E4DCC8" roughness={1} />
      </mesh>
      {/* yay kalıbı */}
      <mesh position={[-0.55, 0.72, -0.2]} rotation={[Math.PI / 2, 0, 0.3]}>
        <torusGeometry args={[0.3, 0.035, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#6E4B26" roughness={0.85} />
      </mesh>
    </group>
  );
}

export function KeceBasmaModel() {
  const kece = useMemo(() => keceDokusu(2), []);
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {/* serili yün tabakası */}
      <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[3.2, 2.2]} />
        <meshStandardMaterial map={kece} roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* sarma silindiri */}
      <mesh position={[1.4, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 2.4, 12]} />
        <meshStandardMaterial map={kece} roughness={1} />
      </mesh>
      {/* su kovası ve sopa */}
      <mesh position={[-1.5, 0.18, 0.9]} castShadow>
        <cylinderGeometry args={[0.2, 0.17, 0.36, 10]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      <mesh position={[-1.1, 0.1, -0.9]} rotation={[0, 0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 1.5, 6]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
    </group>
  );
}

export function DeriGerdirmeModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {/* gerdirme çerçevesi */}
      {([[-1.1, 0], [1.1, 0]] as const).map(([x], i) => (
        <mesh key={i} position={[x, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 1.7, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 2.3, 6]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 2.3, 6]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* gerilmiş deri */}
      <mesh position={[0, 0.87, 0.02]}>
        <planeGeometry args={[1.9, 1.4]} />
        <meshStandardMaterial color="#B08858" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      {/* gerdirme ipleri */}
      {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
        <mesh key={i} position={[-1.05, 0.87 + y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.2, 4]} />
          <meshStandardMaterial color="#8A7A5C" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function ComlekCarkiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  const carkRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (carkRef.current) carkRef.current.rotation.y = clock.elapsedTime * 1.6;
  });
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.4, 0.6, 12]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      <mesh ref={carkRef} position={[0, 0.66, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 18]} />
        <meshStandardMaterial color="#5A4632" roughness={0.95} />
      </mesh>
      {/* şekillenen kap */}
      <mesh position={[0, 0.86, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.3, 12]} />
        <meshStandardMaterial color="#9A6E4E" roughness={0.95} />
      </mesh>
      {/* kurumaya bırakılmış kaplar */}
      {[[-0.9, 0.5], [-1.2, 0.1], [-0.7, -0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.16, z]} castShadow>
          <sphereGeometry args={[0.18, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial color="#8A6248" roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export function GuresAlaniModel() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
        <circleGeometry args={[4.2, 26]} />
        <meshStandardMaterial color="#4A4030" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[4.0, 4.3, 30]} />
        <meshStandardMaterial color="#B8433A" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* seyirci taşları */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 5.2, 0.22, Math.sin(a) * 5.2]} castShadow>
            <boxGeometry args={[0.7, 0.4, 0.5]} />
            <meshStandardMaterial color="#5A6470" roughness={1} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

export function AtEgitimCemberiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 6, 0.6, Math.sin(a) * 6]} castShadow>
            <cylinderGeometry args={[0.055, 0.07, 1.2, 5]} />
            <meshStandardMaterial map={ahsap} roughness={0.92} />
          </mesh>
        );
      })}
      {/* orta direk ve ip */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 1.8, 8]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
    </group>
  );
}

export function IpBukmeModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {[-1.3, 1.3].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 1.0, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      {[0.05, -0.05].map((z, i) => (
        <mesh key={i} position={[0, 0.95, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 2.6, 5]} />
          <meshStandardMaterial color="#C9B896" roughness={1} />
        </mesh>
      ))}
      {/* yün yumakları */}
      {[[-1.6, 0.4], [1.7, -0.3]].map(([x, z], i) => (
        <mesh key={`y${i}`} position={[x, 0.22, z]} castShadow>
          <sphereGeometry args={[0.24, 10, 8]} />
          <meshStandardMaterial color="#D8CCB0" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   ORDUGÂH — askerî bölge
   ============================================================ */

export function CadirSirasiModel({ olcek = 1 }: { olcek?: number }) {
  const kece = useMemo(() => keceDokusu(1), []);
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group scale={olcek}>
      {/* sırt çadırı — üçgen kesitli, otağdan farklı */}
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.6, 4.4, 3, 1, false]} />
        <meshStandardMaterial map={kece} color="#B9AE92" roughness={0.97} />
      </mesh>
      <mesh position={[0, 2.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 4.6, 6]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* kazık ve gergi ipleri */}
      {([[-2.4, 1.5], [2.4, 1.5], [-2.4, -1.5], [2.4, -1.5]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.03, 0.5, 5]} />
          <meshStandardMaterial color="#5A4126" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function SilahRafiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {[-1.3, 1.3].map((x) => (
        <mesh key={x} position={[x, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 1.7, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 2.7, 6]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* dayalı mızraklar */}
      {[-0.9, -0.45, 0, 0.45, 0.9].map((x, i) => (
        <group key={i} position={[x, 0, 0]} rotation={[0, 0, 0.13]}>
          <mesh position={[0, 1.35, -0.06]} castShadow>
            <cylinderGeometry args={[0.028, 0.028, 2.7, 6]} />
            <meshStandardMaterial map={ahsap} color="#5A4126" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.75, -0.06]}>
            <coneGeometry args={[0.06, 0.28, 6]} />
            <meshStandardMaterial color="#8A93A6" metalness={0.65} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {/* asılı kalkanlar */}
      {[-0.75, 0.75].map((x, i) => (
        <mesh key={`k${i}`} position={[x, 0.75, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 14]} />
          <meshStandardMaterial color={i ? "#8A4A32" : "#5A6470"} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function AtliTalimDiregiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 2.8, 8]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* dönen kol */}
      <mesh position={[0, 2.55, 0]} rotation={[0, 0.4, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.6, 6]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* asılı hedef torbası */}
      <mesh position={[1.1, 2.0, 0.45]} castShadow>
        <sphereGeometry args={[0.3, 12, 10]} />
        <meshStandardMaterial color="#9A8460" roughness={1} />
      </mesh>
    </group>
  );
}

export function TugSancakModel({ olcek = 1 }: { olcek?: number }) {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  const kilim = useMemo(() => kilimDokusu(1), []);
  const bayrak = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (bayrak.current) {
      bayrak.current.rotation.y = Math.sin(clock.elapsedTime * 1.6) * 0.22;
      bayrak.current.rotation.z = Math.sin(clock.elapsedTime * 2.1) * 0.05;
    }
  });
  return (
    <group scale={olcek}>
      <mesh position={[0, 2.4, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 4.8, 8]} />
        <meshStandardMaterial map={ahsap} roughness={0.88} />
      </mesh>
      <mesh position={[0, 4.86, 0]}>
        <sphereGeometry args={[0.13, 12, 10]} />
        <meshStandardMaterial color="#C9A24B" metalness={0.72} roughness={0.3} />
      </mesh>
      {/* sancak bezi */}
      <mesh ref={bayrak} position={[0.55, 4.1, 0]} castShadow>
        <planeGeometry args={[1.1, 0.75]} />
        <meshStandardMaterial map={kilim} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* at kılı püskül */}
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.07, 4.5, Math.sin(a) * 0.07]}
            rotation={[Math.cos(a) * 0.2, 0, -Math.sin(a) * 0.2]}>
            <cylinderGeometry args={[0.014, 0.006, 0.7, 4]} />
            <meshStandardMaterial color="#2B2118" roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}

export function NobetKulesiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {([[-1, -1], [1, -1], [-1, 1], [1, 1]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x * 1.1, 2.2, z * 1.1]} rotation={[z * 0.05, 0, -x * 0.05]} castShadow>
          <cylinderGeometry args={[0.11, 0.14, 4.4, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      {/* platform */}
      <mesh position={[0, 4.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.18, 2.8]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* korkuluk */}
      {([[0, -1.35], [0, 1.35], [-1.35, 0], [1.35, 0]] as const).map(([x, z], i) => (
        <mesh key={`k${i}`} position={[x, 4.95, z]} rotation={[0, x ? Math.PI / 2 : 0, 0]}>
          <boxGeometry args={[2.7, 0.09, 0.09]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      {/* çapraz destekler */}
      {[0, 1].map((i) => (
        <mesh key={`c${i}`} position={[0, 2.2, i ? 1.15 : -1.15]} rotation={[0, 0, 0.42]}>
          <boxGeometry args={[0.08, 4.6, 0.08]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function AtBagiModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[i * 1.6 - 4.8, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 1.2, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 10.2, 6]} />
        <meshStandardMaterial color="#8A7A5C" roughness={1} />
      </mesh>
    </group>
  );
}

/* ============================================================
   OTAĞ ÇEVRESİ SAHNELERİ — dönem doğrulu günlük hayat
   ============================================================ */

/**
 * KURUTMA SEHPASI — dönem doğrusu
 *
 * Not: Biber ve patlıcan bu dönemde bozkırda YOKTUR.
 * Biber Amerika kökenlidir (1492 sonrası). Patlıcan Hindistan kökenli,
 * o çağda İslam dünyasında bilinir ama göçebe kurutmalığı değildir.
 *
 * Dönemin doğrusu: ince dilimlenmiş et, kurut (kurutulmuş yoğurt topağı),
 * peynir, yaban meyvesi ve deri.
 */
export function EtKurutmaModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {[-1.2, 1.2].map((x) =>
        [-0.35, 0.35].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.75, z]} rotation={[0, 0, x > 0 ? -0.1 : 0.1]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 1.5, 6]} />
            <meshStandardMaterial map={ahsap} roughness={0.92} />
          </mesh>
        ))
      )}
      {[0, 1].map((i) => (
        <mesh key={i} position={[0, 1.46, i ? 0.35 : -0.35]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 2.6, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.92} />
        </mesh>
      ))}
      {/* asılı et dilimleri */}
      {[-0.9, -0.5, -0.1, 0.35, 0.8].map((x, i) => (
        <mesh key={`e${i}`} position={[x, 1.16, -0.35]} rotation={[0, i * 0.3, 0]}>
          <planeGeometry args={[0.2, 0.5]} />
          <meshStandardMaterial color={i % 2 ? "#8A4438" : "#7A3B30"} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* kurut topakları — kurutulmuş yoğurt */}
      {[-0.7, -0.25, 0.2, 0.7].map((x, i) => (
        <mesh key={`k${i}`} position={[x, 1.32, 0.35]} castShadow>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#EFE7D2" roughness={1} />
        </mesh>
      ))}
      {/* altta serili hasır */}
      <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[2.4, 1.3]} />
        <meshStandardMaterial color="#B9A473" roughness={1} />
      </mesh>
    </group>
  );
}

/** Sohbet halkası — minderler ve ortada kap */
export function SohbetHalkasiModel() {
  const kilim = useMemo(() => kilimDokusu(3), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <circleGeometry args={[2.1, 20]} />
        <meshStandardMaterial map={kilim} roughness={1} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.5, 0.11, Math.sin(a) * 1.5]} castShadow>
            <boxGeometry args={[0.6, 0.16, 0.5]} />
            <meshStandardMaterial color={i % 2 ? "#A8382F" : "#8A6A24"} roughness={1} />
          </mesh>
        );
      })}
      {/* ortada ikram kabı */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.24, 0.16, 12]} />
        <meshStandardMaterial color="#8A6238" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Süt sağma yeri — üç ayaklı tabure ve kova */
export function SutSagmaModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      {/* tabure */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.2, 0.08, 10]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {Array.from({ length: 3 }).map((_, i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.14, 0.14, Math.sin(a) * 0.14]}
            rotation={[Math.cos(a) * 0.18, 0, -Math.sin(a) * 0.18]}>
            <cylinderGeometry args={[0.028, 0.032, 0.3, 5]} />
            <meshStandardMaterial map={ahsap} roughness={0.9} />
          </mesh>
        );
      })}
      {/* süt kovası */}
      <mesh position={[0.45, 0.16, 0.2]} castShadow>
        <cylinderGeometry args={[0.19, 0.16, 0.32, 12]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* yayık */}
      <mesh position={[-0.6, 0.36, -0.3]} rotation={[0, 0, 0.12]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.72, 10]} />
        <meshStandardMaterial map={ahsap} color="#7A5A3A" roughness={0.92} />
      </mesh>
    </group>
  );
}

/** Bebek beşiği ve gölgelik — otağ önü aile sahnesi */
export function OtagOnuModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  const kilim = useMemo(() => kilimDokusu(2), []);
  return (
    <group>
      {/* serili kilim */}
      <mesh rotation={[-Math.PI / 2, 0, 0.35]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[2.6, 1.8]} />
        <meshStandardMaterial map={kilim} roughness={1} />
      </mesh>
      {/* gölgelik */}
      {([[-1.4, -0.9], [1.4, -0.9]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.95, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 1.9, 6]} />
          <meshStandardMaterial map={ahsap} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.92, -0.5]} rotation={[0.22, 0, 0]}>
        <planeGeometry args={[3.0, 1.5]} />
        <meshStandardMaterial color="#C9BA98" roughness={0.97} side={THREE.DoubleSide} />
      </mesh>
      {/* beşik */}
      <mesh position={[0.7, 0.38, 0.3]} rotation={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.75, 0.3, 0.4]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      {/* su tulumu ve kaplar */}
      <mesh position={[-0.9, 0.16, 0.5]} castShadow>
        <sphereGeometry args={[0.17, 10, 8]} />
        <meshStandardMaterial color="#6B4A2E" roughness={0.92} />
      </mesh>
      <mesh position={[-0.5, 0.13, 0.7]} castShadow>
        <cylinderGeometry args={[0.14, 0.11, 0.26, 10]} />
        <meshStandardMaterial color="#8A6238" roughness={0.92} />
      </mesh>
    </group>
  );
}

/** Yün tarama ve eğirme yeri */
export function YunEgirmeModel() {
  const ahsap = useMemo(() => ahsapDokusu(), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <circleGeometry args={[1.5, 16]} />
        <meshStandardMaterial color="#8A7A5C" roughness={1} />
      </mesh>
      {/* yün yığınları */}
      {[[-0.6, 0.3], [0.5, -0.4], [0.2, 0.6]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} castShadow>
          <sphereGeometry args={[0.26, 10, 8]} />
          <meshStandardMaterial color={i === 1 ? "#C9BEA0" : "#E0D8C2"} roughness={1} />
        </mesh>
      ))}
      {/* iğ ve sepet */}
      <mesh position={[0.85, 0.2, 0.2]} rotation={[0, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.4, 6]} />
        <meshStandardMaterial map={ahsap} roughness={0.9} />
      </mesh>
      <mesh position={[-1.0, 0.16, -0.4]} castShadow>
        <cylinderGeometry args={[0.28, 0.22, 0.3, 12]} />
        <meshStandardMaterial color="#A08A5E" roughness={1} />
      </mesh>
    </group>
  );
}
