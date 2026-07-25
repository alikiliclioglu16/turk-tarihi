"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";

interface Props {
  govdeRef: React.RefObject<THREE.Group | null>;
  basRef: React.RefObject<THREE.Group | null>;
  solKolRef: React.RefObject<THREE.Group | null>;
  sagKolRef: React.RefObject<THREE.Group | null>;
  solDirsekRef: React.RefObject<THREE.Group | null>;
  sagDirsekRef: React.RefObject<THREE.Group | null>;
  solBacakRef: React.RefObject<THREE.Group | null>;
  sagBacakRef: React.RefObject<THREE.Group | null>;
  solDizRef: React.RefObject<THREE.Group | null>;
  sagDizRef: React.RefObject<THREE.Group | null>;
  pelerinRef?: React.RefObject<THREE.Group | null>;
}

/* Boyalı poz setinden alınan renk paleti */
const TEN = "#D2A87E";
const TEN_GOLGE = "#B98A63";
const CUBBE = "#5E6B4A";       // yolculuk kaftanı
const CUBBE_IC = "#CBBE9E";    // keten gömlek
const KUSAK = "#A85A2B";       // deri kuşak
const BORK = "#7A6A4E";        // yolcu börkü
const AK = "#3A2E22";          // genç, koyu saç
const DERI = "#4A3520";
const ALTIN = "#C9A24B";

/** Cübbe silueti — dönel profil, akıcı kumaş hissi verir */
function cubbeProfili(): THREE.Vector2[] {
  return [
    new THREE.Vector2(0.20, 0.00),
    new THREE.Vector2(0.28, 0.10),
    new THREE.Vector2(0.33, 0.30),
    new THREE.Vector2(0.34, 0.55),
    new THREE.Vector2(0.31, 0.80),
    new THREE.Vector2(0.26, 1.00),
    new THREE.Vector2(0.23, 1.12),
  ];
}

/**
 * DEDE KORKUT — tam 3B karakter
 *
 * Billboard kaldırıldı. Bu model gerçek geometriden oluşur: her yönden
 * bakılabilir, ışığı doğru alır, gölgesi doğru düşer, eklemleri ayrı
 * gruplarda olduğu için tam yürüyüş döngüsü uygulanabilir.
 *
 * Rodin/Meshy'den gerçek GLB geldiğinde bu model devre dışı kalacak;
 * o zamana kadar sahnedeki karakter budur.
 */
