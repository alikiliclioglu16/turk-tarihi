"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";
import { ahsapDokusu, keceDokusu, kilimDokusu } from "@/lib/textures";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { DUNYA_OLCEK } from "@/lib/dunyaOlcek";

interface Props {
  pos: [number, number];
  rotY?: number;
  olcek?: number;
  /** iç düzen çeşidi */
  tur?: "aile" | "usta" | "bey" | "hakan";
}

/**
 * GİRİLEBİLİR OTAĞ
 *
 * Kapıdan içeri girilebilir. Oyuncu içerideyken çatı ve gövde saydamlaşır,
 * içerideki eşyalar görünür: yer yatağı, sandık, ocak, beşik, tezgâh,
 * asılı kaplar, kilimler.
 *
 * Otağın içi de dışı kadar önemlidir — günlük hayatın çoğu orada geçerdi.
 */
export function GirilebilirOtag({ pos: hamPos, rotY = 0, olcek = 1.35, tur = "aile" }: Props) {
  const pos: [number, number] = [hamPos[0] * DUNYA_OLCEK, hamPos[1] * DUNYA_OLCEK];
  const kece = useMemo(() => keceDokusu(), []);
  const kilim = useMemo(() => kilimDokusu(), []);
  const ahsap = useMemo(() => ahsapDokusu(), []);
  const [iceride, setIceride] = useState(false);
  const govdeMat = useRef<THREE.MeshStandardMaterial>(null);
  const catiMat = useRef<THREE.MeshStandardMaterial>(null);
  const y = araziYukseklik(pos[0], pos[1]);
  const R = 3.4 * olcek;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const d = Math.hypot(oyuncuKonumu.x - pos[0], oyuncuKonumu.z - pos[1]);
    const ic = d < R * 0.95;
    if (ic !== iceride) setIceride(ic);
    const hedef = ic ? 0.14 : 1;
    if (govdeMat.current) {
      govdeMat.current.opacity += (hedef - govdeMat.current.opacity) * dt * 6;
    }
    if (catiMat.current) {
      catiMat.current.opacity += (hedef - catiMat.current.opacity) * dt * 6;
    }
  });

  return (
    <group position={[pos[0], y, pos[1]]} rotation={[0, rotY, 0]} scale={olcek}>
      {/* hakan otağı: kırmızı çatı, tuğ, ek süsleme */}
      {tur === "hakan" && (
        <>
          <mesh position={[0, 5.6, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.17, 5.0, 7]} />
            <meshStandardMaterial map={ahsap} roughness={0.9} />
          </mesh>
          <mesh position={[0, 8.0, 0]}>
            <sphereGeometry args={[0.2, 12, 10]} />
            <meshStandardMaterial color="#C9A24B" metalness={0.7} roughness={0.3} />
          </mesh>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.1, 7.4, Math.sin(a) * 0.1]}
                rotation={[Math.cos(a) * 0.25, 0, -Math.sin(a) * 0.25]}>
                <cylinderGeometry args={[0.018, 0.008, 0.8, 4]} />
                <meshStandardMaterial color="#2B2118" roughness={1} />
              </mesh>
            );
          })}
        </>
      )}

      {/* --- DIŞ KABUK (içeri girince saydamlaşır) --- */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.6, 2.9, 2.1, 20, 1, true]} />
        <meshStandardMaterial
          ref={govdeMat}
          map={kece}
          roughness={0.96}
          side={THREE.DoubleSide}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh position={[0, 3.0, 0]} castShadow>
        <coneGeometry args={[3.1, 1.9, 20, 1, true]} />
        <meshStandardMaterial
          ref={catiMat}
          color={tur === "hakan" ? "#9E3A32" : tur === "bey" ? "#B4553F" : "#C9BA98"}
          roughness={0.96}
          side={THREE.DoubleSide}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh position={[0, 1.68, 0]}>
        <cylinderGeometry args={[2.93, 2.95, 0.55, 20, 1, true]} />
        <meshStandardMaterial map={kilim} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>

      {/* kapı çerçevesi ve açık perde */}
      <mesh position={[0, 0.95, 2.86]}>
        <boxGeometry args={[1.35, 1.9, 0.12]} />
        <meshStandardMaterial map={ahsap} roughness={0.85} />
      </mesh>
      <mesh position={[-0.75, 0.95, 2.93]} rotation={[0, -0.7, 0]}>
        <planeGeometry args={[0.9, 1.75]} />
        <meshStandardMaterial map={kilim} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>

      {/* --- İÇ MEKÂN --- */}
      {/* zemin kilimleri */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <circleGeometry args={[2.75, 22]} />
        <meshStandardMaterial color="#5A4632" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0.3]} position={[-0.9, 0.05, -0.6]} receiveShadow>
        <planeGeometry args={[2.4, 1.7]} />
        <meshStandardMaterial map={kilim} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, -0.5]} position={[1.2, 0.05, 0.9]} receiveShadow>
        <planeGeometry args={[1.8, 1.3]} />
        <meshStandardMaterial map={kilim} roughness={1} />
      </mesh>

      {/* iç ocak */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 14]} />
        <meshStandardMaterial color="#241C14" roughness={1} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.58, 0.13, Math.sin(a) * 0.58]} castShadow>
            <dodecahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial color="#3E4A5E" roughness={1} flatShading />
          </mesh>
        );
      })}
      <mesh position={[0, 0.34, 0]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshBasicMaterial color="#E5703A" transparent opacity={0.85} />
      </mesh>
      <pointLight position={[0, 0.7, 0]} color="#f0a44a" intensity={iceride ? 9 : 3} distance={7} decay={2} />

      {/* yer yatağı ve yastıklar */}
      <mesh position={[-1.5, 0.16, -1.2]} rotation={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.9, 0.22, 0.9]} />
        <meshStandardMaterial color="#B7A88C" roughness={1} />
      </mesh>
      <mesh position={[-2.1, 0.34, -1.5]} rotation={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.6, 0.18, 0.4]} />
        <meshStandardMaterial map={kilim} roughness={1} />
      </mesh>

      {/* sandık */}
      <mesh position={[1.9, 0.32, -1.1]} rotation={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[1.1, 0.6, 0.65]} />
        <meshStandardMaterial map={ahsap} roughness={0.85} />
      </mesh>
      <mesh position={[1.9, 0.64, -1.1]} rotation={[0, -0.5, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.33, 0.33, 1.1, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial map={ahsap} roughness={0.85} />
      </mesh>

      {/* asılı kaplar ve tulum */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[1.6 * s, 1.75, -1.9]} castShadow>
          <sphereGeometry args={[0.2, 12, 10]} />
          <meshStandardMaterial color={s > 0 ? "#8A6238" : "#6B4A2E"} roughness={0.9} />
        </mesh>
      ))}

      {/* iç direkler */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + 0.4;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.3, 1.2, Math.sin(a) * 2.3]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 2.4, 6]} />
            <meshStandardMaterial map={ahsap} roughness={0.9} />
          </mesh>
        );
      })}

      {/* türe göre ek eşya */}
      {tur === "aile" && (
        <group position={[0.4, 0, -2.0]}>
          {/* beşik */}
          <mesh position={[0, 0.42, 0]} rotation={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.8, 0.34, 0.44]} />
            <meshStandardMaterial map={ahsap} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.22, 0]} rotation={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.1, 10, 1, false, 0, Math.PI]} />
            <meshStandardMaterial map={ahsap} roughness={0.9} />
          </mesh>
        </group>
      )}
      {tur === "usta" && (
        <group position={[-1.9, 0, 1.3]} rotation={[0, 0.8, 0]}>
          {[-0.6, 0.6].map((x) => (
            <mesh key={x} position={[x, 0.7, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.06, 1.4, 6]} />
              <meshStandardMaterial map={ahsap} roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[0, 0.85, 0.02]}>
            <planeGeometry args={[1.1, 0.8]} />
            <meshStandardMaterial map={kilim} roughness={1} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
      {(tur === "bey" || tur === "hakan") && (
        <group position={[0, 0, -2.1]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[1.5, 0.5, 0.8]} />
            <meshStandardMaterial map={kilim} roughness={1} />
          </mesh>
          <mesh position={[0, 0.62, -0.3]} castShadow>
            <boxGeometry args={[1.4, 0.24, 0.25]} />
            <meshStandardMaterial color="#8A2C25" roughness={0.95} />
          </mesh>
          {/* asılı yay ve sadak — bey otağı dekoru, kullanım yok */}
          <mesh position={[-1.4, 1.5, -0.4]} rotation={[0, 0.4, 0.2]}>
            <torusGeometry args={[0.42, 0.03, 6, 14, Math.PI * 1.1]} />
            <meshStandardMaterial color="#6E4B26" roughness={0.85} />
          </mesh>
          <mesh position={[1.3, 1.4, -0.5]} rotation={[0, -0.3, 0.15]} castShadow>
            <cylinderGeometry args={[0.13, 0.15, 0.6, 10]} />
            <meshStandardMaterial color="#7A5A3A" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
}
