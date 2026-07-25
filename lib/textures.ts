"use client";

import * as THREE from "three";

/** Prosedürel dokular — GLB gelene kadar sahneye gerçek malzeme hissi verir */

const _kilimler: (THREE.CanvasTexture | null)[] = [null, null, null, null, null];
let _kilim: THREE.CanvasTexture | null = null;
let _kece: THREE.CanvasTexture | null = null;
let _tamga: THREE.CanvasTexture | null = null;
let _zemin: THREE.CanvasTexture | null = null;
let _ahsap: THREE.CanvasTexture | null = null;

function tuval(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, g: c.getContext("2d")! };
}

/** Kilim palet çeşitleri — her tezgâhtan farklı desen çıkar */
const KILIM_PALETLERI = [
  { zemin: "#A63A32", cerceve: "#F7EBD3", m1: "#4BB3A9", m2: "#F0A44A", ic: "#2A2118" },
  { zemin: "#7A2E28", cerceve: "#E8DCC0", m1: "#C9A24B", m2: "#8A6A24", ic: "#241C14" },
  { zemin: "#3E5A52", cerceve: "#F2E6CB", m1: "#B8433A", m2: "#E0C878", ic: "#1E2A26" },
  { zemin: "#8A6A24", cerceve: "#F7EBD3", m1: "#A63A32", m2: "#4BB3A9", ic: "#2E2416" },
  { zemin: "#4A3A5E", cerceve: "#EFE0C4", m1: "#D9A441", m2: "#7FA8A0", ic: "#241C2E" },
];

/**
 * Kilim dokusu — beş farklı palet ve desen düzeni.
 * Her tezgâh ve yaygı farklı çıksın diye varyant alır.
 */
export function kilimDokusu(varyant = 0): THREE.CanvasTexture {
  const v = ((varyant % KILIM_PALETLERI.length) + KILIM_PALETLERI.length) % KILIM_PALETLERI.length;
  const onbellek = _kilimler[v];
  if (onbellek) return onbellek;
  const P = KILIM_PALETLERI[v];
  const { c, g } = tuval(256, 256);
  g.fillStyle = P.zemin;
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = P.cerceve;
  g.lineWidth = 5;
  g.strokeRect(14, 14, 228, 228);
  const motifSayisi = 2 + (v % 3);
  for (let i = 0; i < motifSayisi; i++) {
    const cx = 128 + (i - (motifSayisi - 1) / 2) * 68;
    g.fillStyle = i % 2 === 0 ? P.m1 : P.m2;
    if (v % 2 === 0) {
      g.beginPath();
      g.moveTo(cx, 84); g.lineTo(cx + 34, 128); g.lineTo(cx, 172); g.lineTo(cx - 34, 128);
      g.closePath(); g.fill();
    } else {
      g.fillRect(cx - 28, 100, 56, 56);
      g.fillStyle = P.cerceve;
      g.fillRect(cx - 14, 114, 28, 28);
    }
    g.fillStyle = P.ic;
    g.beginPath();
    g.moveTo(cx, 112); g.lineTo(cx + 13, 128); g.lineTo(cx, 144); g.lineTo(cx - 13, 128);
    g.closePath(); g.fill();
  }
  g.fillStyle = P.cerceve;
  const adim = 26 + (v % 3) * 6;
  for (let x = 34; x < 240; x += adim) {
    g.fillRect(x, 30, 12, 12);
    g.fillRect(x, 214, 12, 12);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  _kilimler[v] = t;
  return t;
}

function _eskiKilim(): THREE.CanvasTexture {
  if (_kilim) return _kilim;
  const { c, g } = tuval(256, 256);
  g.fillStyle = "#A63A32";
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = "#F7EBD3";
  g.lineWidth = 5;
  g.strokeRect(14, 14, 228, 228);
  for (let i = 0; i < 3; i++) {
    const cx = 64 + i * 64;
    g.fillStyle = i % 2 === 0 ? "#4BB3A9" : "#F0A44A";
    g.beginPath();
    g.moveTo(cx, 84);
    g.lineTo(cx + 34, 128);
    g.lineTo(cx, 172);
    g.lineTo(cx - 34, 128);
    g.closePath();
    g.fill();
    g.fillStyle = "#2A2118";
    g.beginPath();
    g.moveTo(cx, 112);
    g.lineTo(cx + 13, 128);
    g.lineTo(cx, 144);
    g.lineTo(cx - 13, 128);
    g.closePath();
    g.fill();
  }
  g.fillStyle = "#F7EBD3";
  for (let x = 34; x < 240; x += 32) {
    g.fillRect(x, 30, 14, 14);
    g.fillRect(x, 212, 14, 14);
  }
  _kilim = new THREE.CanvasTexture(c);
  _kilim.colorSpace = THREE.SRGBColorSpace;
  return _kilim;
}
void _eskiKilim;

/** Keçe: yıpranmış yün dokusu, dikiş şeritleri */
const KECE_RENKLERI = ["#D9CBAA", "#C9BEA0", "#E0D4B6", "#CFC0A2", "#BFB393"];
const _keceler: (THREE.CanvasTexture | null)[] = [null, null, null, null, null];

/** Keçe dokusu — beş ton, her otağ biraz farklı */
export function keceDokusu(varyant = 0): THREE.CanvasTexture {
  const v = ((varyant % 5) + 5) % 5;
  if (_keceler[v]) return _keceler[v]!;
  const { c, g } = tuval(256, 256);
  g.fillStyle = KECE_RENKLERI[v];
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = Math.random() > 0.5 ? "#C6B694" : "#E4D9BE";
    g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  g.strokeStyle = "#B8433A";
  g.lineWidth = 2.5;
  g.setLineDash([9, 8]);
  for (let y = 40; y < 256; y += 72) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(256, y);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 1);
  t.colorSpace = THREE.SRGBColorSpace;
  _keceler[v] = t;
  void _kece;
  return t;
}

