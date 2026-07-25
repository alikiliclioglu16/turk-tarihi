"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik, DUNYA_YARICAP } from "@/lib/terrain";
import { hareketVektoru, klavyeyiBagla } from "@/lib/input";
import { useOyun } from "@/lib/store";
import { oyuncuKonumu } from "@/lib/oyuncuKonum";
import { hareketiCoz } from "@/lib/carpisma";
import { GezginModel } from "./models/GezginModel";

const HIZ = 4.6;
const KOSU_CARPAN = 2.1;    // Shift ile hızlı gezinme (büyük harita için)
const ADIM_TEMPO = 6.6;

export function Player({ baslangic = [0, 0, 30] as [number, number, number] }) {
  const grup = useRef<THREE.Group>(null);
  const govde = useRef<THREE.Group>(null);
  const bas = useRef<THREE.Group>(null);
  const pelerin = useRef<THREE.Group>(null);
  const solKol = useRef<THREE.Group>(null);
  const sagKol = useRef<THREE.Group>(null);
  const solDirsek = useRef<THREE.Group>(null);
  const sagDirsek = useRef<THREE.Group>(null);
  const solBacak = useRef<THREE.Group>(null);
  const sagBacak = useRef<THREE.Group>(null);
  const solDiz = useRef<THREE.Group>(null);
  const sagDiz = useRef<THREE.Group>(null);

  const { camera, gl } = useThree();

  /** kameranın yatay açısı — karakterin baktığı yönü takip eder */
  const camYaw = useRef(Math.PI);
  const camPitch = useRef(0.26);
  /** kullanıcı fareyle baktığında serbest kalır, bırakınca yavaşça arkaya döner */
  const serbestBakis = useRef(0);
  const hedefAci = useRef(0);
  const adimFaz = useRef(0);
  const yuruyusYogunluk = useRef(0);
  const kosuyor = useRef(false);
  const oturuyor = useRef(false);
  const ziplamaHizi = useRef(0);
  const ziplamaYuk = useRef(0);
  const havada = useRef(false);
  const kameraHedef = useRef(new THREE.Vector3());
  const yon = useRef(new THREE.Vector3());

  useEffect(() => klavyeyiBagla(), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      kosuyor.current = e.shiftKey;
      if (e.code === "Space") {
        e.preventDefault();
        if (!havada.current && !oturuyor.current) {
          havada.current = true;
          ziplamaHizi.current = 5.4;   // m/s
        }
      }
      if (e.code === "ControlLeft" || e.code === "ControlRight") {
        oturuyor.current = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      kosuyor.current = e.shiftKey;
      if (e.code === "ControlLeft" || e.code === "ControlRight") {
        oturuyor.current = false;
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    let basili = false;
    let sonX = 0;
    let sonY = 0;
    const down = (e: PointerEvent) => { basili = true; sonX = e.clientX; sonY = e.clientY; };
    const move = (e: PointerEvent) => {
      if (!basili) return;
      camYaw.current -= (e.clientX - sonX) * 0.005;
      camPitch.current = THREE.MathUtils.clamp(camPitch.current + (e.clientY - sonY) * 0.003, 0.02, 0.75);
      sonX = e.clientX;
      sonY = e.clientY;
      serbestBakis.current = 2.4; // 2.4 saniye serbest, sonra arkaya döner
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

  /**
   * Başlangıç konumu YALNIZ BİR KEZ uygulanır.
   * Önceden bağımlılık dizisi her render'da yenilendiği için karakter
   * her panel kapanışında başa ışınlanıyordu.
   */
  const yerlesti = useRef(false);
  useEffect(() => {
    if (yerlesti.current || !grup.current) return;
    yerlesti.current = true;
    grup.current.position.set(baslangic[0], araziYukseklik(baslangic[0], baslangic[2]), baslangic[2]);
    hedefAci.current = Math.PI;
    grup.current.rotation.y = Math.PI;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const g = grup.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    const girdi = hareketVektoru();
    const guc = oturuyor.current ? 0 : Math.min(1, Math.hypot(girdi.x, girdi.z));
    const yuruyor = guc > 0.08;
    const hiz = HIZ * (kosuyor.current ? KOSU_CARPAN : 1);

    if (yuruyor) {
      yon.current.set(girdi.x, 0, girdi.z).normalize();
      const aci = Math.atan2(yon.current.x, yon.current.z) + camYaw.current + Math.PI;
      const nx = g.position.x + Math.sin(aci) * hiz * guc * dt;
      const nz = g.position.z + Math.cos(aci) * hiz * guc * dt;
      // nesnelerle çarpışma — teğet kayarak dolaş
      const coz = hareketiCoz(g.position.x, g.position.z, nx, nz, 0.5, ziplamaYuk.current);
      let hx = coz.x;
      let hz = coz.z;

      // dünya sınırı
      const yeniUz = Math.hypot(hx, hz);
      if (yeniUz > DUNYA_YARICAP) {
        const oran = DUNYA_YARICAP / yeniUz;
        hx *= oran;
        hz *= oran;
      }
      g.position.x = hx;
      g.position.z = hz;
      hedefAci.current = aci;
      adimFaz.current += dt * ADIM_TEMPO * guc * (kosuyor.current ? 1.5 : 1);
    }
    // zıplama
    const zemin = araziYukseklik(g.position.x, g.position.z);
    if (havada.current) {
      ziplamaHizi.current -= 14 * dt;              // yerçekimi
      ziplamaYuk.current += ziplamaHizi.current * dt;
      if (ziplamaYuk.current <= 0) {
        ziplamaYuk.current = 0;
        ziplamaHizi.current = 0;
        havada.current = false;
      }
    }
    g.position.y = zemin + ziplamaYuk.current;
    oyuncuKonumu.x = g.position.x;
    oyuncuKonumu.y = g.position.y;
    oyuncuKonumu.z = g.position.z;
    oyuncuKonumu.aci = g.rotation.y;

    yuruyusYogunluk.current = THREE.MathUtils.lerp(
      yuruyusYogunluk.current, yuruyor ? guc : 0, dt * 8
    );
    const y = yuruyusYogunluk.current;
    const faz = adimFaz.current;

    // gövde dönüşü
    let fark = hedefAci.current - g.rotation.y;
    fark = Math.atan2(Math.sin(fark), Math.cos(fark));
    g.rotation.y += fark * Math.min(1, dt * 9);

    /* ---------- YÜRÜYÜŞ DÖNGÜSÜ ---------- */
    const otur = oturuyor.current ? 1 : 0;
    const sal = Math.sin(faz);
    const karsi = Math.sin(faz + Math.PI);
    const genlik = kosuyor.current ? 0.75 : 0.52;

    if (solBacak.current) solBacak.current.rotation.x = sal * genlik * y;
    if (sagBacak.current) sagBacak.current.rotation.x = karsi * genlik * y;
    if (solDiz.current) solDiz.current.rotation.x = -Math.max(0, -sal) * 0.85 * y;
    if (sagDiz.current) sagDiz.current.rotation.x = -Math.max(0, -karsi) * 0.85 * y;

    if (solKol.current) {
      const hedef = havada.current ? -1.1 : otur ? -0.5 : karsi * 0.36 * y;
      solKol.current.rotation.x = THREE.MathUtils.lerp(solKol.current.rotation.x, hedef, 0.25);
    }
    if (solDirsek.current) {
      solDirsek.current.rotation.x = -0.24 - Math.max(0, karsi) * 0.32 * y;
    }
    if (sagKol.current) {
      sagKol.current.rotation.x = THREE.MathUtils.lerp(sagKol.current.rotation.x, -0.2 + sal * 0.12 * y, 0.3);
    }
    if (sagDirsek.current) {
      sagDirsek.current.rotation.x = -0.6 + sal * 0.09 * y;
    }
    if (solBacak.current && sagBacak.current && solDiz.current && sagDiz.current) {
      const hedefKalca = otur * -1.45;
      const hedefDiz = otur * 1.5;
      solBacak.current.rotation.x = THREE.MathUtils.lerp(solBacak.current.rotation.x, sal * genlik * y + hedefKalca, otur ? 0.18 : 0.35);
      sagBacak.current.rotation.x = THREE.MathUtils.lerp(sagBacak.current.rotation.x, karsi * genlik * y + hedefKalca, otur ? 0.18 : 0.35);
      solDiz.current.rotation.x = THREE.MathUtils.lerp(solDiz.current.rotation.x, -Math.max(0, -sal) * 0.85 * y + hedefDiz, otur ? 0.18 : 0.35);
      sagDiz.current.rotation.x = THREE.MathUtils.lerp(sagDiz.current.rotation.x, -Math.max(0, -karsi) * 0.85 * y + hedefDiz, otur ? 0.18 : 0.35);
    }

    if (govde.current) {
      // otururken gövde alçalır, zıplarken hafif toplanır
      const alcak = otur * -0.46;
      const zipHedef = havada.current ? -0.06 : 0;
      govde.current.position.y = THREE.MathUtils.lerp(
        govde.current.position.y,
        alcak + zipHedef + Math.abs(Math.sin(faz)) * 0.03 * y + Math.sin(t * 1.4) * 0.006,
        0.22
      );
      govde.current.rotation.z = Math.sin(faz) * 0.026 * y;
      govde.current.rotation.y = Math.sin(faz) * 0.055 * y;
      govde.current.rotation.x = THREE.MathUtils.lerp(govde.current.rotation.x, otur * 0.12, 0.2);
    }
    if (pelerin.current) {
      // pelerin yürürken hafif savrulur
      pelerin.current.rotation.x = -y * 0.1 - Math.sin(faz) * 0.04 * y;
    }
    if (bas.current) {
      bas.current.rotation.z = -Math.sin(faz) * 0.03 * y;
      bas.current.rotation.y = THREE.MathUtils.lerp(
        bas.current.rotation.y, y > 0.1 ? 0 : Math.sin(t * 0.32) * 0.24, dt * 2
      );
      bas.current.rotation.x = 0.04 + Math.sin(t * 1.4) * 0.01;
    }

    /* ---------- KAMERA: karakterin baktığı yönden ---------- */
    if (serbestBakis.current > 0) {
      serbestBakis.current -= dt;
    } else if (y > 0.05) {
      // yürürken kamera karakterin arkasına, baktığı yöne döner
      let d = g.rotation.y + Math.PI - camYaw.current;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      camYaw.current += d * Math.min(1, dt * 2.2);
    }

    const mesafe = kosuyor.current ? 6.4 : 5.5;
    const yukseklik = 1.85 + camPitch.current * 3.1;
    kameraHedef.current.set(
      g.position.x + Math.sin(camYaw.current) * mesafe,
      g.position.y + yukseklik,
      g.position.z + Math.cos(camYaw.current) * mesafe
    );
    kameraHedef.current.y = Math.max(
      kameraHedef.current.y,
      araziYukseklik(kameraHedef.current.x, kameraHedef.current.z) + 1.0
    );
    camera.position.lerp(kameraHedef.current, Math.min(1, dt * 5));
    // bakış noktası: karakterin biraz önü — nereye gidiyorsa orayı görürsün
    camera.lookAt(
      g.position.x - Math.sin(camYaw.current) * 3.2,
      g.position.y + 1.5,
      g.position.z - Math.cos(camYaw.current) * 3.2
    );
    camera.rotation.z += Math.sin(t * 0.61) * 0.004;

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

  return (
    <group ref={grup}>
      <GezginModel
        govdeRef={govde}
        basRef={bas}
        pelerinRef={pelerin}
        solKolRef={solKol}
        sagKolRef={sagKol}
        solDirsekRef={solDirsek}
        sagDirsekRef={sagDirsek}
        solBacakRef={solBacak}
        sagBacakRef={sagBacak}
        solDizRef={solDiz}
        sagDizRef={sagDiz}
      />
      
    </group>
  );
}
