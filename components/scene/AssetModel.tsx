"use client";

import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { varlik } from "@/lib/assets";
import { araziYukseklik } from "@/lib/terrain";
import {
  OtagModel, OcakModel, SacayakKazanModel, SandikModel,
  BalbalModel, KopuzModel, KilimModel, KayaModel,
} from "./models/Props";

interface Props {
  kod: string;
  pos: [number, number, number];
  rotY?: number;
  olcek?: number;
}

function Gercek({ path, rotY = 0, olcek = 1 }: { path: string; rotY?: number; olcek?: number }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene.clone()} rotation-y={rotY} scale={olcek} />;
}

/** GLB yokken gösterilen prosedürel model — "çocuksu kutu" değil, özenli yer tutucu */
function Prosedurel({ kod, olcek = 1 }: { kod: string; olcek?: number }) {
  switch (kod) {
    case "A02": return <KopuzModel />;
    case "A03": return <SandikModel />;
    case "A04": return <OtagModel olcek={olcek} />;
    case "A05": return <OcakModel />;
    case "A06": return <SacayakKazanModel />;
    case "A07": return <BalbalModel olcek={olcek} />;
    case "A08": return <KilimModel />;
    case "C01": return <KayaModel olcek={olcek} />;
    default: {
      const v = varlik(kod);
      if (!v) return null;
      const [g, y, d] = v.greybox.boyut;
      return (
        <mesh position={[0, y / 2, 0]} scale={olcek} castShadow receiveShadow>
          <boxGeometry args={[g, y, d]} />
          <meshStandardMaterial color={v.greybox.renk} roughness={0.9} flatShading />
        </mesh>
      );
    }
  }
}

export function AssetModel({ kod, pos, rotY = 0, olcek = 1 }: Props) {
  const v = varlik(kod);
  if (!v) return null;
  const y = pos[1] + araziYukseklik(pos[0], pos[2]);

  return (
    <group position={[pos[0], y, pos[2]]} rotation-y={rotY}>
      {v.hazir && v.path ? (
        <Suspense fallback={<Prosedurel kod={kod} olcek={olcek} />}>
          <Gercek path={v.path} olcek={olcek} />
        </Suspense>
      ) : (
        <Prosedurel kod={kod} olcek={olcek} />
      )}
    </group>
  );
}
