"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type Aktivite =
  | "demirci" | "dokumaci" | "pazarci" | "asker" | "cocuk"
  | "ozan" | "dansci" | "asci" | "coban" | "avci" | "sohbet" | "bekleyen"
  /* --- işine oturmuş zanaat ve oyun duruşları --- */
  | "asikAtan" | "asikIzleyen" | "comlekci" | "okYapan" | "keceBasan"
  | "deriGeren" | "ipBuken" | "guresci" | "atTerbiyecisi" | "tartan";

interface Props {
  aktivite: Aktivite;
  renk?: string;
  kusakRenk?: string;
  boy?: number;
  tohum?: number;
}

/**
 * OBA HALKI — düşük maliyetli, hareketli figür
 *
 * Yedi parçadan oluşur (gövde, baş, iki kol, iki bacak, başlık).
 * Animasyon tamamen dönüşümlerle yapılır; iskelet veya klip yoktur.
 * Yalnız oyuncuya yakın olanlar sahneye girer (Halk bileşeni yönetir).
 */
export function InsanModel({
  aktivite, renk = "#C9B896", kusakRenk = "#A8382F", boy = 1.72, tohum = 0,
}: Props) {
  const govde = useRef<THREE.Group>(null);
  const solKol = useRef<THREE.Group>(null);
  const sagKol = useRef<THREE.Group>(null);
  const solBacak = useRef<THREE.Group>(null);
  const sagBacak = useRef<THREE.Group>(null);
  const bas = useRef<THREE.Group>(null);

  const o = boy / 1.72;
  const faz = useMemo(() => tohum * 1.7, [tohum]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + faz;
    const g = govde.current, sk = solKol.current, sg = sagKol.current;
    const sb = solBacak.current, sgb = sagBacak.current, b = bas.current;
    if (!g || !sk || !sg || !sb || !sgb || !b) return;

    // varsayılan: nefes
    g.position.y = Math.sin(t * 1.3) * 0.012;
    b.rotation.y = Math.sin(t * 0.4) * 0.25;

    switch (aktivite) {
      case "demirci": {
        const vur = Math.max(0, Math.sin(t * 3.4));
        sg.rotation.x = -2.1 + vur * 1.9;
        sk.rotation.x = -0.9;
        g.rotation.x = 0.28 + vur * 0.1;
        break;
      }
      case "dokumaci": {
        sk.rotation.x = -1.5 + Math.sin(t * 2.2) * 0.35;
        sg.rotation.x = -1.5 + Math.sin(t * 2.2 + 1.6) * 0.35;
        g.rotation.x = 0.3;
        sb.rotation.x = -1.5; sgb.rotation.x = -1.5;
        g.position.y = -0.42 * o;
        break;
      }
      case "pazarci": {
        sk.rotation.x = -0.5 + Math.sin(t * 0.9) * 0.4;
        sg.rotation.x = -0.4 + Math.sin(t * 0.7 + 2) * 0.3;
        break;
      }
      case "asker": {
        const sav = Math.sin(t * 2.6);
        sg.rotation.x = -1.6 + sav * 1.1;
        sg.rotation.z = 0.4;
        sk.rotation.x = -0.4;
        g.rotation.y = sav * 0.22;
        sb.rotation.x = 0.3; sgb.rotation.x = -0.3;
        break;
      }
      case "cocuk": {
        const zipla = Math.abs(Math.sin(t * 3.2));
        g.position.y = zipla * 0.16;
        sk.rotation.x = -Math.sin(t * 3.2) * 1.2;
        sg.rotation.x = Math.sin(t * 3.2) * 1.2;
        sb.rotation.x = Math.sin(t * 3.2) * 0.7;
        sgb.rotation.x = -Math.sin(t * 3.2) * 0.7;
        break;
      }
      case "ozan": {
        sk.rotation.x = -1.35;
        sg.rotation.x = -1.15 + Math.sin(t * 4.5) * 0.18;
        g.rotation.x = 0.16;
        sb.rotation.x = -1.5; sgb.rotation.x = -1.5;
        g.position.y = -0.42 * o;
        b.rotation.z = Math.sin(t * 1.1) * 0.1;
        break;
      }
      case "dansci": {
        g.rotation.y = t * 1.1;
        sk.rotation.z = -1.9 + Math.sin(t * 2.4) * 0.35;
        sg.rotation.z = 1.9 - Math.sin(t * 2.4) * 0.35;
        sb.rotation.x = Math.sin(t * 2.4) * 0.4;
        sgb.rotation.x = -Math.sin(t * 2.4) * 0.4;
        g.position.y = Math.abs(Math.sin(t * 2.4)) * 0.07;
        break;
      }
      case "asci": {
        sg.rotation.x = -1.5;
        sg.rotation.y = Math.sin(t * 2.8) * 0.5;
        sk.rotation.x = -0.6;
        g.rotation.x = 0.24;
        break;
      }
      case "coban":
      case "avci": {
        const ad = Math.sin(t * 4.2);
        sb.rotation.x = ad * 0.5;
        sgb.rotation.x = -ad * 0.5;
        sk.rotation.x = -ad * 0.34;
        sg.rotation.x = ad * 0.34;
        g.position.y = Math.abs(ad) * 0.03;
        break;
      }
      case "sohbet": {
        sk.rotation.x = -0.35 + Math.sin(t * 1.6) * 0.5;
        sg.rotation.x = -0.2;
        b.rotation.y = Math.sin(t * 0.9) * 0.35;
        break;
      }
      /* ---------- AŞIK OYUNU ---------- */
      case "asikAtan": {
        // çömelmiş, sırayla atış yapıyor
        const dongu = (t % 4) / 4;
        sb.rotation.x = -1.5; sgb.rotation.x = -1.5;
        g.position.y = -0.5 * o;
        if (dongu < 0.35) {
          // kolu geriye çek
          sg.rotation.x = -0.4 - dongu * 2.2;
          g.rotation.x = 0.2;
        } else if (dongu < 0.5) {
          // fırlat
          const f = (dongu - 0.35) / 0.15;
          sg.rotation.x = -1.2 + f * 1.9;
          g.rotation.x = 0.2 + f * 0.25;
        } else {
          // sonucu izle
          sg.rotation.x = 0.6;
          g.rotation.x = 0.42;
          b.rotation.x = 0.3;
        }
        sk.rotation.x = -0.55;
        break;
      }
      case "asikIzleyen": {
        sb.rotation.x = -1.5; sgb.rotation.x = -1.5;
        g.position.y = -0.5 * o;
        g.rotation.x = 0.34;
        b.rotation.x = 0.32;
        b.rotation.y = Math.sin(t * 0.9) * 0.28;
        sk.rotation.x = -0.7; sg.rotation.x = -0.7;
        // heyecanlanma
        const zipla = Math.max(0, Math.sin(t * 1.3) - 0.92) * 6;
        g.position.y += zipla * 0.05;
        break;
      }

      /* ---------- ZANAATLAR ---------- */
      case "comlekci": {
        sb.rotation.x = -1.5; sgb.rotation.x = -1.5;
        g.position.y = -0.46 * o;
        g.rotation.x = 0.42;
        // iki el çamuru şekillendiriyor
        sk.rotation.x = -1.45 + Math.sin(t * 3.2) * 0.12;
        sg.rotation.x = -1.45 + Math.sin(t * 3.2 + 0.6) * 0.12;
        sk.rotation.z = 0.4; sg.rotation.z = -0.4;
        break;
      }
      case "okYapan": {
        g.rotation.x = 0.3;
        // ok gövdesini çevirip düzlüyor
        sk.rotation.x = -1.5;
        sg.rotation.x = -1.35 + Math.sin(t * 2.6) * 0.3;
        b.rotation.x = 0.35;
        break;
      }
      case "keceBasan": {
        // öne eğilip yuvarlıyor
        const it = Math.sin(t * 1.8);
        g.rotation.x = 0.5 + it * 0.16;
        g.position.y = -0.14 * o;
        sk.rotation.x = -1.9 - it * 0.25;
        sg.rotation.x = -1.9 - it * 0.25;
        sb.rotation.x = 0.35; sgb.rotation.x = -0.2;
        break;
      }
      case "deriGeren": {
        sk.rotation.x = -2.0;
        sg.rotation.x = -2.0 + Math.sin(t * 1.5) * 0.22;
        g.rotation.x = 0.12;
        break;
      }
      case "ipBuken": {
        sk.rotation.x = -1.3;
        sg.rotation.x = -1.3;
        sg.rotation.y = Math.sin(t * 5.5) * 0.6;
        sk.rotation.y = -Math.sin(t * 5.5) * 0.4;
        g.rotation.x = 0.2;
        break;
      }
      case "guresci": {
        // güreş duruşu: dizler bükük, kollar önde, sallanma
        const sal = Math.sin(t * 1.6);
        sb.rotation.x = -0.55; sgb.rotation.x = -0.55;
        g.position.y = -0.24 * o;
        g.rotation.x = 0.4;
        g.rotation.y = sal * 0.3;
        sk.rotation.x = -1.5 - sal * 0.2;
        sg.rotation.x = -1.5 + sal * 0.2;
        sk.rotation.z = 0.5; sg.rotation.z = -0.5;
        break;
      }
      case "atTerbiyecisi": {
        // kolunda kement, yavaş dönüyor
        g.rotation.y = t * 0.3;
        sg.rotation.x = -1.7;
        sg.rotation.z = -0.5 + Math.sin(t * 3) * 0.25;
        sk.rotation.x = -0.4;
        break;
      }
      case "tartan": {
        // terazi tutuyor, dengeye bakıyor
        sg.rotation.x = -1.55;
        sk.rotation.x = -0.9;
        b.rotation.x = 0.35;
        g.rotation.y = Math.sin(t * 0.7) * 0.12;
        break;
      }

      default: {
        sk.rotation.x = Math.sin(t * 0.8) * 0.08;
        sg.rotation.x = -Math.sin(t * 0.8) * 0.08;
      }
    }
  });

  const ten = "#D9B48F";
  return (
    <group scale={o}>
      {/* bacaklar */}
      <group ref={solBacak} position={[-0.11, 0.86, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.62, 4, 8]} />
          <meshStandardMaterial color="#6B5636" roughness={0.95} />
        </mesh>
      </group>
      <group ref={sagBacak} position={[0.11, 0.86, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.62, 4, 8]} />
          <meshStandardMaterial color="#6B5636" roughness={0.95} />
        </mesh>
      </group>

      <group ref={govde}>
        {/* gövde */}
        <mesh position={[0, 1.18, 0]} castShadow>
          <capsuleGeometry args={[0.19, 0.5, 5, 10]} />
          <meshStandardMaterial color={renk} roughness={0.95} />
        </mesh>
        {/* kuşak */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 10]} />
          <meshStandardMaterial color={kusakRenk} roughness={0.9} />
        </mesh>
        {/* baş */}
        <group ref={bas} position={[0, 1.62, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.115, 12, 10]} />
            <meshStandardMaterial color={ten} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.11, 0]}>
            <coneGeometry args={[0.11, 0.17, 10]} />
            <meshStandardMaterial color={kusakRenk} roughness={0.9} />
          </mesh>
        </group>
        {/* kollar */}
        <group ref={solKol} position={[-0.21, 1.4, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.4, 4, 8]} />
            <meshStandardMaterial color={renk} roughness={0.95} />
          </mesh>
          <mesh position={[0, -0.51, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={ten} roughness={0.85} />
          </mesh>
        </group>
        <group ref={sagKol} position={[0.21, 1.4, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.4, 4, 8]} />
            <meshStandardMaterial color={renk} roughness={0.95} />
          </mesh>
          <mesh position={[0, -0.51, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={ten} roughness={0.85} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
