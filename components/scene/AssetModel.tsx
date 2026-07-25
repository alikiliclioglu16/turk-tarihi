"use client";

import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { varlik } from "@/lib/assets";
import { araziYukseklik } from "@/lib/terrain";
import {
  OtagModel, OcakModel, SacayakKazanModel, SandikModel,
  BalbalModel, KopuzModel, KilimModel, KayaModel,
  AgilModel, KoyunModel, KagniModel, TezgahModel,
  KurutmaSehpasiModel, OdunYiginiModel, TulumSehpasiModel,
  MizrakRafiModel, TugModel,
} from "./models/Props";
import {
  BuyukBalbalModel, DevrikBalbalModel, YazitTasiModel, TasDizisiModel,
  KayalikYamacModel, SogutModel, DereTaslariModel, SazlikModel,
  SuSehpasiModel, BaglamaDiregiModel, AtModel, KovaModel,
  OtagIskeletiModel, SonmusOcakModel, YikikDuvarModel, KirikCanakModel,
  YariGomuluKapModel, CurumusDirekModel, HoyukModel, SolmusKilimModel,
  YonDiregiModel, PazarTezgahiModel, DemirciOcagiModel,
  TalimHedefiModel, AsikOyunuModel,
  OkYapimTezgahiModel, KeceBasmaModel, DeriGerdirmeModel, ComlekCarkiModel,
  GuresAlaniModel, AtEgitimCemberiModel, IpBukmeModel,
  CadirSirasiModel, SilahRafiModel, AtliTalimDiregiModel,
  TugSancakModel, NobetKulesiModel, AtBagiModel,
} from "./models/BolgeProps";

interface Props {
  kod: string;
  pos: [number, number, number];
  rotY?: number;
  olcek?: number;
  varyant?: number;
}

function Gercek({ path, rotY = 0, olcek = 1 }: { path: string; rotY?: number; olcek?: number }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene.clone()} rotation-y={rotY} scale={olcek} />;
}

/** GLB yokken gösterilen prosedürel model — "çocuksu kutu" değil, özenli yer tutucu */
function Prosedurel({ kod, olcek = 1, varyant = 0 }: { kod: string; olcek?: number; varyant?: number }) {
  switch (kod) {
    case "A02": return <KopuzModel />;
    case "A03": return <SandikModel />;
    case "A04": return <OtagModel olcek={olcek} varyant={varyant} />;
    case "A05": return <OcakModel />;
    case "A06": return <SacayakKazanModel varyant={varyant} />;
    case "A07": return <BalbalModel olcek={olcek} />;
    case "A08": return <KilimModel varyant={varyant} />;
    case "C01": return <KayaModel olcek={olcek} />;
    case "B13": return <AgilModel />;
    case "B14": return <KoyunModel olcek={olcek} />;
    case "B15": return <KagniModel />;
    case "B16": return <TezgahModel varyant={varyant} />;
    case "B17": return <KurutmaSehpasiModel />;
    case "B18": return <OdunYiginiModel />;
    case "B19": return <TulumSehpasiModel />;
    case "B20": return <MizrakRafiModel />;
    case "B21": return <TugModel />;
    /* --- Balbal Sırtı --- */
    case "E01": return <BuyukBalbalModel />;
    case "E02": return <DevrikBalbalModel />;
    case "E03": return <YazitTasiModel />;
    case "E04": return <TasDizisiModel />;
    case "E05": return <KayalikYamacModel olcek={olcek} />;
    /* --- Su Başı --- */
    case "F01": return <SogutModel olcek={olcek} />;
    case "F02": return <DereTaslariModel />;
    case "F03": return <SazlikModel />;
    case "F04": return <SuSehpasiModel />;
    case "F05": return <BaglamaDiregiModel />;
    case "F06": return <AtModel olcek={olcek} />;
    case "F07": return <KovaModel />;
    /* --- Eski Yurt --- */
    case "G01": return <OtagIskeletiModel />;
    case "G02": return <SonmusOcakModel />;
    case "G03": return <YikikDuvarModel olcek={olcek} />;
    case "G04": return <KirikCanakModel />;
    case "G05": return <YariGomuluKapModel />;
    case "G06": return <CurumusDirekModel />;
    case "G07": return <HoyukModel olcek={olcek} />;
    case "G08": return <SolmusKilimModel />;
    /* --- Ortak --- */
    case "H04": return <YonDiregiModel />;
    case "P01": return <PazarTezgahiModel />;
    case "P02": return <DemirciOcagiModel />;
    case "P03": return <TalimHedefiModel />;
    case "P04": return <AsikOyunuModel />;
    /* --- zanaat sahneleri --- */
    case "Z01": return <OkYapimTezgahiModel />;
    case "Z02": return <KeceBasmaModel />;
    case "Z03": return <DeriGerdirmeModel />;
    case "Z04": return <ComlekCarkiModel />;
    case "Z05": return <GuresAlaniModel />;
    case "Z06": return <AtEgitimCemberiModel />;
    case "Z07": return <IpBukmeModel />;
    /* --- ordugâh --- */
    case "O01": return <CadirSirasiModel olcek={olcek} />;
    case "O02": return <SilahRafiModel />;
    case "O03": return <AtliTalimDiregiModel />;
    case "O04": return <TugSancakModel olcek={olcek} />;
    case "O05": return <NobetKulesiModel />;
    case "O06": return <AtBagiModel />;
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

export function AssetModel({ kod, pos, rotY = 0, olcek = 1, varyant = 0 }: Props) {
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
        <Prosedurel kod={kod} olcek={olcek} varyant={varyant} />
      )}
    </group>
  );
}
