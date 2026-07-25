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
  if (anaKazanc && ctx) anaKazanc.gain.setTargetAtTime(deger ? 0 : 1, ctx.currentTime, 0.05);
  if (aktifAnlati) aktifAnlati.muted = deger;
}

export function sessizMi(): boolean {
  return sessiz;
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
    const geriAc = () => {
      if (ambiyansKazanc && ctx) ambiyansKazanc.gain.setTargetAtTime(0.5, ctx.currentTime, 0.4);
    };
    s.onend = geriAc;
    s.onerror = geriAc;
    window.speechSynthesis.speak(s);
    return true;
  } catch {
    return false;
  }
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
    };
    const geriYukselt = () => {
      if (ambiyansKazanc && ctx) ambiyansKazanc.gain.setTargetAtTime(0.5, ctx.currentTime, 0.4);
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
