"use client";

import { create } from "zustand";
import type { TourNode, RewardCard } from "./types";
import { input } from "./input";
import { ilerlemeYukle, ilerlemeKaydet, olayKaydet } from "./progress";

export type Faz =
  | "yukleniyor"
  | "gezinti"    // oyuncu serbest yürüyor, hedefe gidiyor
  | "anlati"     // Dede Korkut konuşuyor
  | "kesif"      // hotspotlar açık
  | "gorev"      // görev paneli
  | "odul"       // kart kazanıldı
  | "kapanis"    // durak kapanış repliği
  | "bolumBitti";

interface Durum {
  nodlar: TourNode[];
  aktifIndex: number;
  faz: Faz;
  anlatiIndex: number;
  gezilenHotspotlar: string[];
  aktifHotspotId: string | null;
  kazanilanKartlar: RewardCard[];
  denemeSayisi: number;
  sonGeriBildirim: string | null;
  ipucu: string | null;
  dogruSecilenler: string[];
  bulunanBonuslar: string[];
  aktifBonusId: string | null;

  nodlariYukle: (n: TourNode[]) => void;
  duragiBaslat: () => void;
  sonrakiAnlati: () => void;
  hotspotAc: (id: string) => void;
  hotspotKapat: () => void;
  goreveGec: () => void;
  cevapVer: (secenekId: string) => void;
  cokluCevapVer: (secenekId: string) => void;
  bonusBul: (id: string) => void;
  bonusKapat: () => void;
  odulAlindi: () => void;
  kapanisBitti: () => void;
  sifirla: () => void;
}

