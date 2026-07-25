/**
 * KADEMELİ YÜKLEME YÖNETİCİSİ
 *
 * Sorun: sahne açılırken 688 çarpıştırıcı, 68 bin arazi köşesi, 320 çadır
 * ve 2600 ot matrisi TEK KAREDE hesaplanıyordu. Tarayıcı saniyelerce
 * kilitleniyordu.
 *
 * Çözüm: iş parçalara bölünür ve kareler arasında dağıtılır. Her karede
 * yalnız belirli bir süre kadar çalışılır; tarayıcı arada nefes alır.
 * İlerleme yükleme ekranına bildirilir.
 */

export interface Gorev {
  ad: string;
  /** toplam adım sayısı */
  adim: number;
  /** tek bir adımı çalıştırır */
  calistir: (i: number) => void;
}

type Dinleyici = (ilerleme: number, ad: string) => void;

const dinleyiciler = new Set<Dinleyici>();
let toplamIlerleme = 0;
let aktifAd = "Hazırlanıyor";

export function yuklemeDinle(f: Dinleyici): () => void {
  dinleyiciler.add(f);
  f(toplamIlerleme, aktifAd);
  return () => dinleyiciler.delete(f);
}

function bildir(oran: number, ad: string) {
  toplamIlerleme = oran;
  aktifAd = ad;
  dinleyiciler.forEach((d) => d(oran, ad));
}

/** Bir kare içinde en fazla bu kadar milisaniye çalışılır */
const KARE_BUTCESI = 9;

/**
 * Görevleri karelere yayarak çalıştırır.
 * Her kare KARE_BUTCESI kadar iş yapar, sonra tarayıcıya kontrolü bırakır.
 */
export async function kademeliCalistir(gorevler: Gorev[]): Promise<void> {
  const toplamAdim = gorevler.reduce((t, g) => t + g.adim, 0);
  let yapilan = 0;

  for (const g of gorevler) {
    let i = 0;
    while (i < g.adim) {
      const baslangic = performance.now();
      while (i < g.adim && performance.now() - baslangic < KARE_BUTCESI) {
        g.calistir(i);
        i++;
        yapilan++;
      }
      bildir(yapilan / toplamAdim, g.ad);
      // tarayıcıya nefes ver
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
    }
  }
  bildir(1, "Hazır");
}

export function yuklemeSifirla(): void {
  toplamIlerleme = 0;
  aktifAd = "Hazırlanıyor";
}