/** Balbal yüzeyi: aşınmış granit + kazınmış yüz ve kemer */
export function tamgaDokusu(): THREE.CanvasTexture {
  if (_tamga) return _tamga;
  const { c, g } = tuval(128, 256);
  g.fillStyle = "#5A6474";
  g.fillRect(0, 0, 128, 256);
  for (let i = 0; i < 1400; i++) {
    const v = Math.random();
    g.fillStyle = v > 0.66 ? "#4E5766" : v > 0.33 ? "#646E80" : "#525C6C";
    g.fillRect(Math.random() * 128, Math.random() * 256, 3, 3);
  }
  g.strokeStyle = "#3C4552";
  g.lineWidth = 4.5;
  g.lineCap = "round";
  // yüz
  g.beginPath();
  g.arc(64, 70, 26, 0, Math.PI * 2);
  g.stroke();
  g.beginPath();
  g.moveTo(52, 64);
  g.lineTo(58, 64);
  g.moveTo(70, 64);
  g.lineTo(76, 64);
  g.stroke();
  // bıyık
  g.beginPath();
  g.moveTo(50, 82);
  g.quadraticCurveTo(64, 88, 78, 82);
  g.stroke();
  // kâse tutan el
  g.beginPath();
  g.arc(64, 132, 11, 0, Math.PI * 2);
  g.stroke();
  // kemer
  g.beginPath();
  g.moveTo(36, 168);
  g.lineTo(92, 168);
  g.stroke();
  g.lineWidth = 3;
  for (let x = 42; x < 92; x += 12) {
    g.beginPath();
    g.moveTo(x, 168);
    g.lineTo(x, 178);
    g.stroke();
  }
  // liken lekeleri
  for (let i = 0; i < 40; i++) {
    g.fillStyle = "rgba(120,140,110,0.18)";
    g.beginPath();
    g.arc(Math.random() * 128, Math.random() * 256, 2 + Math.random() * 6, 0, Math.PI * 2);
    g.fill();
  }
  _tamga = new THREE.CanvasTexture(c);
  _tamga.colorSpace = THREE.SRGBColorSpace;
  return _tamga;
}

