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
  | "idle" | "walk" | "run" | "talk" | "sit" | "jump" | "axe"
  | "work_hammer" | "work_ground" | "work_pull"
  | "shoot_bow" | "dance" | "wrestle" | "sword_practice"
  | "ride_idle" | "ride_walk";

/** Aranan anahtar kelimeler — sıra önemli, ilk eşleşen kazanır */
const ESLEME: [OyunKlibi, string[]][] = [
  ["ride_walk",      ["ride_walk", "horse_walk", "riding_walk", "mounted_walk"]],
  ["ride_idle",      ["ride_idle", "horse_idle", "riding_idle", "mounted_idle"]],
  // "Attack" ölçülü kesme hareketi — talim için uygun.
  // "Sword_Shout", "Spartan_Kick", "Uppercut", "Taunt" gibi abartılı
  // savaş hareketleri BİLİNÇLİ olarak eşlenmiyor: proje ilkesi gereği
  // şiddet yüceltilmiyor, sahne talim olarak kurgulanıyor.
  ["sword_practice", ["attack", "sword_stance", "sword", "fencing", "saber", "blade"]],
  // Askerde iki okçuluk klibi var: "Aim_with_Lateral_Scan" döngülü nişan
  // (talim için doğru), "Shot" tek atış. Nişan klibi öncelikli.
  ["shoot_bow",      ["archery_aim", "archery", "bow", "archer", "arrow", "shoot"]],
  ["axe",            ["axe_stance", "axe_spin"]],
  ["work_hammer",    ["hammer", "blacksmith", "forge", "anvil", "swing"]],
  ["work_ground",    ["pick", "kneel", "crouch", "gather", "ground"]],
  ["work_pull",      ["pull", "rope", "drag", "weav", "radish"]],
  ["wrestle",        ["combat_stance", "wrestl", "grapple", "fight_stance", "combat_idle"]],
  ["dance",          ["dance", "dancing"]],
  ["jump",           ["jump", "leap", "hop"]],
  ["run",            ["run", "jog", "sprint"]],
  ["walk",           ["walk"]],
  ["sit",            ["sit"]],
  ["talk",           ["talk", "greet", "wave", "converse"]],
  ["idle",           ["idle", "breath", "stand", "look_around", "dumbfounded"]],
];

/**
 * TERCİHLİ EŞLEME
 *
 * Anahtar kelime araması bazen yanlış klibi seçiyor. Örnek:
 * "Axe_Breathe_and_Look_Around" içinde "breath" geçtiği için `idle`
 * sanılıyor; ama asıl idle klibi "Idle_9".
 *
 * Bu tablo TAM AD eşleşmesiyle önceliği belirler; anahtar kelime
 * araması yalnız burada karşılığı olmayan klipler için çalışır.
 */
const TERCIH: Record<string, OyunKlibi> = {
  // --- asker ---
  Idle_9: "idle",
  Combat_Stance: "wrestle",                    // dönmeyen, sabit duruş
  Axe_Stance: "axe",                           // savurma değil, duruş
  Archery_Aim_with_Lateral_Scan: "shoot_bow",  // döngülü nişan
  Attack: "sword_practice",                    // ölçülü kesme
  // --- zanaatkâr ve gezgin ---
  Idle_7: "idle",
  Idle_4: "idle",
  Walking: "walk",
  Running: "run",
  Talk_Passionately: "talk",
  Talk_with_Hands_Open: "talk",
  Chair_Sit_Idle_M: "sit",
  Heavy_Hammer_Swing: "work_hammer",
  Pull_Radish: "work_pull",
};

/**
 * ÜRETİMDE KULLANILMAYACAK KLİPLER
 *
 * Proje ilkesi: şiddet yüceltilmez, sahneler talim olarak kurgulanır.
 * Bu klipler eşleşme listesinden tamamen çıkarılır.
 */
const KULLANILMAZ = [
  "chest_pound", "taunt", "uppercut", "jab", "spartan_kick",
  "shield_push", "shout", "arise",
];

/** GLB klip adını oyun klibine çevirir; eşleşme yoksa null */
export function klibiEsle(glbAdi: string): OyunKlibi | null {
  // 1) yasaklı klipler hiç eşleşmez
  const kucuk = glbAdi.toLowerCase();
  if (KULLANILMAZ.some((y) => kucuk.includes(y))) return null;
  // 2) tam ad tercihi
  if (TERCIH[glbAdi]) return TERCIH[glbAdi];
  return klibiEsleAnahtar(glbAdi);
}

/** Anahtar kelimeye göre eşleme — tercih listesinde olmayanlar için */
function klibiEsleAnahtar(glbAdi: string): OyunKlibi | null {
  const ad = glbAdi.toLowerCase();
  for (const [oyun, anahtarlar] of ESLEME) {
    if (anahtarlar.some((a) => ad.includes(a))) return oyun;
  }
  return null;
}

/**
 * Bir GLB'nin klip listesinden oyun klibi → GLB klip adı sözlüğü kurar.
 *
 * İKİ GEÇİŞLİ:
 *  1. Önce TERCİH tablosundaki tam ad eşleşmeleri işlenir
 *  2. Sonra kalan klipler anahtar kelimeyle eşlenir
 *
 * Tek geçişli olsaydı sıralama belirleyici olurdu: "Axe_Breathe_and_
 * Look_Around" alfabetik olarak "Idle_9"dan önce geldiği için `idle`
 * yuvasını kapıyordu.
 */
export function klipSozlugu(glbKlipAdlari: string[]): Partial<Record<OyunKlibi, string>> {
  const sozluk: Partial<Record<OyunKlibi, string>> = {};

  // 1. geçiş — tam ad tercihleri
  for (const ad of glbKlipAdlari) {
    const tercih = TERCIH[ad];
    if (tercih && !sozluk[tercih]) sozluk[tercih] = ad;
  }

  // 2. geçiş — anahtar kelime
  for (const ad of glbKlipAdlari) {
    const kucuk = ad.toLowerCase();
    if (KULLANILMAZ.some((y) => kucuk.includes(y))) continue;
    if (TERCIH[ad]) continue;
    const oyun = klibiEsleAnahtar(ad);
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
  jump: ["run", "idle"],   // engel atlama klibi çocuklarda kullanılmıyor
  axe: ["sword_practice", "work_hammer", "idle"],
  work_hammer: ["work_pull", "talk", "idle"],
  work_ground: ["work_pull", "work_hammer", "sit", "idle"],
  work_pull: ["work_hammer", "talk", "idle"],
  shoot_bow: ["work_pull", "work_hammer", "idle"],
  dance: ["talk", "idle"],
  wrestle: ["sword_practice", "work_hammer", "idle"],
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
