"use client";

/**
 * SES KATMANI
 *
 * İki kaynak birden çalışır:
 *  1) Gerçek kayıtlar — public/audio/d01/ içine WAV/MP3 konduğunda otomatik çalar.
 *     Dosya yoksa sessizce atlanır, hata vermez.
 *  2) Sentezlenmiş geçici ambiyans — rüzgâr, ateş, başarı tınısı.
 *     Gerçek kayıtlar gelene kadar sahne sessiz kalmasın diye.
 *
 * Tarayıcı kuralı gereği ses ancak kullanıcı ekrana ilk kez dokunduktan
 * sonra başlayabilir; baslat() bunu yönetir.
 */

let ctx: AudioContext | null = null;
let anaKazanc: GainNode | null = null;
let ambiyansKazanc: GainNode | null = null;
let ruzgarKaynak: AudioBufferSourceNode | null = null;
let atesKaynak: AudioBufferSourceNode | null = null;
let atesKazanc: GainNode | null = null;
let citirtiZaman: number | null = null;
let basladi = false;
let sessiz = false;

/** Beyaz gürültü tamponu */
function gurultuTamponu(saniye = 3): AudioBuffer {
  const c = ctx!;
  const buf = c.createBuffer(1, c.sampleRate * saniye, c.sampleRate);
  const veri = buf.getChannelData(0);
  let son = 0;
  for (let i = 0; i < veri.length; i++) {
    const beyaz = Math.random() * 2 - 1;
    son = (son + 0.02 * beyaz) / 1.02; // kahverengi gürültüye yaklaştır
    veri[i] = son * 3.2;
  }
  return buf;
}

export function sesBaslat(): void {
  if (basladi) return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    anaKazanc = ctx.createGain();
    anaKazanc.gain.value = sessiz ? 0 : 1;
    anaKazanc.connect(ctx.destination);

    ambiyansKazanc = ctx.createGain();
    ambiyansKazanc.gain.value = 0.5;
    ambiyansKazanc.connect(anaKazanc);

    // rüzgâr: alçak geçiren filtreli gürültü + yavaş dalgalanma
    const tampon = gurultuTamponu(4);
    ruzgarKaynak = ctx.createBufferSource();
    ruzgarKaynak.buffer = tampon;
    ruzgarKaynak.loop = true;
    const ruzgarFiltre = ctx.createBiquadFilter();
    ruzgarFiltre.type = "lowpass";
    ruzgarFiltre.frequency.value = 340;
    const ruzgarKazanc = ctx.createGain();
    ruzgarKazanc.gain.value = 0.16;
    ruzgarKaynak.connect(ruzgarFiltre).connect(ruzgarKazanc).connect(ambiyansKazanc);
    // yavaş nefes alma
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoKazanc = ctx.createGain();
    lfoKazanc.gain.value = 0.07;
    lfo.connect(lfoKazanc).connect(ruzgarKazanc.gain);
    lfo.start();
    ruzgarKaynak.start();

    // ateş: bant geçiren gürültü + rastgele çıtırtı
    atesKaynak = ctx.createBufferSource();
    atesKaynak.buffer = tampon;
    atesKaynak.loop = true;
    const atesFiltre = ctx.createBiquadFilter();
    atesFiltre.type = "bandpass";
    atesFiltre.frequency.value = 900;
    atesFiltre.Q.value = 0.7;
    atesKazanc = ctx.createGain();
    atesKazanc.gain.value = 0.05;
    atesKaynak.connect(atesFiltre).connect(atesKazanc).connect(ambiyansKazanc);
    atesKaynak.start();

    citirtiZaman = window.setInterval(() => {
      if (!ctx || !atesKazanc) return;
      const hedef = 0.035 + Math.random() * 0.05;
      atesKazanc.gain.setTargetAtTime(hedef, ctx.currentTime, 0.08);
    }, 130);

    basladi = true;
    kopuzBaslat();
  } catch {
    /* ses desteklenmiyor — sessizce devam */
  }
}

