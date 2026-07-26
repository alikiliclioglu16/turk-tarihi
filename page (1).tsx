import * as THREE from "three";

/**
 * TERS KİNEMATİK (IK)
 *
 * İleri kinematikte kemik açılarını verirsiniz, el nereye giderse gider.
 * Ters kinematikte ELİN NEREYE GİDECEĞİNİ verirsiniz, açıları çözer.
 *
 * Fark şurada görünür:
 *   · Demircinin çekici gerçekten örse iner
 *   · Çömlekçinin elleri çarkın kenarını tutar
 *   · Okçunun eli kirişte durur
 *   · Herkesin başı sahnenin odağına döner
 *   · Ayaklar eğimli zemine oturur, havada kalmaz
 *
 * Prosedürel açı eklemekle asla elde edilemeyen şey budur: nesneyle
 * gerçek temas.
 */

/* ---------- yardımcılar ---------- */

const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _eksen = new THREE.Vector3();

/** Bir kemiğe DÜNYA uzayında dönüş uygular (yerel dönüşe çevirerek) */
function dunyaDonusUygula(kemik: THREE.Object3D, dunyaDonus: THREE.Quaternion): void {
  const ebeveyn = kemik.parent;
  if (!ebeveyn) return;
  ebeveyn.getWorldQuaternion(_q);      // ebeveynin dünya dönüşü
  kemik.getWorldQuaternion(_q2);       // kemiğin dünya dönüşü
  _q2.premultiply(dunyaDonus);         // istenen yeni dünya dönüşü
  kemik.quaternion.copy(_q.invert().multiply(_q2));
}

/* ============================================================
   İKİ KEMİKLİ UZUV ÇÖZÜCÜ
   ============================================================ */

/**
 * Omuz–dirsek–bilek (veya kalça–diz–ayak) zincirini hedefe uzatır.
 *
 * Analitik çözüm: kosinüs teoremiyle iki açı hesaplanır, tek karede
 * çözülür — yinelemeli çözücülerden hızlı ve kararlıdır.
 *
 * @param kok    omuz / kalça
 * @param orta   dirsek / diz
 * @param uc     bilek / ayak bileği
 * @param hedef  dünya uzayında varış noktası
 * @param kutup  dirseğin/dizin bakacağı yön (dünya uzayı) — null ise mevcut yön korunur
 * @param agirlik 0 = IK kapalı, 1 = tam IK. Aradaki değerler karıştırır.
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

  const a = kokP.distanceTo(ortaP);   // üst kol
  const b = ortaP.distanceTo(ucP);    // ön kol
  if (a < 1e-5 || b < 1e-5) return;

  // hedefe uzaklık — uzuvdan uzunsa kırpılır (uzuv kopmasın)
  const hedefYon = hedef.clone().sub(kokP);
  let c = hedefYon.length();
  const enUzun = (a + b) * 0.995;
  const enKisa = Math.abs(a - b) * 1.02 + 1e-4;
  c = THREE.MathUtils.clamp(c, enKisa, enUzun);
  if (c < 1e-5) return;
  hedefYon.normalize();

  /* ---- 1. adım: uzvu hedefe doğrult ---- */
  const mevcutYon = ucP.clone().sub(kokP).normalize();
  _q.setFromUnitVectors(mevcutYon, hedefYon);
  if (agirlik < 1) _q.slerp(new THREE.Quaternion(), 1 - agirlik);
  dunyaDonusUygula(kok, _q);

  // konumlar değişti, yeniden oku
  kok.updateWorldMatrix(true, false);
  orta.updateWorldMatrix(false, false);
  uc.updateWorldMatrix(false, false);
  const ortaP2 = new THREE.Vector3().setFromMatrixPosition(orta.matrixWorld);
  const ucP2 = new THREE.Vector3().setFromMatrixPosition(uc.matrixWorld);

  /* ---- 2. adım: bükülme eksenini belirle ---- */
  if (kutup) {
    _eksen.copy(kutup).sub(kokP).cross(hedefYon).normalize();
  } else {
    _eksen.copy(ortaP2).sub(kokP).cross(ucP2.clone().sub(kokP)).normalize();
  }
  if (_eksen.lengthSq() < 1e-8) _eksen.set(0, 0, 1);

  /* ---- 3. adım: kosinüs teoremiyle açılar ---- */
  const kokAci = Math.acos(THREE.MathUtils.clamp((a * a + c * c - b * b) / (2 * a * c), -1, 1));
  const ortaAci = Math.acos(THREE.MathUtils.clamp((a * a + b * b - c * c) / (2 * a * b), -1, 1));

  // mevcut açılar
  const kokMevcut = Math.acos(THREE.MathUtils.clamp(
    ortaP2.clone().sub(kokP).normalize().dot(hedefYon), -1, 1));
  const ortaMevcut = Math.acos(THREE.MathUtils.clamp(
    kokP.clone().sub(ortaP2).normalize().dot(ucP2.clone().sub(ortaP2).normalize()), -1, 1));

  /* ---- 4. adım: farkı uygula ---- */
  _q.setFromAxisAngle(_eksen, (kokAci - kokMevcut) * agirlik);
  dunyaDonusUygula(kok, _q);

  orta.updateWorldMatrix(true, false);
  _q2.setFromAxisAngle(_eksen, (ortaAci - ortaMevcut) * agirlik);
  dunyaDonusUygula(orta, _q2);
}

