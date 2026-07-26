import * as THREE from "three";

/**
 * TERS KINEMATIK (IK)
 *
 * Ileri kinematikte kemik acilarini verirsiniz, el nereye giderse gider.
 * Ters kinematikte ELIN NEREYE GIDECEGINI verirsiniz, acilari cozer.
 *
 * Fark: demircinin cekici gercekten orse iner, comlekcinin elleri carkin
 * kenarini tutar, herkesin basi sahnenin odagina doner, ayaklar egimli
 * zemine oturur.
 */

const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _eksen = new THREE.Vector3();

/** Bir kemige DUNYA uzayinda donus uygular (yerel donuse cevirerek) */
function dunyaDonusUygula(kemik: THREE.Object3D, dunyaDonus: THREE.Quaternion): void {
  const ebeveyn = kemik.parent;
  if (!ebeveyn) return;
  ebeveyn.getWorldQuaternion(_q);
  kemik.getWorldQuaternion(_q2);
  _q2.premultiply(dunyaDonus);
  kemik.quaternion.copy(_q.invert().multiply(_q2));
}

/**
 * Omuz-dirsek-bilek (veya kalca-diz-ayak) zincirini hedefe uzatir.
 * Analitik cozum: kosinus teoremiyle iki aci hesaplanir, tek karede coz9lur.
 */
export function ikIkiKemik(
  kok: THREE.Object3D,
  orta: THREE.Object3D,
  uc: THREE.Object3D,
  hedef: THREE.Vector3,
  kutup: THREE.Vector3 | null = null,
  agirlik = 1
): void {
  if (agirlik <= 0.001) return;

  kok.updateWorldMatrix(true, false);
  orta.updateWorldMatrix(false, false);
  uc.updateWorldMatrix(false, false);

  const kokP = _v1.setFromMatrixPosition(kok.matrixWorld).clone();
  const ortaP = _v2.setFromMatrixPosition(orta.matrixWorld).clone();
  const ucP = _v3.setFromMatrixPosition(uc.matrixWorld).clone();

  const a = kokP.distanceTo(ortaP);
  const b = ortaP.distanceTo(ucP);
  if (a < 1e-5 || b < 1e-5) return;

  const hedefYon = hedef.clone().sub(kokP);
  let c = hedefYon.length();
  const enUzun = (a + b) * 0.995;
  const enKisa = Math.abs(a - b) * 1.02 + 1e-4;
  c = THREE.MathUtils.clamp(c, enKisa, enUzun);
  if (c < 1e-5) return;
  hedefYon.normalize();

  const mevcutYon = ucP.clone().sub(kokP).normalize();
  _q.setFromUnitVectors(mevcutYon, hedefYon);
  if (agirlik < 1) _q.slerp(new THREE.Quaternion(), 1 - agirlik);
  dunyaDonusUygula(kok, _q);

  kok.updateWorldMatrix(true, false);
  orta.updateWorldMatrix(false, false);
  uc.updateWorldMatrix(false, false);
  const ortaP2 = new THREE.Vector3().setFromMatrixPosition(orta.matrixWorld);
  const ucP2 = new THREE.Vector3().setFromMatrixPosition(uc.matrixWorld);

  if (kutup) {
    _eksen.copy(kutup).sub(kokP).cross(hedefYon).normalize();
  } else {
    _eksen.copy(ortaP2).sub(kokP).cross(ucP2.clone().sub(kokP)).normalize();
  }
  if (_eksen.lengthSq() < 1e-8) _eksen.set(0, 0, 1);

  const kokAci = Math.acos(THREE.MathUtils.clamp((a * a + c * c - b * b) / (2 * a * c), -1, 1));
  const ortaAci = Math.acos(THREE.MathUtils.clamp((a * a + b * b - c * c) / (2 * a * b), -1, 1));

  const kokMevcut = Math.acos(THREE.MathUtils.clamp(
    ortaP2.clone().sub(kokP).normalize().dot(hedefYon), -1, 1));
  const ortaMevcut = Math.acos(THREE.MathUtils.clamp(
    kokP.clone().sub(ortaP2).normalize().dot(ucP2.clone().sub(ortaP2).normalize()), -1, 1));

  _q.setFromAxisAngle(_eksen, (kokAci - kokMevcut) * agirlik);
  dunyaDonusUygula(kok, _q);

  orta.updateWorldMatrix(true, false);
  _q2.setFromAxisAngle(_eksen, (ortaAci - ortaMevcut) * agirlik);
  dunyaDonusUygula(orta, _q2);
}