/** Ahşap: damarlı, yıpranmış */
export function ahsapDokusu(): THREE.CanvasTexture {
  if (_ahsap) return _ahsap;
  const { c, g } = tuval(256, 256);
  g.fillStyle = "#6E4B26";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 46; i++) {
    g.strokeStyle = Math.random() > 0.5 ? "#5A3D20" : "#7E5A30";
    g.lineWidth = 1 + Math.random() * 3;
    const y = Math.random() * 256;
    g.beginPath();
    g.moveTo(0, y);
    g.bezierCurveTo(80, y + (Math.random() - 0.5) * 14, 170, y + (Math.random() - 0.5) * 14, 256, y);
    g.stroke();
  }
  for (let i = 0; i < 700; i++) {
    g.fillStyle = "rgba(40,26,12,0.10)";
    g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  _ahsap = new THREE.CanvasTexture(c);
  _ahsap.wrapS = _ahsap.wrapT = THREE.RepeatWrapping;
  _ahsap.colorSpace = THREE.SRGBColorSpace;
  return _ahsap;
}

/** Zemin: kuru bozkır toprağı */
export function zeminDokusu(): THREE.CanvasTexture {
  if (_zemin) return _zemin;
  const { c, g } = tuval(256, 256);
  g.fillStyle = "#33404A";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 6000; i++) {
    const v = Math.random();
    g.fillStyle = v > 0.66 ? "#3B4A54" : v > 0.33 ? "#2C3843" : "#42535A";
    g.fillRect(Math.random() * 256, Math.random() * 256, 2.4, 2.4);
  }
  _zemin = new THREE.CanvasTexture(c);
  _zemin.wrapS = _zemin.wrapT = THREE.RepeatWrapping;
  _zemin.repeat.set(36, 36);
  _zemin.colorSpace = THREE.SRGBColorSpace;
  return _zemin;
}

/** Yumuşak yuvarlak leke — duman, kıvılcım parıltısı, hale */
export function lekeDokusu(): THREE.CanvasTexture {
  const { c, g } = tuval(64, 64);
  const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  gr.addColorStop(0, "rgba(255,255,255,0.75)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(32, 32, 30, 0, Math.PI * 2);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Ot yaprakları — billboard için şeffaf doku */
export function otDokusu(): THREE.CanvasTexture {
  const { c, g } = tuval(64, 64);
  g.clearRect(0, 0, 64, 64);
  g.strokeStyle = "#46615C";
  g.lineWidth = 3;
  g.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const x = 5 + i * 6.8;
    g.beginPath();
    g.moveTo(x, 64);
    g.quadraticCurveTo(x + (Math.random() * 10 - 5), 32, x + (Math.random() * 18 - 9), 4 + Math.random() * 12);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}


/* ============================================================
   ZEMİN DOKULARI — eğim ve yüksekliğe göre harmanlanır
   ============================================================ */

let _cim: THREE.CanvasTexture | null = null;
let _kuruToprak: THREE.CanvasTexture | null = null;
let _kayaZemin: THREE.CanvasTexture | null = null;
let _patikaDoku: THREE.CanvasTexture | null = null;

function benekle(
  g: CanvasRenderingContext2D, boyut: number,
  temel: string, benekler: [string, number, number, number][]
) {
  g.fillStyle = temel;
  g.fillRect(0, 0, boyut, boyut);
  for (const [renk, adet, minR, maxR] of benekler) {
    g.fillStyle = renk;
    for (let i = 0; i < adet; i++) {
      const x = Math.random() * boyut;
      const y = Math.random() * boyut;
      const r = minR + Math.random() * (maxR - minR);
      g.beginPath();
      g.ellipse(x, y, r, r * (0.5 + Math.random() * 0.9), Math.random() * 3.14, 0, Math.PI * 2);
      g.fill();
    }
  }
}

/** Bozkır otu — seyrek, kuru yeşil */
export function cimDokusu(): THREE.CanvasTexture {
  if (_cim) return _cim;
  const { c, g } = tuval(256, 256);
  benekle(g, 256, "#6E7A4A", [
    ["#7E8A55", 900, 1, 3],
    ["#5C6840", 700, 1, 2.6],
    ["#8C9660", 400, 0.8, 2],
    ["#4E5836", 300, 1, 3.4],
  ]);
  // ot tutamları
  g.strokeStyle = "#7A8752";
  g.lineWidth = 1;
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 256, y = Math.random() * 256;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (Math.random() - 0.5) * 4, y - 3 - Math.random() * 4);
    g.stroke();
  }
  _cim = new THREE.CanvasTexture(c);
  _cim.wrapS = _cim.wrapT = THREE.RepeatWrapping;
  _cim.colorSpace = THREE.SRGBColorSpace;
  return _cim;
}

