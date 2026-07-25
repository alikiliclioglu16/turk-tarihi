"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik, DUNYA_YARICAP } from "@/lib/terrain";
import { hareketVektoru, klavyeyiBagla } from "@/lib/input";
import { useOyun } from "@/lib/store";
import { DedeKorkutModel } from "./models/DedeKorkutModel";

const HIZ = 4.2;

/** Dede Korkut — oynanabilir karakter + üçüncü şahıs kamera */
export function Player({ baslangic = [0, 0, 14] as [number, number, number] }) {
  const grup = useRef<THREE.Group>(null);
  const solKol = useRef<THREE.Group>(null);
  const sagKol = useRef<THREE.Group>(null);
  const govde = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  const yaw = useRef(Math.PI);
  const pitch = useRef(0.34);
  const hedefAci = useRef(0);
  const kameraHedef = useRef(new THREE.Vector3());
  const yon = useRef(new THREE.Vector3());

  useEffect(() => klavyeyiBagla(), []);

  // fare/dokunmatik ile kamera çevirme
  useEffect(() => {
    const el = gl.domElement;
    let basili = false;
    let sonX = 0;
    let sonY = 0;
    const down = (e: PointerEvent) => {
      basili = true;
      sonX = e.clientX;
      sonY = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!basili) return;
      yaw.current -= (e.clientX - sonX) * 0.005;
      pitch.current = THREE.MathUtils.clamp(pitch.current + (e.clientY - sonY) * 0.003, 0.08, 0.85);
      sonX = e.clientX;
      sonY = e.clientY;
    };
    const up = () => {
      basili = false;
    };
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
    }
    g.position.y = araziYukseklik(g.position.x, g.position.z);

    // yumuşak dönüş
    let fark = hedefAci.current - g.rotation.y;
    fark = Math.atan2(Math.sin(fark), Math.cos(fark));
    g.rotation.y += fark * Math.min(1, dt * 9);

    // yürüme animasyonu (greybox karakter)
    const salinim = yuruyor ? Math.sin(t * 9) * 0.5 : 0;
    if (solKol.current) solKol.current.rotation.x = THREE.MathUtils.lerp(solKol.current.rotation.x, salinim, 0.25);
    if (sagKol.current) sagKol.current.rotation.x = THREE.MathUtils.lerp(sagKol.current.rotation.x, -salinim - 0.3, 0.25);
    if (govde.current) {
      govde.current.position.y = yuruyor ? Math.abs(Math.sin(t * 9)) * 0.045 : Math.sin(t * 1.6) * 0.012;
      govde.current.rotation.z = yuruyor ? Math.sin(t * 9) * 0.022 : 0;
    }

    // kamera takibi
    const mesafe = 6.0;
    const yukseklik = 2.1 + pitch.current * 3.2;
    kameraHedef.current.set(
      g.position.x + Math.sin(yaw.current) * mesafe,
      g.position.y + yukseklik,
      g.position.z + Math.cos(yaw.current) * mesafe
    );
    kameraHedef.current.y = Math.max(
      kameraHedef.current.y,
      araziYukseklik(kameraHedef.current.x, kameraHedef.current.z) + 1.2
    );
    camera.position.lerp(kameraHedef.current, Math.min(1, dt * 5));
    camera.lookAt(g.position.x, g.position.y + 1.6, g.position.z);

    // durak yakınlık kontrolü
    const { nodlar, aktifIndex, faz, duragiBaslat } = useOyun.getState();
    if (faz === "gezinti") {
      const nod = nodlar[aktifIndex];
      if (nod) {
        const [hx, , hz] = nod.world.guidePosition;
        if (Math.hypot(g.position.x - hx, g.position.z - hz) < nod.world.triggerRadius) {
          duragiBaslat();
        }
      }
    }
  });

  return (
    <DedeKorkutModel ref={grup} solKolRef={solKol} sagKolRef={sagKol} govdeRef={govde} />
  );
}
