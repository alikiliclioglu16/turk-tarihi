"use client";

import { create } from "zustand";
import type { TourNode, RewardCard } from "./types";
import { input } from "./input";
import { ilerlemeYukle, ilerlemeKaydet, olayKaydet } from "./progress";
import { DUNYA_OLCEK } from "./dunyaOlcek";
import { kesifKartiYap, type KesifKarti } from "./kartlar";

/** Öğrenme noktası türlerinin ekranda görünen adı */
const TIP_ETIKET: Record<string, string> = {
  zanaat: "Zanaat", kultur: "Kültür", yasam: "Günlük Hayat",
  yapi: "Yapı", doga: "Doğa", tarih: "Tarih",
};

/**
 * JSON koordinatları tasarım ölçeğinde yazıldı. Dünya 2.6 katına
 * çıkarıldığı için yükleme anında ölçeklenir. JSON dosyalarına dokunulmaz.
 */
function nodOlcekle(n: TourNode): TourNode {
  const k = DUNYA_OLCEK;
  const w3 = (n as TourNode & { world3d?: { guidePosition: [number,number,number]; triggerRadius: number; hotspotPositions?: Record<string,[number,number,number]> } }).world3d;
  const kaynak = w3 ?? n.world;
  const hs = w3?.hotspotPositions;
  return {
    ...n,
    world: {
      guidePosition: [kaynak.guidePosition[0]*k, kaynak.guidePosition[1]*k, kaynak.guidePosition[2]*k],
      triggerRadius: Math.max(3.5, kaynak.triggerRadius * k * 0.62),
      cameraFocus: n.world.cameraFocus,
    },
    hotspots: n.hotspots.map((h) => {
      const p = hs?.[h.id] ?? h.position;
      return { ...h, position: [p[0]*k, p[1]*k, p[2]*k] as [number,number,number] };
    }),
  };
}

