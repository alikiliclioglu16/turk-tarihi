"use client";

import { forwardRef } from "react";
import * as THREE from "three";

interface Props {
  govdeRef?: React.RefObject<THREE.Group | null>;
  basRef?: React.RefObject<THREE.Group | null>;
  solKolRef: React.RefObject<THREE.Group | null>;
  sagKolRef: React.RefObject<THREE.Group | null>;
  solDirsekRef?: React.RefObject<THREE.Group | null>;
  sagDirsekRef?: React.RefObject<THREE.Group | null>;
  solBacakRef?: React.RefObject<THREE.Group | null>;
  sagBacakRef?: React.RefObject<THREE.Group | null>;
  solDizRef?: React.RefObject<THREE.Group | null>;
  sagDizRef?: React.RefObject<THREE.Group | null>;
}

/* Renkler */
const TEN = "#D9B48F";
const TEN_KOYU = "#C79E77";
const CUBBE = "#E8DCC0";
const CUBBE_GOLGE = "#D6C8A6";
const KIRMIZI = "#A8382F";
const KIRMIZI_KOYU = "#8A2C25";
const AK = "#F2EDE2";
const DERI = "#4A3520";
const ALTIN = "#C9A24B";

/**
 * Dede Korkut — insan oranlı, yaşlı bilge karakter.
 * Yaklaşık 1.78 m, hafif kambur duruş, uzun ak sakal.
 * Eklemler ayrı gruplarda: yürüme animasyonu Player.tsx'ten sürülür.
 */