export function sesDurdur(): void {
  if (citirtiZaman) window.clearInterval(citirtiZaman);
  citirtiZaman = null;
  try {
    ruzgarKaynak?.stop();
    atesKaynak?.stop();
    ctx?.close();
  } catch {
    /* yoksay */
  }
  ctx = null;
  basladi = false;
}

export function sessizAyarla(deger: boolean): void {
  sessiz = deger;
  if (deger) seslendirmeyiDurdur();
  if (deger) sesKonumGuncelle(1e9, 1e9);
  if (anaKazanc && ctx) anaKazanc.gain.setTargetAtTime(deger ? 0 : 1, ctx.currentTime, 0.05);
  if (aktifAnlati) aktifAnlati.muted = deger;
}

export function sessizMi(): boolean {
  return sessiz;
}

/* ============================================================
   KOPUZ EZGİSİ — atmosfer müziği
   Karplus-Strong benzeri mızraplı tel sentezi ile üretilmiş
   pentatonik bir ezgi. Gerçek kopuz kaydı geldiğinde kapatılacak.
   ============================================================ */

let ezgiZaman: number | null = null;
let ezgiKazanc: GainNode | null = null;

/** Tek bir tel darbesi — mızrap sesi */
function telCal(frekans: number, sure: number, guc: number, gecikme: number) {
  if (!ctx || !ezgiKazanc) return;
  const t0 = ctx.currentTime + gecikme;
  const n = Math.floor(ctx.sampleRate * sure);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const veri = buf.getChannelData(0);

  // Karplus-Strong: kısa gürültü + gecikme hattı ortalaması
  const p = Math.max(2, Math.floor(ctx.sampleRate / frekans));
  const hat = new Float32Array(p);
  for (let i = 0; i < p; i++) hat[i] = Math.random() * 2 - 1;
  let idx = 0;
  for (let i = 0; i < n; i++) {
    const sonraki = (idx + 1) % p;
    const deger = (hat[idx] + hat[sonraki]) * 0.5 * 0.996;
    veri[i] = hat[idx] * Math.exp(-3.2 * (i / n));
    hat[idx] = deger;
    idx = sonraki;
  }

  const kaynak = ctx.createBufferSource();
  kaynak.buffer = buf;
  const g = ctx.createGain();
  g.gain.value = guc;
  const filtre = ctx.createBiquadFilter();
  filtre.type = "lowpass";
  filtre.frequency.value = 2600;
  kaynak.connect(filtre).connect(g).connect(ezgiKazanc);
  kaynak.start(t0);
  kaynak.stop(t0 + sure);
}

/** Pentatonik ezgi — bozkır tınısı */
const EZGI: (number | null)[] = [
  0, null, 3, 5, 7, null, 5, 3,
  0, null, -2, 0, 3, null, 7, 5,
  7, 10, 7, 5, 3, null, 0, null,
  -2, null, 0, null, null, null, null, null,
];
const KOK_FREK = 146.83; // D3

function nota(yariTon: number): number {
  return KOK_FREK * Math.pow(2, yariTon / 12);
}

export function kopuzBaslat(): void {
  if (!ctx || ezgiZaman !== null) return;
  ezgiKazanc = ctx.createGain();
  ezgiKazanc.gain.value = 0.16;
  ezgiKazanc.connect(anaKazanc!);

  const olcuSure = 0.42;           // nota aralığı (sn)
  const dongu = EZGI.length * olcuSure;

  const cal = () => {
    if (!ctx) return;
    EZGI.forEach((n, i) => {
      if (n === null) return;
      telCal(nota(n), 1.6, 0.5 + (i % 4 === 0 ? 0.2 : 0), i * olcuSure);
    });
    // dem: her turda bir kez alt oktav
    telCal(nota(-12), 3.2, 0.35, 0);
    telCal(nota(-5), 3.0, 0.22, olcuSure * 8);
  };

  cal();
  ezgiZaman = window.setInterval(cal, dongu * 1000);
}

export function kopuzDurdur(): void {
  if (ezgiZaman !== null) window.clearInterval(ezgiZaman);
  ezgiZaman = null;
  try { ezgiKazanc?.disconnect(); } catch { /* yoksay */ }
  ezgiKazanc = null;
}