export const useOyun = create<Durum>((set, get) => ({
  nodlar: [],
  aktifIndex: 0,
  faz: "yukleniyor",
  anlatiIndex: 0,
  gezilenHotspotlar: [],
  aktifHotspotId: null,
  kazanilanKartlar: [],
  denemeSayisi: 0,
  sonGeriBildirim: null,
  ipucu: null,
  dogruSecilenler: [],
  bulunanBonuslar: [],
  aktifBonusId: null,

  nodlariYukle: (nodlar) => {
    const kayit = ilerlemeYukle();
    const tamam = kayit.tamamlananNodlar;
    // kaldığı yerden devam
    let index = 0;
    while (index < nodlar.length && tamam.includes(nodlar[index].nodeId)) index++;
    if (index >= nodlar.length) index = nodlar.length - 1;
    input.kilitli = false;
    set({
      nodlar,
      aktifIndex: index,
      faz: "gezinti",
      anlatiIndex: 0,
      gezilenHotspotlar: [],
      kazanilanKartlar: [],
    });
  },

  duragiBaslat: () => {
    const { faz } = get();
    if (faz !== "gezinti") return;
    input.kilitli = true;
    olayKaydet("durak_baslatildi", { index: get().aktifIndex });
    set({ faz: "anlati", anlatiIndex: 0, gezilenHotspotlar: [], denemeSayisi: 0 });
  },

  sonrakiAnlati: () => {
    const { nodlar, aktifIndex, anlatiIndex } = get();
    const nod = nodlar[aktifIndex];
    if (!nod) return;
    if (anlatiIndex + 1 < nod.narration.length) {
      set({ anlatiIndex: anlatiIndex + 1 });
    } else {
      input.kilitli = false; // keşif sırasında yürüyebilsin
      set({ faz: "kesif" });
    }
  },

  hotspotAc: (id) => {
    const { gezilenHotspotlar } = get();
    set({
      aktifHotspotId: id,
      gezilenHotspotlar: gezilenHotspotlar.includes(id)
        ? gezilenHotspotlar
        : [...gezilenHotspotlar, id],
    });
  },

  hotspotKapat: () => set({ aktifHotspotId: null }),

  goreveGec: () => {
    input.kilitli = true;
    set({ faz: "gorev", aktifHotspotId: null, denemeSayisi: 0, sonGeriBildirim: null, ipucu: null, dogruSecilenler: [] });
  },

  cevapVer: (secenekId) => {
    const { nodlar, aktifIndex, denemeSayisi } = get();
    const nod = nodlar[aktifIndex];
    const secenek = nod.quest.options.find((o) => o.id === secenekId);
    if (!secenek) return;

    if (secenek.correct) {
      olayKaydet("gorev_dogru", { nodeId: nod.nodeId, deneme: denemeSayisi + 1 });
      set({ faz: "odul", sonGeriBildirim: secenek.feedback, ipucu: null });
      return;
    }

    const yeniDeneme = denemeSayisi + 1;
    const ipucu = nod.quest.hints
      .filter((h) => h.afterAttempt <= yeniDeneme)
      .sort((a, b) => b.afterAttempt - a.afterAttempt)[0];
    olayKaydet("gorev_yanlis", { nodeId: nod.nodeId, deneme: yeniDeneme });
    set({
      denemeSayisi: yeniDeneme,
      sonGeriBildirim: secenek.feedback,
      ipucu: ipucu ? ipucu.text : null,
    });
  },

  bonusBul: (id) => {
    const { bulunanBonuslar } = get();
    const kayit = ilerlemeYukle();
    const yeni = bulunanBonuslar.includes(id) ? bulunanBonuslar : [...bulunanBonuslar, id];
    if (!bulunanBonuslar.includes(id)) {
      olayKaydet("bonus_kesif", { id });
      ilerlemeKaydet({ ...kayit, kartlar: kayit.kartlar });
    }
    set({ bulunanBonuslar: yeni, aktifBonusId: id });
  },

  bonusKapat: () => set({ aktifBonusId: null }),

  cokluCevapVer: (secenekId) => {
    const { nodlar, aktifIndex, denemeSayisi, dogruSecilenler } = get();
    const nod = nodlar[aktifIndex];
    const secenek = nod.quest.options.find((o) => o.id === secenekId);
    if (!secenek || dogruSecilenler.includes(secenekId)) return;

    if (secenek.correct) {
      const yeni = [...dogruSecilenler, secenekId];
      const hedef = nod.quest.options.filter((o) => o.correct).length;
      if (yeni.length >= hedef) {
        olayKaydet("gorev_dogru", { nodeId: nod.nodeId, deneme: denemeSayisi + 1 });
        set({ dogruSecilenler: yeni, faz: "odul", sonGeriBildirim: nod.quest.successFeedback, ipucu: null });
      } else {
        set({ dogruSecilenler: yeni, sonGeriBildirim: secenek.feedback, ipucu: null });
      }
      return;
    }

    const yeniDeneme = denemeSayisi + 1;
    const ipucu = nod.quest.hints
      .filter((h) => h.afterAttempt <= yeniDeneme)
      .sort((a, b) => b.afterAttempt - a.afterAttempt)[0];
    olayKaydet("gorev_yanlis", { nodeId: nod.nodeId, deneme: yeniDeneme });
    set({
      denemeSayisi: yeniDeneme,
      sonGeriBildirim: secenek.feedback,
      ipucu: ipucu ? ipucu.text : null,
    });
  },

  odulAlindi: () => {
    const { nodlar, aktifIndex, kazanilanKartlar } = get();
    const nod = nodlar[aktifIndex];
    const kart = nod.reward;
    const yeniKartlar = kazanilanKartlar.some((k) => k.cardId === kart.cardId)
      ? kazanilanKartlar
      : [...kazanilanKartlar, kart];

    const kayit = ilerlemeYukle();
    ilerlemeKaydet({
      ...kayit,
      tamamlananNodlar: kayit.tamamlananNodlar.includes(nod.nodeId)
        ? kayit.tamamlananNodlar
        : [...kayit.tamamlananNodlar, nod.nodeId],
      kartlar: kayit.kartlar.includes(kart.cardId)
        ? kayit.kartlar
        : [...kayit.kartlar, kart.cardId],
    });
    nod.completion.events.forEach((e) => olayKaydet(e));

    set({ kazanilanKartlar: yeniKartlar, faz: "kapanis" });
  },

  kapanisBitti: () => {
    const { nodlar, aktifIndex } = get();
    if (aktifIndex + 1 < nodlar.length) {
      input.kilitli = false;
      set({
        aktifIndex: aktifIndex + 1,
        faz: "gezinti",
        anlatiIndex: 0,
        gezilenHotspotlar: [],
        sonGeriBildirim: null,
        ipucu: null,
      });
    } else {
      input.kilitli = false;
      set({ faz: "bolumBitti" });
    }
  },

  sifirla: () => {
    input.kilitli = false;
    set({
      aktifIndex: 0,
      faz: "gezinti",
      anlatiIndex: 0,
      gezilenHotspotlar: [],
      kazanilanKartlar: [],
      aktifHotspotId: null,
      sonGeriBildirim: null,
      ipucu: null,
      denemeSayisi: 0,
      dogruSecilenler: [],
    });
  },
}));

/** Aktif durak — bileşenlerde kısayol */
export function aktifNod(): TourNode | null {
  const { nodlar, aktifIndex } = useOyun.getState();
  return nodlar[aktifIndex] ?? null;
}
