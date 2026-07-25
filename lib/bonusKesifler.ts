/**
 * MERAKLI GÖZLER — zorunlu olmayan keşifler
 *
 * Ana tur 10 duraktan oluşur. Bunlar onun dışında, obayı gezerken
 * bulunabilecek küçük keşiflerdir: kısa bilgi verir, koleksiyona eklenir,
 * ilerlemeyi engellemez. Çocuğun "etrafa bakma" davranışını ödüllendirir.
 *
 * Her metin tarihsel iddia içeriyorsa kaynakNotu doldurulmalıdır.
 */

export interface BonusKesif {
  id: string;
  ad: string;
  pos: [number, number, number];
  metin: string;
  kaynakNotu: string | null;
}

export const BONUS_KESIFLER: BonusKesif[] = [
  {
    id: "bk_tug",
    ad: "Tuğ Direği",
    pos: [-1.2, 2.6, -8.5],
    metin:
      "Obanın ortasındaki bu direk uzaktan görünür. Bir yere ait olmanın işaretidir. İnsanlar döndüklerinde önce onu ararlar.",
    kaynakNotu: null,
  },
  {
    id: "bk_tezgah",
    ad: "Dokuma Tezgâhı",
    pos: [-8.5, 1.4, 8.5],
    metin:
      "Bir kilim günlerce dokunur. Her sıra bir gün, her desen bir dilek olabilir. Dokuyanın adı yazmaz ama emeği kalır.",
    kaynakNotu: "DOĞRULANMALI — dokuma tezgâhı biçimi dönem ve bölgeye göre değişir.",
  },
  {
    id: "bk_kagni",
    ad: "Yüklü Kağnı",
    pos: [-9.5, 1.1, -6.5],
    metin:
      "Bu araba yüklü duruyor. Demek ki yakında yola çıkılacak. Göç, bir günde karar verilen bir iş değildir.",
    kaynakNotu: "DOĞRULANMALI — kağnı tipi ve tekerlek yapısı kaynakla eşleştirilmeli.",
  },
  {
    id: "bk_agil",
    ad: "Ağıl",
    pos: [14.5, 1.2, -4.5],
    metin:
      "Hayvanlar gece ağıla alınır. Bir obanın zenginliği tarlada değil, sürüsünde ölçülürdü.",
    kaynakNotu: null,
  },
  {
    id: "bk_odun",
    ad: "Odun Yığını",
    pos: [3.5, 0.7, -6.2],
    metin:
      "Odun düzgün istiflenmiş. Ateşin sönmemesi bir kişinin değil, herkesin işiydi.",
    kaynakNotu: null,
  },
  {
    id: "bk_kurutma",
    ad: "Kurutma Sehpası",
    pos: [7.5, 1.3, -2.5],
    metin:
      "Et ve deri burada kurutulur. Kışa hazırlık yazdan başlar. Geçmişte hiçbir şey son ana bırakılmazdı.",
    kaynakNotu: null,
  },
  {
    id: "bk_tulum",
    ad: "Su Tulumu",
    pos: [9.5, 1.1, 8.5],
    metin:
      "Su, tulumda taşınır ve gölgede asılı tutulur. Suyu bulmak kadar korumak da bilgi ister.",
    kaynakNotu: null,
  },
  {
    id: "bk_mizrak",
    ad: "Mızrak Rafı",
    pos: [-4.5, 1.9, -7.4],
    metin:
      "Bunlar burada asılı duruyor, kimse taşımıyor. Bir obanın hikâyesi yalnız savaşlardan ibaret değildir.",
    kaynakNotu: null,
  },
];

export const BONUS_TOPLAM = BONUS_KESIFLER.length;