export type Faz =
  | "yukleniyor"
  | "acilis"     // kuşbakışı tanıtım uçuşu
  | "gezinti"    // oyuncu serbest yürüyor, hedefe gidiyor
  | "anlati"     // Dede Korkut konuşuyor
  | "kesif"      // hotspotlar açık
  | "gorev"      // görev paneli
  | "odul"       // kart kazanıldı
  | "kapanis"    // durak kapanış repliği
  | "sinav"      // final değerlendirmesi
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
  tamamlananNodIndexleri: number[];
  bulunanBonuslar: string[];
  aktifBonusId: string | null;
  kisiBilgi: { id: string; ad: string; metin: string } | null;
  aktifKesifKarti: KesifKarti | null;
  kesifKoleksiyonu: KesifKarti[];

  nodlariYukle: (n: TourNode[]) => void;
  duragiBaslat: () => void;
  duragaGir: (index: number) => void;
  sinaviBitir: () => void;
  sonrakiAnlati: () => void;
  hotspotAc: (id: string) => void;
  hotspotKapat: () => void;
  goreveGec: () => void;
  cevapVer: (secenekId: string) => void;
  cokluCevapVer: (secenekId: string) => void;
  /** Sütunlu ve sıralamalı görevler kendi mantığını yürütür; bitince bunu çağırır */
  gorevTamamlandi: () => void;
  yanlisDeneme: () => void;
  bonusBul: (id: string) => void;
  bonusKapat: () => void;
  kisiBilgiAc: (id: string, ad: string, metin: string) => void;
  kisiBilgiKapat: () => void;
  kesifKartiKapat: () => void;
  acilisBitti: () => void;
  acilisAtla: () => void;
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
  tamamlananNodIndexleri: [],
  bulunanBonuslar: [],
  aktifBonusId: null,
  kisiBilgi: null,
  aktifKesifKarti: null,
  kesifKoleksiyonu: [],

  nodlariYukle: (hamNodlar) => {
    const nodlar = hamNodlar.map(nodOlcekle);
    const kayit = ilerlemeYukle();
    const tamam = kayit.tamamlananNodlar;
    // kaldığı yerden devam
    let index = 0;
    while (index < nodlar.length && tamam.includes(nodlar[index].nodeId)) index++;
    if (index >= nodlar.length) index = nodlar.length - 1;
    const ilkKez = kayit.tamamlananNodlar.length === 0;
    input.kilitli = ilkKez;
    set({
      nodlar,
      aktifIndex: index,
      faz: ilkKez ? "acilis" : "gezinti",
      anlatiIndex: 0,
      gezilenHotspotlar: [],
      kazanilanKartlar: [],
    });
  },

  /** Yakınına gelinen durağı başlatır — sıra şartı yok */
  duragaGir: (index: number) => {
    const { faz, tamamlananNodIndexleri } = get();
    if (faz !== "gezinti") return;
    if (tamamlananNodIndexleri.includes(index)) return;
    input.kilitli = false;
    olayKaydet("durak_baslatildi", { index });
    set({
      aktifIndex: index,
      faz: "anlati",
      anlatiIndex: 0,
      gezilenHotspotlar: [],
      denemeSayisi: 0,
    });
  },

  duragiBaslat: () => {
    const { faz } = get();
    if (faz !== "gezinti") return;
    // Anlatı sırasında hareket serbest — sahne durmaz, hayat akar.
    input.kilitli = false;
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
    const { gezilenHotspotlar, nodlar, aktifIndex, kesifKoleksiyonu } = get();
    const nod = nodlar[aktifIndex];
    const h = nod?.hotspots.find((x) => x.id === id);
    const kart = h
      ? kesifKartiYap(`${nod.nodeId}_${h.id}`, h.label, nod.title, h.text, "hotspot")
      : null;
    set({
      aktifHotspotId: id,
      aktifKesifKarti: kart,
      kesifKoleksiyonu:
        kart && !kesifKoleksiyonu.some((k) => k.id === kart.id)
          ? [...kesifKoleksiyonu, kart]
          : kesifKoleksiyonu,
      gezilenHotspotlar: gezilenHotspotlar.includes(id)
        ? gezilenHotspotlar
        : [...gezilenHotspotlar, id],
    });
  },

  kesifKartiKapat: () => set({ aktifKesifKarti: null, aktifHotspotId: null }),

  hotspotKapat: () => set({ aktifHotspotId: null }),

  goreveGec: () => {
    // yalnız görev panelinde hareket kilitlenir
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
    type BonusBilgi = { ad: string; metin: string; kaynakNotu?: string | null; tip?: string };
    const bk = (globalThis as { __bonusMetin?: (id: string) => BonusBilgi | null }).__bonusMetin?.(id);
    const kesifKoleksiyon = get().kesifKoleksiyonu;
    const kart = bk
      ? kesifKartiYap(
          id, bk.ad,
          bk.tip ? TIP_ETIKET[bk.tip] ?? "Keşif" : "Meraklı Gözler",
          bk.metin,
          bk.tip ? "ogrenme" : "bonus",
          null,
          bk.kaynakNotu ?? null
        )
      : null;
    set({
      bulunanBonuslar: yeni,
      aktifBonusId: id,
      aktifKesifKarti: kart,
      kesifKoleksiyonu:
        kart && !kesifKoleksiyon.some((k) => k.id === kart.id)
          ? [...kesifKoleksiyon, kart]
          : kesifKoleksiyon,
    });
  },

  bonusKapat: () => set({ aktifBonusId: null }),

  sinaviBitir: () => set({ faz: "bolumBitti" }),

  kisiBilgiAc: (id, ad, metin) => set({ kisiBilgi: { id, ad, metin } }),
  kisiBilgiKapat: () => set({ kisiBilgi: null }),

  acilisBitti: () => {
    input.kilitli = false;
    set({ faz: "gezinti" });
  },
  acilisAtla: () => {
    input.kilitli = false;
    set({ faz: "gezinti" });
  },

  gorevTamamlandi: () => {
    const { nodlar, aktifIndex, kazanilanKartlar } = get();
    const nod = nodlar[aktifIndex];
    if (!nod) return;
    const kayit = ilerlemeYukle();
    olayKaydet("gorev_tamamlandi", { node: nod.nodeId, tip: nod.quest.type });
    ilerlemeKaydet({ ...kayit, kartlar: [...new Set([...kayit.kartlar, nod.reward.cardId])] });
    input.kilitli = false;
    set({
      faz: "odul",
      sonGeriBildirim: nod.quest.successFeedback,
      ipucu: null,
      kazanilanKartlar: kazanilanKartlar.some((k) => k.cardId === nod.reward.cardId)
        ? kazanilanKartlar
        : [...kazanilanKartlar, nod.reward],
    });
  },

  /** Yanlış yerleştirme veya yanlış sıra — ipucu sayacını ilerletir */
  yanlisDeneme: () => {
    const { denemeSayisi, nodlar, aktifIndex } = get();
    const yeni = denemeSayisi + 1;
    const nod = nodlar[aktifIndex];
    const ipucuKaydi = nod?.quest.hints
      .filter((h) => h.afterAttempt <= yeni)
      .sort((a, b) => b.afterAttempt - a.afterAttempt)[0];
    set({ denemeSayisi: yeni, ipucu: ipucuKaydi?.text ?? null });
  },

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
    const { nodlar, aktifIndex, tamamlananNodIndexleri } = get();
    const yeniTamam = tamamlananNodIndexleri.includes(aktifIndex)
      ? tamamlananNodIndexleri
      : [...tamamlananNodIndexleri, aktifIndex];
    input.kilitli = false;

    // Serbest tur: sıradaki durağa zorlanmaz, gezintiye dönülür.
    // Hepsi bitince final sınavı açılır.
    if (yeniTamam.length >= nodlar.length) {
      set({ tamamlananNodIndexleri: yeniTamam, faz: "sinav" });
    } else {
      set({
        tamamlananNodIndexleri: yeniTamam,
        faz: "gezinti",
        anlatiIndex: 0,
        gezilenHotspotlar: [],
        sonGeriBildirim: null,
        ipucu: null,
      });
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