/** Kuru toprak — çatlaklı, açık kahve */
export function kuruToprakDokusu(): THREE.CanvasTexture {
  if (_kuruToprak) return _kuruToprak;
  const { c, g } = tuval(256, 256);
  benekle(g, 256, "#9A8763", [
    ["#A99874", 600, 1, 3],
    ["#87755A", 700, 1, 3.2],
    ["#B5A184", 400, 1, 2.4],
  ]);
  // çatlaklar
  g.strokeStyle = "#6E5F47";
  g.lineWidth = 1.2;
  for (let i = 0; i < 26; i++) {
    let x = Math.random() * 256, y = Math.random() * 256;
    g.beginPath();
    g.moveTo(x, y);
    for (let j = 0; j < 5; j++) {
      x += (Math.random() - 0.5) * 40;
      y += (Math.random() - 0.5) * 40;
      g.lineTo(x, y);
    }
    g.stroke();
  }
  _kuruToprak = new THREE.CanvasTexture(c);
  _kuruToprak.wrapS = _kuruToprak.wrapT = THREE.RepeatWrapping;
  _kuruToprak.colorSpace = THREE.SRGBColorSpace;
  return _kuruToprak;
}

/** Kaya yüzeyi — dik eğimlerde görünür */
export function kayaZeminDokusu(): THREE.CanvasTexture {
  if (_kayaZemin) return _kayaZemin;
  const { c, g } = tuval(256, 256);
  benekle(g, 256, "#6B6A63", [
    ["#7B7A72", 500, 2, 7],
    ["#585850", 600, 2, 6],
    ["#8A897E", 300, 1.5, 5],
  ]);
  // katman çizgileri
  g.strokeStyle = "#4E4E48";
  g.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    const y = Math.random() * 256;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= 256; x += 32) g.lineTo(x, y + (Math.random() - 0.5) * 14);
    g.stroke();
  }
  _kayaZemin = new THREE.CanvasTexture(c);
  _kayaZemin.wrapS = _kayaZemin.wrapT = THREE.RepeatWrapping;
  _kayaZemin.colorSpace = THREE.SRGBColorSpace;
  return _kayaZemin;
}

/** Patika — ayak basmaktan sıkışmış çıplak toprak */
export function patikaDokusu(): THREE.CanvasTexture {
  if (_patikaDoku) return _patikaDoku;
  const { c, g } = tuval(256, 256);
  benekle(g, 256, "#8A7554", [
    ["#7A6647", 700, 1, 3.5],
    ["#9C875F", 500, 1, 3],
    ["#6B5A3E", 300, 1.5, 4],
  ]);
  _patikaDoku = new THREE.CanvasTexture(c);
  _patikaDoku.wrapS = _patikaDoku.wrapT = THREE.RepeatWrapping;
  _patikaDoku.colorSpace = THREE.SRGBColorSpace;
  return _patikaDoku;
}