export const DedeKorkutModel = forwardRef<THREE.Group, Props>(function DedeKorkutModel(
  {
    govdeRef, basRef,
    solKolRef, sagKolRef, solDirsekRef, sagDirsekRef,
    solBacakRef, sagBacakRef, solDizRef, sagDizRef,
  },
  ref
) {
  return (
    <group ref={ref}>
      {/* ---------- BACAKLAR ---------- */}
      {([
        { yan: -1, bacak: solBacakRef, diz: solDizRef },
        { yan: 1, bacak: sagBacakRef, diz: sagDizRef },
      ] as const).map(({ yan, bacak, diz }) => (
        <group key={yan} ref={bacak} position={[0.115 * yan, 0.9, 0]}>
          {/* uyluk */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.088, 0.3, 4, 10]} />
            <meshStandardMaterial color={CUBBE_GOLGE} roughness={0.95} />
          </mesh>
          <group ref={diz} position={[0, -0.42, 0]}>
            {/* baldır */}
            <mesh position={[0, -0.19, 0]} castShadow>
              <capsuleGeometry args={[0.072, 0.28, 4, 10]} />
              <meshStandardMaterial color="#6B5636" roughness={0.9} />
            </mesh>
            {/* çizme */}
            <mesh position={[0, -0.4, 0.035]} castShadow>
              <boxGeometry args={[0.135, 0.11, 0.29]} />
              <meshStandardMaterial color={DERI} roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.3, 0]} castShadow>
              <cylinderGeometry args={[0.082, 0.09, 0.18, 10]} />
              <meshStandardMaterial color={DERI} roughness={0.85} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ---------- GÖVDE ---------- */}
      <group ref={govdeRef} position={[0, 0, 0]}>
        {/* hafif kambur duruş */}
        <group rotation={[0.09, 0, 0]} position={[0, 0, -0.02]}>
          {/* cübbe eteği — dize kadar */}
          <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.245, 0.4, 0.72, 16, 1, true]} />
            <meshStandardMaterial color={CUBBE} roughness={0.95} side={THREE.DoubleSide} />
          </mesh>
          {/* etek ucu kilim şeridi */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.397, 0.402, 0.075, 16, 1, true]} />
            <meshStandardMaterial color={KIRMIZI_KOYU} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>

          {/* karın–göğüs (aşağı doğru genişleyen) */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <capsuleGeometry args={[0.185, 0.26, 6, 14]} />
            <meshStandardMaterial color={CUBBE} roughness={0.95} />
          </mesh>
          {/* göğüs üstü / omuz kütlesi */}
          <mesh position={[0, 1.38, 0]} castShadow>
            <capsuleGeometry args={[0.155, 0.2, 6, 14]} />
            <meshStandardMaterial color={CUBBE} roughness={0.95} />
          </mesh>

          {/* kuşak */}
          <mesh position={[0, 1.06, 0]}>
            <cylinderGeometry args={[0.212, 0.216, 0.13, 16]} />
            <meshStandardMaterial color={KIRMIZI} roughness={0.88} />
          </mesh>
          <mesh position={[0, 1.06, 0.2]}>
            <boxGeometry args={[0.12, 0.085, 0.045]} />
            <meshStandardMaterial color={ALTIN} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* kuşak sarkan ucu */}
          <mesh position={[0.14, 0.92, 0.16]} rotation={[0.1, 0, 0.12]}>
            <boxGeometry args={[0.07, 0.3, 0.02]} />
            <meshStandardMaterial color={KIRMIZI} roughness={0.9} />
          </mesh>

          {/* cübbe yaka açıklığı */}
          <mesh position={[0, 1.24, 0.15]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.075, 0.42, 0.02]} />
            <meshStandardMaterial color={CUBBE_GOLGE} roughness={0.95} />
          </mesh>

          {/* omuz pelerini */}
          <mesh position={[0, 1.4, -0.01]} castShadow>
            <cylinderGeometry args={[0.2, 0.33, 0.34, 18, 1, true]} />
            <meshStandardMaterial color={KIRMIZI} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 1.24, -0.01]}>
            <cylinderGeometry args={[0.328, 0.335, 0.05, 18, 1, true]} />
            <meshStandardMaterial color={AK} roughness={1} side={THREE.DoubleSide} />
          </mesh>

          {/* boyun */}
          <mesh position={[0, 1.54, 0.008]}>
            <cylinderGeometry args={[0.056, 0.068, 0.11, 10]} />
            <meshStandardMaterial color={TEN_KOYU} roughness={0.85} />
          </mesh>

          {/* ---------- BAŞ ---------- */}
          <group ref={basRef} position={[0, 1.6, 0.01]}>
            {/* kafatası */}
            <mesh position={[0, 0.045, 0]} scale={[0.95, 1.08, 1]} castShadow>
              <sphereGeometry args={[0.113, 20, 16]} />
              <meshStandardMaterial color={TEN} roughness={0.82} />
            </mesh>
            {/* çene–yanak kütlesi */}
            <mesh position={[0, -0.035, 0.012]} scale={[0.86, 0.8, 0.9]}>
              <sphereGeometry args={[0.098, 16, 14]} />
              <meshStandardMaterial color={TEN} roughness={0.85} />
            </mesh>

            {/* göz çukuru gölgesi */}
            {[-0.045, 0.045].map((x) => (
              <mesh key={`c${x}`} position={[x, 0.045, 0.085]} scale={[1, 0.62, 0.5]}>
                <sphereGeometry args={[0.032, 10, 10]} />
                <meshStandardMaterial color="#B98F6A" roughness={0.9} />
              </mesh>
            ))}
            {/* gözler */}
            {[-0.045, 0.045].map((x) => (
              <mesh key={`g${x}`} position={[x, 0.045, 0.1]}>
                <sphereGeometry args={[0.0155, 10, 10]} />
                <meshStandardMaterial color="#2B2118" roughness={0.25} />
              </mesh>
            ))}
            {/* ak kaşlar — kalın ve çatık */}
            {[-1, 1].map((s) => (
              <mesh key={`k${s}`} position={[0.048 * s, 0.079, 0.096]} rotation={[0, 0, -0.2 * s]}>
                <capsuleGeometry args={[0.011, 0.05, 3, 8]} />
                <meshStandardMaterial color={AK} roughness={1} />
              </mesh>
            ))}
            {/* burun */}
            <mesh position={[0, 0.012, 0.104]} rotation={[0.35, 0, 0]}>
              <capsuleGeometry args={[0.019, 0.05, 4, 10]} />
              <meshStandardMaterial color={TEN} roughness={0.85} />
            </mesh>
            {/* kulaklar */}
            {[-1, 1].map((s) => (
              <mesh key={`ku${s}`} position={[0.107 * s, 0.028, 0]} scale={[0.45, 1, 0.75]}>
                <sphereGeometry args={[0.033, 10, 10]} />
                <meshStandardMaterial color={TEN_KOYU} roughness={0.85} />
              </mesh>
            ))}
            {/* bıyık */}
            {[-1, 1].map((s) => (
              <mesh key={`b${s}`} position={[0.03 * s, -0.032, 0.088]} rotation={[0.2, 0, -0.5 * s]}>
                <capsuleGeometry args={[0.016, 0.055, 4, 10]} />
                <meshStandardMaterial color={AK} roughness={1} />
              </mesh>
            ))}
            {/* sakal — çene altından göğse */}
            <mesh position={[0, -0.13, 0.05]} rotation={[0.16, 0, 0]} castShadow>
              <capsuleGeometry args={[0.078, 0.16, 6, 14]} />
              <meshStandardMaterial color={AK} roughness={1} />
            </mesh>
            <mesh position={[0, -0.26, 0.035]} rotation={[0.1, 0, 0]} castShadow>
              <coneGeometry args={[0.062, 0.2, 12]} />
              <meshStandardMaterial color={AK} roughness={1} />
            </mesh>
            {/* favori / yanak sakalı */}
            {[-1, 1].map((s) => (
              <mesh key={`f${s}`} position={[0.082 * s, -0.05, 0.03]} scale={[0.5, 1.1, 0.8]}>
                <sphereGeometry args={[0.045, 10, 10]} />
                <meshStandardMaterial color={AK} roughness={1} />
              </mesh>
            ))}

            {/* börk — konik keçe başlık */}
            <mesh position={[0, 0.175, -0.005]} rotation={[-0.06, 0, 0]} castShadow>
              <coneGeometry args={[0.108, 0.235, 16]} />
              <meshStandardMaterial color={KIRMIZI} roughness={0.85} />
            </mesh>
            {/* kürk kenar */}
            <mesh position={[0, 0.082, 0]}>
              <cylinderGeometry args={[0.122, 0.128, 0.062, 16]} />
              <meshStandardMaterial color={AK} roughness={1} />
            </mesh>
            {/* börk tepesi */}
            <mesh position={[0, 0.295, -0.012]}>
              <sphereGeometry args={[0.022, 10, 10]} />
              <meshStandardMaterial color={ALTIN} metalness={0.6} roughness={0.4} />
            </mesh>
          </group>

          {/* ---------- KOLLAR ---------- */}
          {([
            { yan: -1, kol: solKolRef, dirsek: solDirsekRef, asa: false },
            { yan: 1, kol: sagKolRef, dirsek: sagDirsekRef, asa: true },
          ] as const).map(({ yan, kol, dirsek, asa }) => (
            <group key={yan} ref={kol} position={[0.185 * yan, 1.44, 0]} rotation={[0, 0, 0.14 * yan]}>
              {/* üst kol */}
              <mesh position={[0, -0.14, 0]} castShadow>
                <capsuleGeometry args={[0.058, 0.19, 4, 10]} />
                <meshStandardMaterial color={CUBBE} roughness={0.95} />
              </mesh>
              <group ref={dirsek} position={[0, -0.29, 0]}>
                {/* ön kol */}
                <mesh position={[0, -0.13, 0]} castShadow>
                  <capsuleGeometry args={[0.05, 0.17, 4, 10]} />
                  <meshStandardMaterial color={CUBBE_GOLGE} roughness={0.95} />
                </mesh>
                {/* el */}
                <mesh position={[0, -0.255, 0.01]} scale={[0.85, 1.15, 0.6]} castShadow>
                  <sphereGeometry args={[0.05, 12, 10]} />
                  <meshStandardMaterial color={TEN} roughness={0.85} />
                </mesh>
                {asa && (
                  <>
                    {/* asa */}
                    <mesh position={[0, -0.36, 0.045]} rotation={[0.05, 0, 0]} castShadow>
                      <cylinderGeometry args={[0.019, 0.026, 1.62, 8]} />
                      <meshStandardMaterial color="#6E4B26" roughness={0.75} />
                    </mesh>
                    <mesh position={[0, 0.44, 0.045]}>
                      <sphereGeometry args={[0.042, 12, 10]} />
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