/** Anlatı sırasında müziği kıs */
export function kopuzKis(kis: boolean): void {
  if (!ezgiKazanc || !ctx) return;
  ezgiKazanc.gain.setTargetAtTime(kis ? 0.05 : 0.16, ctx.currentTime, 0.4);
}

/** Kopuz tonunda kısa başarı tınısı (gerçek kayıt gelene kadar) */
export function basariTinisi(): void {
  if (!ctx || !anaKazanc || sessiz) return;
  const notalar = [440, 523.25, 659.25];
  notalar.forEach((f, i) => {
    const o = ctx!.createOscillator();
    const g = ctx!.createGain();
    o.type = "triangle";
    o.frequency.value = f;
    const t0 = ctx!.currentTime + i * 0.13;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.18, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.9);
    o.connect(g).connect(anaKazanc!);
    o.start(t0);
    o.stop(t0 + 1.0);
  });
}

/** Hafif tık — hotspot ve buton onayı */
export function tik(): void {
  if (!ctx || !anaKazanc || sessiz) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.value = 660;
  const t0 = ctx.currentTime;
  g.gain.setValueAtTime(0.09, t0);
  g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.16);
  o.connect(g).connect(anaKazanc);
  o.start(t0);
  o.stop(t0 + 0.18);
}

/* ---------- Gerçek anlatı kayıtları ---------- */

let aktifAnlati: HTMLAudioElement | null = null;
const bulunamayan = new Set<string>();

/* ---------- Geçici seslendirme: tarayıcı sesi (TTS) ---------- */

let tercihEdilenSes: SpeechSynthesisVoice | null = null;
let sesListesiHazir = false;

function turkceSesBul(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const hepsi = window.speechSynthesis.getVoices();
  if (!hepsi.length) return null;
  sesListesiHazir = true;
  // önce Türkçe, sonra erkek olabilecek adlar
  const tr = hepsi.filter((v) => v.lang?.toLowerCase().startsWith("tr"));
  if (!tr.length) return null;
  const erkek = tr.find((v) => /tolga|ahmet|male|erkek/i.test(v.name));
  return erkek ?? tr[0];
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    tercihEdilenSes = turkceSesBul();
  };
}

/** Gerçek kayıt gelene kadar metni bilgisayar sesiyle okur */
export function seslendir(metin: string): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  if (sessiz || !metin) return false;
  try {
    window.speechSynthesis.cancel();
    if (!tercihEdilenSes && !sesListesiHazir) tercihEdilenSes = turkceSesBul();
    const s = new SpeechSynthesisUtterance(metin);
    s.lang = "tr-TR";
    if (tercihEdilenSes) s.voice = tercihEdilenSes;
    s.rate = 0.92;   // Dede Korkut ağırbaşlı konuşur
    s.pitch = 0.85;  // yaşlı ve derin
    s.volume = 1;
    // konuşurken ambiyansı kıs
    if (ambiyansKazanc && ctx) ambiyansKazanc.gain.setTargetAtTime(0.22, ctx.currentTime, 0.2);
    kopuzKis(true);
    const geriAc = () => {
      if (ambiyansKazanc && ctx) ambiyansKazanc.gain.setTargetAtTime(0.5, ctx.currentTime, 0.4);
      kopuzKis(false);
    };
    s.onend = geriAc;
    s.onerror = geriAc;
    window.speechSynthesis.speak(s);
    return true;
  } catch {
    return false;
  }
}

/**
 * Bir metnin okunma süresini tahmin eder (ms).
 * TTS hızı 0.92 ayarlı; Türkçe için ~2,3 kelime/saniye.
 * Gerçek ses dosyası varsa süre ondan alınır, bu tahmin üst sınır olur.
 */
export function anlatiSuresi(metin: string): number {
  const kelime = metin.trim().split(/\s+/).length;
  return Math.max(2600, Math.round((kelime / 2.3) * 1000) + 900);
}

export function seslendirmeyiDurdur(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch { /* yoksay */ }
  }
}

