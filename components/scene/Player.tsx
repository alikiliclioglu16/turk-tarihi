"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik, DUNYA_YARICAP } from "@/lib/terrain";
import { hareketVektoru, klavyeyiBagla } from "@/lib/input";
import { useOyun } from "@/lib/store";
import { DedeKorkutBillboard } from "./models/DedeKorkutBillboard";
import { pozSec } from "@/lib/pozSecici";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";

const HIZ = 3.6;          // yaşlı bir adamın ölçülü yürüyüşü
const ADIM_TEMPO = 6.4;   // adım frekansı

export function Player({ baslangic = [0, 0, 14] as [number, number, number] }) {
  const grup = useRef<THREE.Group>(null);

  const { camera, gl } = useThree();
  const yaw = useRef(Math.PI);
  const pitch = useRef(0.3);
  const hedefAci = useRef(0);
  const adimFaz = useRef(0);
  const yuruyusYogunluk = useRef(0);
  const [yuruyorState, setYuruyorState] = useState(false);
  const sonYuruyor = useRef(false);
  const kameraHedef = useRef(new THREE.Vector3());
  const yon = useRef(new THREE.Vector3());

  useEffect(() => klavyeyiBagla(), []);

  useEffect(() => {
    const el = gl.domElement;
    let basili = false;
    let sonX = 0;
    let sonY = 0;
    const down = (e: PointerEvent) => { basili = true; sonX = e.clientX; sonY = e.clientY; };
    const move = (e: PointerEvent) => {
      if (!basili) return;
      yaw.current -= (e.clientX - sonX) * 0.005;
      pitch.current = THREE.MathUtils.clamp(pitch.current + (e.clientY - sonY) * 0.003, 0.06, 0.8);
      sonX = e.clientX;
      sonY = e.clientY;
    };
    const up = () => { basili = false; };
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useEffect(() => {
    if (grup.current) {
      grup.current.position.set(baslangic[0], araziYukseklik(baslangic[0], baslangic[2]), baslangic[2]);
    }
  }, [baslangic]);

  useFrame((state, delta) => {
    const g = grup.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    const girdi = hareketVektoru();
    const guc = Math.min(1, Math.hypot(girdi.x, girdi.z));
    const yuruyor = guc > 0.08;

    if (yuruyor) {
      yon.current.set(girdi.x, 0, girdi.z).normalize();
      const aci = Math.atan2(yon.current.x, yon.current.z) + yaw.current + Math.PI;
      const nx = g.position.x + Math.sin(aci) * HIZ * guc * dt;
      const nz = g.position.z + Math.cos(aci) * HIZ * guc * dt;
      if (Math.hypot(nx, nz) < DUNYA_YARICAP) {
        g.position.x = nx;
        g.position.z = nz;
      }
      hedefAci.current = aci;
      adimFaz.current += dt * ADIM_TEMPO * guc;
    }
    g.position.y = araziYukseklik(g.position.x, g.position.z);
    oyuncuKonumu.x = g.position.x;
    oyuncuKonumu.y = g.position.y;
    oyuncuKonumu.z = g.position.z;

    // yürüyüş yoğunluğu yumuşak geçiş (dur ↔ yürü arası ani zıplama olmasın)
    yuruyusYogunluk.current = THREE.MathUtils.lerp(yuruyusYogunluk.current, yuruyor ? guc : 0, dt * 8);
    if (yuruyor !== sonYuruyor.current) {
      sonYuruyor.current = yuruyor;
      setYuruyorState(yuruyor);
    }
    const y = yuruyusYogunluk.current;
    const faz = adimFaz.current;

    // gövde dönüşü
    let fark = hedefAci.current - g.rotation.y;
    fark = Math.atan2(Math.sin(fark), Math.cos(fark));
    g.rotation.y += fark * Math.min(1, dt * 8);

    // (yürüyüş animasyonu billboard içinde yönetiliyor)

    /* ---------- KAMERA ---------- */
    const mesafe = 5.4;
    const yukseklik = 1.9 + pitch.current * 3.0;
    kameraHedef.current.set(
      g.position.x + Math.sin(yaw.current) * mesafe,
      g.position.y + yukseklik,
      g.position.z + Math.cos(yaw.current) * mesafe
    );
    kameraHedef.current.y = Math.max(
      kameraHedef.current.y,
      araziYukseklik(kameraHedef.current.x, kameraHedef.current.z) + 1.1
    );
    camera.position.lerp(kameraHedef.current, Math.min(1, dt * 5));
    camera.lookAt(g.position.x, g.position.y + 1.35, g.position.z);

    // elde çekim nefesi — neredeyse fark edilmez, ama sahneyi "canlı" yapar
    camera.rotation.z += Math.sin(t * 0.63) * 0.0045 + Math.sin(t * 1.7) * 0.0018;
    camera.rotation.x += Math.sin(t * 0.81) * 0.0028;
    // yürürken hafif adım sarsıntısı
    camera.rotation.z += Math.sin(faz * 0.5) * 0.006 * y;

    /* ---------- DURAK TETİKLEME ---------- */
    const { nodlar, aktifIndex, faz: oyunFazi, duragiBaslat } = useOyun.getState();
    if (oyunFazi === "gezinti") {
      const nod = nodlar[aktifIndex];
      if (nod) {
        const [hx, , hz] = nod.world.guidePosition;
        if (Math.hypot(g.position.x - hx, g.position.z - hz) < nod.world.triggerRadius) {
          duragiBaslat();
        }
      }
    }
  });

  const { faz, anlatiIndex, aktifHotspotId, ipucu } = useOyun();
  const poz = pozSec({
    faz,
    anlatiIndex,
    hotspotAcik: Boolean(aktifHotspotId),
    ipucuVar: Boolean(ipucu),
    sonCevapDogru: null,
  });

  return (
    <group ref={grup}>
      <Suspense fallback={null}>
        <DedeKorkutBillboard poz={poz} yuruyor={yuruyorState} yon={hedefAci.current} />
      </Suspense>
      {/* karakteri geceden ayıran yumuşak dolgu ışığı */}
      <pointLight position={[0.6, 2.2, 1.2]} intensity={2.6} distance={5} decay={2} color="#cfd8ee" />
      <pointLight position={[-0.8, 1.4, -1.0]} intensity={1.4} distance={4} decay={2} color="#f0a44a" />
    </group>
  );
}
