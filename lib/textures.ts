"use client";

import * as THREE from "three";

/** Prosedürel dokular — GLB gelene kadar sahneye gerçek malzeme hissi verir */

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

/** Kilim: kök boya kırmızısı zemin, koçboynuzu ve baklava motifleri */
export function kilimDokusu(): THREE.CanvasTexture {
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

/** Keçe: yıpranmış yün dokusu, dikiş şeritleri */
export function keceDokusu(): THREE.CanvasTexture {
  if (_kece) return _kece;
  const { c, g } = tuval(256, 256);
  g.fillStyle = "#D9CBAA";
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
  _kece = new THREE.CanvasTexture(c);
  _kece.wrapS = _kece.wrapT = THREE.RepeatWrapping;
  _kece.repeat.set(3, 1);
  _kece.colorSpace = THREE.SRGBColorSpace;
  return _kece;
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