export const GezginModel = forwardRef<THREE.Group, Props>(function GezginModel(
  {
    govdeRef, basRef, solKolRef, sagKolRef, solDirsekRef, sagDirsekRef,
    solBacakRef, sagBacakRef, solDizRef, sagDizRef, pelerinRef,
  },
  ref
) {
  const cubbeGeo = useMemo(
    () => new THREE.LatheGeometry(cubbeProfili(), 24),
    []
  );
  const pelerinGeo = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.17, 0.00),
          new THREE.Vector2(0.27, 0.14),
          new THREE.Vector2(0.31, 0.30),
          new THREE.Vector2(0.30, 0.42),
        ],
        22
      ),
    []
  );

  return (
    <group ref={ref}>
      {/* ---------------- BACAKLAR ---------------- */}
      {([
        { yan: -1, bacak: solBacakRef, diz: solDizRef },
        { yan: 1, bacak: sagBacakRef, diz: sagDizRef },
      ] as const).map(({ yan, bacak, diz }) => (
        <group key={yan} ref={bacak} position={[0.105 * yan, 0.88, 0]}>
          <mesh position={[0, -0.21, 0]} castShadow>
            <capsuleGeometry args={[0.085, 0.3, 6, 12]} />
            <meshStandardMaterial color="#6E5A3E" roughness={0.95} />
          </mesh>
          <group ref={diz} position={[0, -0.43, 0]}>
            <mesh position={[0, -0.19, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.28, 6, 12]} />
              <meshStandardMaterial color="#6E5A3E" roughness={0.95} />
            </mesh>
            {/* çizme */}
            <mesh position={[0, -0.32, 0]} castShadow>
              <cylinderGeometry args={[0.082, 0.088, 0.24, 12]} />
              <meshStandardMaterial color={DERI} roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.44, 0.05]} castShadow>
              <boxGeometry args={[0.14, 0.1, 0.3]} />
              <meshStandardMaterial color={DERI} roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.485, 0.05]}>
              <boxGeometry args={[0.145, 0.03, 0.31]} />
              <meshStandardMaterial color="#2E2114" roughness={0.9} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ---------------- GÖVDE ---------------- */}
      <group ref={govdeRef}>
        <group rotation={[0.07, 0, 0]}>
          {/* iç kaftan */}
          <mesh position={[0, 0.42, 0]} geometry={cubbeGeo} castShadow receiveShadow>
            <meshStandardMaterial color={CUBBE_IC} roughness={0.94} side={THREE.DoubleSide} />
          </mesh>
          {/* dış hırka — biraz daha geniş, önü açık */}
          <mesh position={[0, 0.44, -0.015]} geometry={cubbeGeo} scale={[1.1, 1.02, 1.1]} castShadow>
            <meshStandardMaterial color={CUBBE} roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
          {/* hırkanın açık ön kısmı — iç kaftan görünsün */}
          <mesh position={[0, 0.9, 0.3]} rotation={[0.06, 0, 0]}>
            <boxGeometry args={[0.17, 0.72, 0.03]} />
            <meshStandardMaterial color={CUBBE_IC} roughness={0.94} />
          </mesh>

          {/* göğüs / omuz kütlesi */}
          <mesh position={[0, 1.25, 0]} castShadow>
            <capsuleGeometry args={[0.19, 0.24, 8, 16]} />
            <meshStandardMaterial color={CUBBE_IC} roughness={0.94} />
          </mesh>

          {/* kuşak */}
          <mesh position={[0, 1.02, 0]}>
            <cylinderGeometry args={[0.215, 0.222, 0.15, 20]} />
            <meshStandardMaterial color={KUSAK} roughness={0.88} />
          </mesh>
          <mesh position={[0, 1.02, 0.21]}>
            <boxGeometry args={[0.14, 0.1, 0.05]} />
            <meshStandardMaterial color={ALTIN} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* kuşağın sarkan ucu */}
          <mesh position={[0.13, 0.86, 0.18]} rotation={[0.12, 0, 0.14]}>
            <boxGeometry args={[0.075, 0.34, 0.025]} />
            <meshStandardMaterial color={KUSAK} roughness={0.9} />
          </mesh>

          {/* omuz pelerini */}
          <group ref={pelerinRef} position={[0, 1.34, -0.01]}>
            <mesh geometry={pelerinGeo} castShadow>
              <meshStandardMaterial color={CUBBE} roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.02, 0]}>
              <cylinderGeometry args={[0.305, 0.312, 0.045, 22, 1, true]} />
              <meshStandardMaterial color={KUSAK} roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* omuz çantası — gezgin yolda */}
          <mesh position={[-0.24, 0.98, 0.08]} rotation={[0, 0.3, 0.2]} castShadow>
            <boxGeometry args={[0.3, 0.34, 0.16]} />
            <meshStandardMaterial color="#6B4A2E" roughness={0.9} />
          </mesh>
          <mesh position={[0.02, 1.28, 0.05]} rotation={[0, 0, -0.75]}>
            <boxGeometry args={[0.06, 0.62, 0.03]} />
            <meshStandardMaterial color="#5A3D20" roughness={0.9} />
          </mesh>
          {/* su tulumu */}
          <mesh position={[0.24, 1.0, -0.08]} scale={[1, 1.2, 1]} castShadow>
            <sphereGeometry args={[0.11, 12, 10]} />
            <meshStandardMaterial color="#7A5A3A" roughness={0.92} />
          </mesh>

          {/* boyun */}
          <mesh position={[0, 1.47, 0.005]}>
            <cylinderGeometry args={[0.055, 0.07, 0.1, 12]} />
            <meshStandardMaterial color={TEN_GOLGE} roughness={0.85} />
          </mesh>

          {/* ---------------- BAŞ ---------------- */}
          <group ref={basRef} position={[0, 1.55, 0.01]}>
            <mesh position={[0, 0.05, 0]} scale={[0.96, 1.06, 1]} castShadow>
              <sphereGeometry args={[0.115, 24, 20]} />
              <meshStandardMaterial color={TEN} roughness={0.8} />
            </mesh>
            {/* elmacık ve çene */}
            <mesh position={[0, -0.025, 0.015]} scale={[0.88, 0.78, 0.92]}>
              <sphereGeometry args={[0.1, 18, 16]} />
              <meshStandardMaterial color={TEN} roughness={0.83} />
            </mesh>
            {/* göz çukurları */}
            {[-0.045, 0.045].map((x) => (
              <mesh key={`c${x}`} position={[x, 0.048, 0.086]} scale={[1, 0.6, 0.45]}>
                <sphereGeometry args={[0.033, 12, 12]} />
                <meshStandardMaterial color={TEN_GOLGE} roughness={0.9} />
              </mesh>
            ))}
            {[-0.045, 0.045].map((x) => (
              <mesh key={`g${x}`} position={[x, 0.048, 0.101]}>
                <sphereGeometry args={[0.0145, 12, 12]} />
                <meshStandardMaterial color="#2B2118" roughness={0.2} />
              </mesh>
            ))}
            {/* ak kaşlar */}
            {[-1, 1].map((s) => (
              <mesh key={`k${s}`} position={[0.047 * s, 0.083, 0.094]} rotation={[0, 0, -0.22 * s]}>
                <capsuleGeometry args={[0.012, 0.05, 4, 10]} />
                <meshStandardMaterial color={AK} roughness={1} />
              </mesh>
            ))}
            {/* burun */}
            <mesh position={[0, 0.015, 0.105]} rotation={[0.32, 0, 0]}>
              <capsuleGeometry args={[0.019, 0.052, 5, 12]} />
              <meshStandardMaterial color={TEN} roughness={0.84} />
            </mesh>
            {/* kulaklar */}
            {[-1, 1].map((s) => (
              <mesh key={`ku${s}`} position={[0.107 * s, 0.03, -0.005]} scale={[0.4, 1, 0.72]}>
                <sphereGeometry args={[0.034, 12, 12]} />
                <meshStandardMaterial color={TEN_GOLGE} roughness={0.85} />
              </mesh>
            ))}
            {/* bıyık */}
            {[-1, 1].map((s) => (
              <mesh key={`b${s}`} position={[0.028 * s, -0.03, 0.09]} rotation={[0.18, 0, -0.55 * s]}>
                <capsuleGeometry args={[0.013, 0.04, 5, 12]} />
                <meshStandardMaterial color={AK} roughness={1} />
              </mesh>
            ))}
            {/* kısa sakal */}
            <mesh position={[0, -0.055, 0.05]} scale={[1, 0.7, 0.9]}>
              <sphereGeometry args={[0.086, 14, 12]} />
              <meshStandardMaterial color={AK} roughness={1} />
            </mesh>
            {/* ense saçı */}
            <mesh position={[0, 0.02, -0.06]} scale={[1, 0.9, 0.7]}>
              <sphereGeometry args={[0.112, 14, 12]} />
              <meshStandardMaterial color={AK} roughness={1} />
            </mesh>

            {/* yolcu başlığı — keçe külah, arkası omuza düşen */}
            <mesh position={[0, 0.16, -0.01]} scale={[1, 0.9, 1]} castShadow>
              <coneGeometry args={[0.118, 0.2, 16]} />
              <meshStandardMaterial color={BORK} roughness={0.94} />
            </mesh>
            <mesh position={[0, 0.105, 0]}>
              <cylinderGeometry args={[0.124, 0.128, 0.05, 18]} />
              <meshStandardMaterial color="#8A6A24" roughness={1} />
            </mesh>
          </group>

          {/* ---------------- KOLLAR ---------------- */}
          {([
            { yan: -1, kol: solKolRef, dirsek: solDirsekRef, asa: false },
            { yan: 1, kol: sagKolRef, dirsek: sagDirsekRef, asa: true },
          ] as const).map(({ yan, kol, dirsek, asa }) => (
            <group key={yan} ref={kol} position={[0.2 * yan, 1.38, 0]} rotation={[0, 0, 0.13 * yan]}>
              <mesh position={[0, -0.145, 0]} castShadow>
                <capsuleGeometry args={[0.062, 0.18, 6, 12]} />
                <meshStandardMaterial color={CUBBE} roughness={0.92} />
              </mesh>
              <group ref={dirsek} position={[0, -0.29, 0]}>
                <mesh position={[0, -0.13, 0]} castShadow>
                  <capsuleGeometry args={[0.05, 0.16, 6, 12]} />
                  <meshStandardMaterial color={CUBBE_IC} roughness={0.93} />
                </mesh>
                {/* el */}
                <mesh position={[0, -0.255, 0.012]} scale={[0.85, 1.15, 0.62]} castShadow>
                  <sphereGeometry args={[0.048, 14, 12]} />
                  <meshStandardMaterial color={TEN} roughness={0.85} />
                </mesh>
                {asa && (
                  <>
                    <mesh position={[0, -0.34, 0.05]} rotation={[0.04, 0, 0]} castShadow>
                      <cylinderGeometry args={[0.018, 0.025, 1.6, 10]} />
                      <meshStandardMaterial color="#6E4B26" roughness={0.75} />
                    </mesh>
                    <mesh position={[0, 0.44, 0.05]} castShadow>
                      <sphereGeometry args={[0.04, 14, 12]} />
                      <meshStandardMaterial color="#5A3D20" roughness={0.7} />
                    </mesh>
                  </>
                )}
              </group>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
});