/* ============================================================
   BAKIŞ (baş ve boyun)
   ============================================================ */

/**
 * Başı hedefe döndürür. Boyun ve baş arasında paylaştırır; insan
 * boynu 360° dönmediği için sınır uygulanır.
 *
 * @param sinirYatay  yatay dönüş sınırı (radyan) — varsayılan 75°
 * @param sinirDikey  dikey dönüş sınırı — varsayılan 40°
 */
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

  // gövdenin baktığı yön (referans)
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

  // yatay ve dikey açıları ayır
  const yatayYon = hedefYon.clone();
  yatayYon.y = 0;
  if (yatayYon.lengthSq() < 1e-6) return;
  yatayYon.normalize();

  let yatayAci = Math.atan2(
    ileri.x * yatayYon.z - ileri.z * yatayYon.x,
    ileri.x * yatayYon.x + ileri.z * yatayYon.z
  );
  let dikeyAci = Math.asin(THREE.MathUtils.clamp(hedefYon.y, -1, 1));

  // sınırla — boyun kopmasın
  yatayAci = THREE.MathUtils.clamp(yatayAci, -sinirYatay, sinirYatay) * agirlik;
  dikeyAci = THREE.MathUtils.clamp(dikeyAci, -sinirDikey, sinirDikey) * agirlik;

  // boyuna %40, başa %60 — doğal paylaşım
  if (boyun) {
    boyun.rotation.y += yatayAci * 0.4;
    boyun.rotation.x += -dikeyAci * 0.35;
  }
  bas.rotation.y += yatayAci * 0.6;
  bas.rotation.x += -dikeyAci * 0.65;
}

/* ============================================================
   AYAK OTURTMA
   ============================================================ */

/**
 * Ayağı zemine oturtur. Eğimli arazide bir ayak havada, diğeri
 * gömülü kalmasın diye.
 *
 * @param zeminY  ayağın bulunduğu noktadaki arazi yüksekliği (dünya)
 */
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
  // yalnız ayak zeminin ALTINDAYSA veya biraz üstündeyse düzelt
  if (Math.abs(fark) < 0.01 || Math.abs(fark) > 0.6) return;

  const hedef = ayakP.clone();
  hedef.y = hedefY;
  ikIkiKemik(kalca, diz, ayak, hedef, null, agirlik);
}

/* ============================================================
   YARDIMCI: yerel noktayı dünyaya çevir
   ============================================================ */

export function yereldenDunyaya(
  nesne: THREE.Object3D,
  yerel: [number, number, number]
): THREE.Vector3 {
  return new THREE.Vector3(yerel[0], yerel[1], yerel[2]).applyMatrix4(nesne.matrixWorld);
}
