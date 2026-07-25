"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { araziYukseklik } from "@/lib/terrain";
import { keceDokusu, kilimDokusu, lekeDokusu } from "@/lib/textures";
import { obaCadirlari } from "@/lib/buyukObaVeri";

/**
 * BÜYÜK OBA — uzaktaki kalabalık
 *
 * Yüzlerce otağ ve insanı tek tek çizmek tarayıcıyı kilitler. Burada
 * hepsi instancing ile çiziliyor: 320 otağ 3 çizim çağrısı, 240 kişi
 * 1 çağrı, duman sütunları 1 çağrı.
 *
 * Oyuncu yaklaştıkça bu alanların içinden detaylı nesneler ve canlı
 * figürler devreye giriyor (YakinVarliklar ve Halk bileşenleri).
 * Sonuç: ufka bakınca binlerce kişilik bir oba görürsünüz.
 */

const KALABALIK = 240;
const DUMAN_SAYISI = 90;

export function BuyukOba() {
  const kece = useMemo(() => keceDokusu(), []);
  const kilim = useMemo(() => kilimDokusu(), []);
  const leke = useMemo(() => lekeDokusu(), []);

  const govdeRef = useRef<THREE.InstancedMesh>(null);
  const catiRef = useRef<THREE.InstancedMesh>(null);
  const kusakRef = useRef<THREE.InstancedMesh>(null);
  const halkRef = useRef<THREE.InstancedMesh>(null);
  const dumanRef = useRef<THREE.InstancedMesh>(null);
  const beyGovdeRef = useRef<THREE.InstancedMesh>(null);
  const beyCatiRef = useRef<THREE.InstancedMesh>(null);
  const beyTugRef = useRef<THREE.InstancedMesh>(null);
  const yazildi = useRef(false);

  const veri = useMemo(() => {
    const otaglar = obaCadirlari();
    let tohum = 777;
    const rnd = () => {
      tohum = (tohum * 1103515245 + 12345) & 0x7fffffff;
      return tohum / 0x7fffffff;
    };

    // uzak kalabalık: otağların çevresine dağılmış figürler
    const kisiler: { x: number; z: number; s: number; r: number }[] = [];
    for (let i = 0; i < KALABALIK; i++) {
      const o = otaglar[Math.floor(rnd() * otaglar.length)];
      if (!o) continue;
      const a = rnd() * Math.PI * 2;
      const r = 4 + rnd() * 16;
      kisiler.push({
        x: o.x + Math.cos(a) * r,
        z: o.z + Math.sin(a) * r,
        s: 0.9 + rnd() * 0.25,
        r: rnd() * Math.PI * 2,
      });
    }

    // duman sütunları — her üç otağdan birinde ocak yanıyor
    const dumanlar = otaglar
      .filter((_, i) => i % 3 === 0)
      .slice(0, DUMAN_SAYISI)
      .map((o) => ({ x: o.x, z: o.z, s: 0.8 + rnd() * 0.8 }));

    const siradan = otaglar.filter((o) => !o.beyMi);
    const beyler = otaglar.filter((o) => o.beyMi);
    return { otaglar, siradan, beyler, kisiler, dumanlar };
  }, []);

  useFrame(({ clock }) => {
    if (yazildi.current) return;
    const g = new THREE.Object3D();

    const yazOtag = () => {
      const gm = govdeRef.current, cm = catiRef.current, km = kusakRef.current;
      if (!gm || !cm || !km) return false;
      veri.siradan.forEach((o, i) => {
        const y = araziYukseklik(o.x, o.z);
        g.position.set(o.x, y + 1.0 * o.s, o.z);
        g.rotation.set(0, o.r, 0);
        g.scale.setScalar(o.s);
        g.updateMatrix();
        gm.setMatrixAt(i, g.matrix);
        g.position.set(o.x, y + 2.95 * o.s, o.z);
        g.updateMatrix();
        cm.setMatrixAt(i, g.matrix);
        g.position.set(o.x, y + 1.62 * o.s, o.z);
        g.updateMatrix();
        km.setMatrixAt(i, g.matrix);
      });
      [gm, cm, km].forEach((m) => {
        m.instanceMatrix.needsUpdate = true;
        m.computeBoundingSphere();
      });
      return true;
    };

    const yazHalk = () => {
      const hm = halkRef.current;
      if (!hm) return false;
      veri.kisiler.forEach((k, i) => {
        g.position.set(k.x, araziYukseklik(k.x, k.z) + 0.85 * k.s, k.z);
        g.rotation.set(0, k.r, 0);
        g.scale.setScalar(k.s);
        g.updateMatrix();
        hm.setMatrixAt(i, g.matrix);
      });
      hm.instanceMatrix.needsUpdate = true;
      hm.computeBoundingSphere();
      return true;
    };

    const yazDuman = () => {
      const dm = dumanRef.current;
      if (!dm) return false;
      veri.dumanlar.forEach((d, i) => {
        g.position.set(d.x, araziYukseklik(d.x, d.z) + 7 * d.s, d.z);
        g.rotation.set(0, 0, 0);
        g.scale.set(4 * d.s, 9 * d.s, 1);
        g.updateMatrix();
        dm.setMatrixAt(i, g.matrix);
      });
      dm.instanceMatrix.needsUpdate = true;
      dm.computeBoundingSphere();
      return true;
    };

    const yazBey = () => {
      const gm = beyGovdeRef.current, cm = beyCatiRef.current, tm = beyTugRef.current;
      if (!gm || !cm || !tm) return false;
      veri.beyler.forEach((o, i) => {
        const y = araziYukseklik(o.x, o.z);
        g.position.set(o.x, y + 1.25 * o.s, o.z);
        g.rotation.set(0, o.r, 0);
        g.scale.setScalar(o.s);
        g.updateMatrix();
        gm.setMatrixAt(i, g.matrix);
        g.position.set(o.x, y + 3.75 * o.s, o.z);
        g.updateMatrix();
        cm.setMatrixAt(i, g.matrix);
        g.position.set(o.x, y + 5.4 * o.s, o.z);
        g.updateMatrix();
        tm.setMatrixAt(i, g.matrix);
      });
      [gm, cm, tm].forEach((m) => { m.instanceMatrix.needsUpdate = true; m.computeBoundingSphere(); });
      return true;
    };

    if (yazOtag() && yazHalk() && yazDuman() && yazBey()) yazildi.current = true;
  });

  return (
    <group>
      {/* otağ gövdeleri */}
      <instancedMesh ref={govdeRef} args={[undefined, undefined, veri.siradan.length]} castShadow receiveShadow frustumCulled>
        <cylinderGeometry args={[2.6, 2.9, 2.0, 10]} />
        <meshStandardMaterial map={kece} roughness={0.97} />
      </instancedMesh>
      {/* çatılar */}
      <instancedMesh ref={catiRef} args={[undefined, undefined, veri.siradan.length]} castShadow frustumCulled>
        <coneGeometry args={[3.1, 1.9, 10]} />
        <meshStandardMaterial color="#C9BA98" roughness={0.97} />
      </instancedMesh>
      {/* kilim kuşakları */}
      <instancedMesh ref={kusakRef} args={[undefined, undefined, veri.siradan.length]} frustumCulled>
        <cylinderGeometry args={[2.93, 2.95, 0.55, 10, 1, true]} />
        <meshStandardMaterial map={kilim} roughness={0.92} side={THREE.DoubleSide} />
      </instancedMesh>

      {/* uzak kalabalık */}
      <instancedMesh ref={halkRef} args={[undefined, undefined, veri.kisiler.length]} castShadow frustumCulled>
        <capsuleGeometry args={[0.2, 0.95, 4, 8]} />
        <meshStandardMaterial color="#B9A98C" roughness={0.95} />
      </instancedMesh>

      {/* ileri gelen çadırları — daha büyük, kırmızı çatılı, tuğlu */}
      <instancedMesh ref={beyGovdeRef} args={[undefined, undefined, veri.beyler.length]} castShadow receiveShadow frustumCulled>
        <cylinderGeometry args={[3.0, 3.35, 2.5, 12]} />
        <meshStandardMaterial map={kece} color="#EBE0C4" roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={beyCatiRef} args={[undefined, undefined, veri.beyler.length]} castShadow frustumCulled>
        <coneGeometry args={[3.7, 2.6, 12]} />
        <meshStandardMaterial color="#9E3A32" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={beyTugRef} args={[undefined, undefined, veri.beyler.length]} castShadow frustumCulled>
        <cylinderGeometry args={[0.13, 0.16, 5.2, 6]} />
        <meshStandardMaterial color="#6E4B26" roughness={0.9} />
      </instancedMesh>

      {/* ocak dumanları */}
      <instancedMesh ref={dumanRef} args={[undefined, undefined, veri.dumanlar.length]} frustumCulled>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={leke} color="#9aa7bd" transparent opacity={0.16} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}