/**
 * Anlatı sesini çalar.
 * Gerçek kayıt varsa onu çalar; yoksa metni tarayıcı sesiyle okur.
 * @param yedekMetin kayıt bulunamazsa okunacak metin
 */
export function anlatiCal(dosyaAdi: string, yedekMetin?: string): boolean {
  if (bulunamayan.has(dosyaAdi) && yedekMetin) {
    return seslendir(yedekMetin);
  }
  if (!dosyaAdi) {
    return yedekMetin ? seslendir(yedekMetin) : false;
  }
  anlatiDurdur();
  try {
    const a = new Audio(`/audio/d01/${dosyaAdi}`);
    a.muted = sessiz;
    a.volume = 1;
    a.onerror = () => {
      bulunamayan.add(dosyaAdi);
      if (aktifAnlati === a) aktifAnlati = null;
      if (yedekMetin) seslendir(yedekMetin);
    };
    // anlatı çalarken ambiyansı kıs
    a.onplay = () => {
      if (ambiyansKazanc && ctx) ambiyansKazanc.gain.setTargetAtTime(0.22, ctx.currentTime, 0.2);
      kopuzKis(true);
    };
    const geriYukselt = () => {
      if (ambiyansKazanc && ctx) ambiyansKazanc.gain.setTargetAtTime(0.5, ctx.currentTime, 0.4);
      kopuzKis(false);
    };
    a.onended = geriYukselt;
    a.onpause = geriYukselt;
    aktifAnlati = a;
    void a.play().catch(() => {
      bulunamayan.add(dosyaAdi);
      if (yedekMetin) seslendir(yedekMetin);
    });
    return true;
  } catch {
    return false;
  }
}

export function anlatiDurdur(): void {
  seslendirmeyiDurdur();
  if (aktifAnlati) {
    try {
      aktifAnlati.pause();
      aktifAnlati.currentTime = 0;
    } catch {
      /* yoksay */
    }
    aktifAnlati = null;
  }
}

export function anlatiVarMi(dosyaAdi: string): boolean {
  return !bulunamayan.has(dosyaAdi);
}


/* ============================================================
   MEKÂN SESLERİ — mesafeye göre kısılan çevresel ses
   ============================================================ */

export interface SesKaynagi {
  id: string;
  x: number;
  z: number;
  /** bu mesafede duyulmaya başlar */
  menzil: number;
  /** en yakında ulaşacağı ses düzeyi */
  guc: number;
  tur: "demirci" | "pazar" | "su" | "ates" | "suru" | "meydan";
}

interface CanliKaynak {
  kaynak: SesKaynagi;
  kazanc: GainNode;
  durdur: () => void;
}

const canliKaynaklar = new Map<string, CanliKaynak>();
let mekanKazanc: GainNode | null = null;

function mekanKazancHazirla(): GainNode | null {
  if (!ctx || !anaKazanc) return null;
  if (!mekanKazanc) {
    mekanKazanc = ctx.createGain();
    mekanKazanc.gain.value = 0.85;
    mekanKazanc.connect(anaKazanc);
  }
  return mekanKazanc;
}

/** Filtreli gürültü döngüsü — su, kalabalık ve sürü için temel */
function gurultuDongusu(
  cikis: GainNode, tip: BiquadFilterType, frekans: number, q: number, hiz: number
): () => void {
  if (!ctx) return () => {};
  const uzunluk = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, uzunluk, ctx.sampleRate);
  const veri = buf.getChannelData(0);
  for (let i = 0; i < uzunluk; i++) veri[i] = Math.random() * 2 - 1;

  const kaynak = ctx.createBufferSource();
  kaynak.buffer = buf;
  kaynak.loop = true;

  const filtre = ctx.createBiquadFilter();
  filtre.type = tip;
  filtre.frequency.value = frekans;
  filtre.Q.value = q;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = hiz;
  const lfoKazanc = ctx.createGain();
  lfoKazanc.gain.value = frekans * 0.22;
  lfo.connect(lfoKazanc).connect(filtre.frequency);

  kaynak.connect(filtre).connect(cikis);
  kaynak.start();
  lfo.start();

  return () => {
    try { kaynak.stop(); lfo.stop(); } catch { /* yoksay */ }
  };
}

