/**
 * KLİP EŞLEME
 *
 * Meshy kendi klip adlarını veriyor ("Walking", "Chair_Sit_Idle_M").
 * Oyun ise anlamsal adlar kullanıyor (`walk`, `sit`).
 * Bu tablo ikisini birbirine bağlar; GLB'yi yeniden adlandırmaya gerek yok.
 *
 * Eşleme büyük/küçük harf duyarsız ve kısmi eşleşme yapar:
 * "Chair_Sit_Idle_M" içinde "sit" geçtiği için `sit` klibine bağlanır.
 */

export type OyunKlibi =
  | "idle" | "walk" | "run" | "talk" | "sit" | "jump"
  | "work_hammer" | "work_ground" | "work_pull"
  | "shoot_bow" | "dance" | "wrestle" | "sword_practice"
  | "ride_idle" | "ride_walk";

/** Aranan anahtar kelimeler — sıra önemli, ilk eşleşen kazanır */
const ESLEME: [OyunKlibi, string[]][] = [
  ["ride_walk",      ["ride_walk", "horse_walk", "riding_walk", "mounted_walk"]],
  ["ride_idle",      ["ride_idle", "horse_idle", "riding_idle", "mounted_idle"]],
  ["sword_practice", ["sword", "fencing", "saber", "blade"]],
  ["shoot_bow",      ["bow", "archer", "arrow", "shoot"]],
  ["work_hammer",    ["hammer", "blacksmith", "forge", "anvil"]],
  ["work_ground",    ["pick", "kneel", "crouch", "gather", "ground"]],
  ["work_pull",      ["pull", "rope", "drag", "weav"]],
  ["wrestle",        ["wrestl", "grapple", "fight_stance", "combat_idle"]],
  ["dance",          ["dance", "dancing"]],
  ["jump",           ["jump", "leap", "hop"]],
  ["run",            ["run", "jog", "sprint"]],
  ["walk",           ["walk"]],
  ["sit",            ["sit"]],
  ["talk",           ["talk", "greet", "wave", "converse"]],
  ["idle",           ["idle", "breath", "stand"]],
];

/** GLB klip adını oyun klibine çevirir; eşleşme yoksa null */
export function klibiEsle(glbAdi: string): OyunKlibi | null {
  const ad = glbAdi.toLowerCase();
  for (const [oyun, anahtarlar] of ESLEME) {
    if (anahtarlar.some((a) => ad.includes(a))) return oyun;
  }
  return null;
}

/**
 * Bir GLB'nin klip listesinden oyun klibi → GLB klip adı sözlüğü kurar.
 * Aynı oyun klibine birden çok GLB klibi düşerse ilki kullanılır.
 */
export function klipSozlugu(glbKlipAdlari: string[]): Partial<Record<OyunKlibi, string>> {
  const sozluk: Partial<Record<OyunKlibi, string>> = {};
  for (const ad of glbKlipAdlari) {
    const oyun = klibiEsle(ad);
    if (oyun && !sozluk[oyun]) sozluk[oyun] = ad;
  }
  return sozluk;
}

/**
 * Eksik klip için yedek zinciri.
 * Örn. `jump` yoksa `run`, o da yoksa `idle` çalınır.
 */
export const YEDEK_ZINCIR: Record<OyunKlibi, OyunKlibi[]> = {
  idle: [],
  walk: ["idle"],
  run: ["walk", "idle"],
  talk: ["idle"],
  sit: ["idle"],
  jump: ["run", "idle"],
  work_hammer: ["talk", "idle"],
  work_ground: ["sit", "idle"],
  work_pull: ["talk", "idle"],
  shoot_bow: ["idle"],
  dance: ["idle"],
  wrestle: ["idle"],
  sword_practice: ["idle"],
  ride_idle: ["idle"],
  ride_walk: ["ride_idle", "idle"],
};

/** İstenen klip yoksa yedeğini bulur */
export function klipSec(
  sozluk: Partial<Record<OyunKlibi, string>>,
  istenen: OyunKlibi
): string | null {
  if (sozluk[istenen]) return sozluk[istenen]!;
  for (const yedek of YEDEK_ZINCIR[istenen]) {
    if (sozluk[yedek]) return sozluk[yedek]!;
  }
  // son çare: sözlükteki ilk klip
  const ilk = Object.values(sozluk)[0];
  return ilk ?? null;
}
