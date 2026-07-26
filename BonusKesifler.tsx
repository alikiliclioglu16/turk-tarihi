"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ORTAM AYDINLATMASI (IBL) — küresel aydınlatmanın ucuz ama etkili karşılığı
 *
 * Prosedürel bir gece panoraması üretip PMREM ile ortam haritasına çevirir.
 * Sonuç: nesneler yukarıdan ay ışığının soğuk mavisini, aşağıdan toprağın ve
 * ocağın sıcak yansımasını alır. Tek bir yönlü ışıkla asla elde edilemeyecek
 * yumuşak geçişler ortaya çıkar.
 */
export function IBL() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const g = document.createElement("canvas");
    g.width = 256;
    g.height = 128;
    const c = g.getContext("2d")!;

    // dikey gradyan: tepe gece lacivertı → ufuk mavi-gri → zemin sıcak toprak
    const grad = c.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0.0, "#060b18");
    grad.addColorStop(0.42, "#1b2b4a");
    grad.addColorStop(0.52, "#33405c");
    grad.addColorStop(0.62, "#3a3226");
    grad.addColorStop(1.0, "#241c14");
    c.fillStyle = grad;
    c.fillRect(0, 0, 256, 128);

    // ay: soğuk parlak nokta
    const ay = c.createRadialGradient(70, 26, 2, 70, 26, 26);
    ay.addColorStop(0, "rgba(226,236,255,0.95)");
    ay.addColorStop(1, "rgba(226,236,255,0)");
    c.fillStyle = ay;
    c.fillRect(40, 0, 60, 56);

    // ocak: alttan sıcak yansıma (nesnelerin alt yüzlerini ısıtır)
    const ates = c.createRadialGradient(128, 84, 4, 128, 84, 58);
    ates.addColorStop(0, "rgba(240,164,74,0.75)");
    ates.addColorStop(0.5, "rgba(229,112,58,0.28)");
    ates.addColorStop(1, "rgba(229,112,58,0)");
    c.fillStyle = ates;
    c.fillRect(60, 40, 136, 88);

    const doku = new THREE.CanvasTexture(g);
    doku.mapping = THREE.EquirectangularReflectionMapping;
    doku.colorSpace = THREE.SRGBColorSpace;

    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const hedef = pmrem.fromEquirectangular(doku);
    scene.environment = hedef.texture;
    scene.environmentIntensity = 0.55;

    doku.dispose();
    pmrem.dispose();

    return () => {
      scene.environment = null;
      hedef.dispose();
    };
  }, [gl, scene]);

  return null;
}