/** Basi hedefe dondurur. Boyun %40, bas %60 paylasir; sinirlar uygulanir. */
export function bakisUygula(
  boyun: THREE.Object3D | null,
  bas: THREE.Object3D | null,
  hedef: THREE.Vector3,
  govde: THREE.Object3D | null,
  agirlik = 1,
  sinirYatay = 1.31,
  sinirDikey = 0.7
): void {
  if (!bas || agirlik <= 0.001) return;
  bas.updateWorldMatrix(true, false);
  const basP = new THREE.Vector3().setFromMatrixPosition(bas.matrixWorld);

  const ileri = new THREE.Vector3(0, 0, 1);
  if (govde) {
    govde.getWorldQuaternion(_q);
    ileri.applyQuaternion(_q);
  }
  ileri.y = 0;
  ileri.normalize();

  const hedefYon = hedef.clone().sub(basP);
  const mesafe = hedefYon.length();
  if (mesafe < 0.05) return;
  hedefYon.normalize();

  const yatayYon = hedefYon.clone();
  yatayYon.y = 0;
  if (yatayYon.lengthSq() < 1e-6) return;
  yatayYon.normalize();

  let yatayAci = Math.atan2(
    ileri.x * yatayYon.z - ileri.z * yatayYon.x,
    ileri.x * yatayYon.x + ileri.z * yatayYon.z
  );
  let dikeyAci = Math.asin(THREE.MathUtils.clamp(hedefYon.y, -1, 1));

  yatayAci = THREE.MathUtils.clamp(yatayAci, -sinirYatay, sinirYatay) * agirlik;
  dikeyAci = THREE.MathUtils.clamp(dikeyAci, -sinirDikey, sinirDikey) * agirlik;

  if (boyun) {
    boyun.rotation.y += yatayAci * 0.4;
    boyun.rotation.x += -dikeyAci * 0.35;
  }
  bas.rotation.y += yatayAci * 0.6;
  bas.rotation.x += -dikeyAci * 0.65;
}

/** Ayagi zemine oturtur. Egimli arazide ayak havada kalmasin diye. */
export function ayakOturt(
  kalca: THREE.Object3D | null,
  diz: THREE.Object3D | null,
  ayak: THREE.Object3D | null,
  zeminY: number,
  agirlik = 0.7,
  ayakYuksekligi = 0.09
): void {
  if (!kalca || !diz || !ayak || agirlik <= 0.001) return;
  ayak.updateWorldMatrix(true, false);
  const ayakP = new THREE.Vector3().setFromMatrixPosition(ayak.matrixWorld);

  const hedefY = zeminY + ayakYuksekligi;
  const fark = hedefY - ayakP.y;
  if (Math.abs(fark) < 0.01 || Math.abs(fark) > 0.6) return;

  const hedef = ayakP.clone();
  hedef.y = hedefY;
  ikIkiKemik(kalca, diz, ayak, hedef, null, agirlik);
}

/** Yerel noktayi dunya uzayina cevirir */
export function yereldenDunyaya(
  nesne: THREE.Object3D,
  yerel: [number, number, number]
): THREE.Vector3 {
  return new THREE.Vector3(yerel[0], yerel[1], yerel[2]).applyMatrix4(nesne.matrixWorld);
}