/** Demirci çekici — düzenli aralıklarla metalik vuruş */
function cekicDongusu(cikis: GainNode): () => void {
  if (!ctx) return () => {};
  const z = window.setInterval(() => {
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1850, t0);
    osc.frequency.exponentialRampToValueAtTime(620, t0 + 0.16);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.4);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1400;
    bp.Q.value = 2.2;
    osc.connect(bp).connect(g).connect(cikis);
    osc.start(t0);
    osc.stop(t0 + 0.45);
  }, 1180);
  return () => window.clearInterval(z);
}

/** Sürü — arada bir hayvan sesi */
function suruDongusu(cikis: GainNode): () => void {
  if (!ctx) return () => {};
  const z = window.setInterval(() => {
    if (!ctx || Math.random() > 0.45) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    const temel = 180 + Math.random() * 120;
    osc.frequency.setValueAtTime(temel, t0);
    osc.frequency.linearRampToValueAtTime(temel * 0.82, t0 + 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.22, t0 + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.7);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    osc.connect(lp).connect(g).connect(cikis);
    osc.start(t0);
    osc.stop(t0 + 0.75);
  }, 2600);
  return () => window.clearInterval(z);
}

function kaynakBaslat(k: SesKaynagi): CanliKaynak | null {
  const ana = mekanKazancHazirla();
  if (!ctx || !ana) return null;
  const g = ctx.createGain();
  g.gain.value = 0;
  g.connect(ana);

  let durdur: () => void;
  switch (k.tur) {
    case "su":
      durdur = gurultuDongusu(g, "bandpass", 900, 0.7, 0.23);
      break;
    case "pazar":
    case "meydan":
      durdur = gurultuDongusu(g, "bandpass", 420, 1.6, 0.55);
      break;
    case "ates":
      durdur = gurultuDongusu(g, "highpass", 1500, 0.5, 0.9);
      break;
    case "demirci":
      durdur = cekicDongusu(g);
      break;
    case "suru":
      durdur = suruDongusu(g);
      break;
    default:
      durdur = () => {};
  }
  return { kaynak: k, kazanc: g, durdur };
}

/** Sahnedeki ses kaynaklarını tanımlar (dünya koordinatında) */
export function mekanSesleriKur(kaynaklar: SesKaynagi[]): void {
  if (!ctx) return;
  for (const [id, c] of canliKaynaklar) {
    if (!kaynaklar.some((k) => k.id === id)) {
      c.durdur();
      try { c.kazanc.disconnect(); } catch { /* yoksay */ }
      canliKaynaklar.delete(id);
    }
  }
  for (const k of kaynaklar) {
    if (canliKaynaklar.has(k.id)) continue;
    const c = kaynakBaslat(k);
    if (c) canliKaynaklar.set(k.id, c);
  }
}

/**
 * Oyuncunun konumuna göre tüm kaynakların ses düzeyini günceller.
 * Yaklaştıkça artar, uzaklaştıkça yumuşakça kapanır.
 */
export function sesKonumGuncelle(x: number, z: number): void {
  if (!ctx || sessiz) {
    for (const c of canliKaynaklar.values()) {
      c.kazanc.gain.setTargetAtTime(0, ctx?.currentTime ?? 0, 0.3);
    }
    return;
  }
  for (const c of canliKaynaklar.values()) {
    const k = c.kaynak;
    const d = Math.hypot(x - k.x, z - k.z);
    const oran = Math.max(0, 1 - d / k.menzil);
    // kare eğri: uzakta hızla düşer, yakında dolgun
    const hedef = oran * oran * k.guc;
    c.kazanc.gain.setTargetAtTime(hedef, ctx.currentTime, 0.35);
  }
}

export function mekanSesleriKapat(): void {
  for (const c of canliKaynaklar.values()) {
    c.durdur();
    try { c.kazanc.disconnect(); } catch { /* yoksay */ }
  }
  canliKaynaklar.clear();
}
