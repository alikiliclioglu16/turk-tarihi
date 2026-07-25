/**
 * Yerel ilerleme kaydı.
 * Faz 0'da hesap yok, kişisel veri yok — yalnız cihazda anonim ilerleme.
 * Supabase katmanı Paket 6'da bunun arkasına takılacak; arayüz değişmeyecek.
 */

const ANAHTAR = "dk_ilerleme_v1";

export interface Ilerleme {
  tamamlananNodlar: string[];
  kartlar: string[];
  acikDonemler: string[];
  guncelleme: number;
}

const BOS: Ilerleme = {
  tamamlananNodlar: [],
  kartlar: [],
  acikDonemler: ["d01"],
  guncelleme: 0,
};

export function ilerlemeYukle(): Ilerleme {
  if (typeof window === "undefined") return BOS;
  try {
    const ham = window.localStorage.getItem(ANAHTAR);
    if (!ham) return BOS;
    return { ...BOS, ...(JSON.parse(ham) as Partial<Ilerleme>) };
  } catch {
    return BOS;
  }
}

export function ilerlemeKaydet(veri: Ilerleme): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ANAHTAR,
      JSON.stringify({ ...veri, guncelleme: Date.now() })
    );
  } catch {
    /* kota dolu veya gizli mod — sessizce geç */
  }
}

export function ilerlemeSifirla(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ANAHTAR);
  } catch {
    /* yoksay */
  }
}

/** Anonim olay kaydı. Şimdilik yalnız konsola; Paket 6'da toplanacak. */
export function olayKaydet(ad: string, veri?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[olay]", ad, veri ?? "");
  }
}
