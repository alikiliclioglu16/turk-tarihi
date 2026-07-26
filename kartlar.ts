/**
 * D01 — Meraklı Gözler
 *
 * Ana turun dışında bulunan küçük keşif noktalarıdır.
 * Her kayıt en fazla üç kısa cümle kullanır.
 * Tarihsel iddia içeren kayıtlarda kaynak notu bulunur.
 */

export type BonusKesif = {
  id: string;
  ad: string;
  pos: [number, number, number];
  metin: string;
  kaynakNotu: string | null;
};

export const balbalSirtiBonusKesifler: BonusKesif[] = [
  {
    id: "bk_balbal_01_golge",
    ad: "Uzayan Gölge",
    pos: [-46.5, 7.2, 52.8],
    metin: "Taşın gölgesi yüz çizgilerini belirginleştiriyor. Işık değişince gördüklerin de değişebilir mi?",
    kaynakNotu: null,
  },
  {
    id: "bk_balbal_02_catlak",
    ad: "İnce Çatlak",
    pos: [-50.6, 7.5, 57.4],
    metin: "Küçük çatlaklar zamanla genişleyebilir. Bir ayrıntının kaybolması yorumlarımızı nasıl etkiler?",
    kaynakNotu: "U.S. National Park Service, What Forces Change Archeological Sites?: https://www.nps.gov/articles/000/what-forces-change-archeological-sites.htm",
  },
  {
    id: "bk_balbal_03_kap_sekli",
    ad: "Kap Benzeri Şekil",
    pos: [-47.7, 7.7, 53.9],
    metin: "Eldeki şekil bir kaba benziyor. Benzerlik görmek, kullanımını kesin bilmek midir?",
    kaynakNotu: null,
  },
  {
    id: "bk_balbal_04_devirmis_tas",
    ad: "Devrilmiş Taş",
    pos: [-40.0, 7.1, 58.4],
    metin: "Bu taş bugün yatay duruyor. İlk konumunu yalnız bugünkü görünüşten kesinleştiremeyiz.",
    kaynakNotu: "U.S. National Park Service, What Is Archeological Context?: https://www.nps.gov/articles/000/what-is-archeological-context.htm",
  },
  {
    id: "bk_balbal_05_tas_araligi",
    ad: "Taşların Arası",
    pos: [-53.8, 7.4, 47.5],
    metin: "Taşların aralıkları aynı görünmüyor. Dizilişin anlamı için çevredeki ilişkiler de incelenmelidir.",
    kaynakNotu: "U.S. National Park Service, What Is Archeological Context?: https://www.nps.gov/articles/000/what-is-archeological-context.htm",
  },
  {
    id: "bk_balbal_06_ruzgara_bakan_yuz",
    ad: "Rüzgâra Bakan Yüz",
    pos: [-58.0, 9.2, 61.0],
    metin: "Bir yüzey diğerinden daha aşınmış. Rüzgâr ve temas bu farkı büyütmüş olabilir.",
    kaynakNotu: "U.S. National Park Service, What Forces Change Archeological Sites?: https://www.nps.gov/articles/000/what-forces-change-archeological-sites.htm",
  },
  {
    id: "bk_balbal_07_uzak_izler",
    ad: "Uzak İzler",
    pos: [-61.0, 10.8, 65.0],
    metin: "Sırtın ötesinde başka taş izleri görünüyor. Tek nesne yerine bütün peyzaja bakmak ne değiştirir?",
    kaynakNotu: "UNESCO World Heritage Centre, Orkhon Valley Cultural Landscape: https://whc.unesco.org/en/list/1081/",
  },
  {
    id: "bk_balbal_08_silinmis_cizgi",
    ad: "Silinmiş Çizgi",
    pos: [-67.7, 12.3, 71.6],
    metin: "Bazı çizgiler başlıyor, sonra kayboluyor. Eksik bölümü istediğimiz öyküyle tamamlamak doğru olmaz.",
    kaynakNotu: "U.S. National Park Service, What Is Archeological Context?: https://www.nps.gov/articles/000/what-is-archeological-context.htm",
  }
];

export const suBasiBonusKesifler: BonusKesif[] = [
  {
    id: "bk_su_01_sesin_yonu",
    ad: "Suyun Yönü",
    pos: [48.0, -1.8, 29.0],
    metin: "Su görünmeden önce sesi duyuluyor. Ses, çevrede yön bulmaya nasıl yardım edebilir?",
    kaynakNotu: null,
  },
  {
    id: "bk_su_02_yuksek_zemin",
    ad: "Kuru Düzlük",
    pos: [53.0, -0.9, 27.0],
    metin: "Bu küçük düzlük dere yatağından yüksekte. Kamp kurarken bu fark neden önemlidir?",
    kaynakNotu: null,
  },
  {
    id: "bk_su_03_nemli_toprak",
    ad: "Koyu Toprak",
    pos: [57.2, -1.7, 35.6],
    metin: "Koyu toprak daha nemli görünüyor. Geçmiş su seviyesini yalnız renkten kesinleştirebilir miyiz?",
    kaynakNotu: null,
  },
  {
    id: "bk_su_04_sogut_dali",
    ad: "Eğilen Dal",
    pos: [50.2, -0.5, 36.4],
    metin: "Söğüt dalları suya doğru eğiliyor. Bitkiler çevrenin hangi özelliklerini düşündürebilir?",
    kaynakNotu: null,
  },
  {
    id: "bk_su_05_at_izleri",
    ad: "Çamurdaki İz",
    pos: [62.0, -0.8, 23.0],
    metin: "İzler su kenarından patikaya yöneliyor. Hayvanın bütün yolculuğunu bu izlerden bilemeyiz.",
    kaynakNotu: null,
  },
  {
    id: "bk_su_06_otlak",
    ad: "Yeşil Otlak",
    pos: [69.0, -0.1, 9.0],
    metin: "Bu alanda otlar daha sık görünüyor. Su ve otlak, hareket kararlarını birlikte etkileyebilir.",
    kaynakNotu: "UNESCO World Heritage Centre, Orkhon Valley Cultural Landscape: https://whc.unesco.org/en/list/1081/",
  },
  {
    id: "bk_su_07_patika_catali",
    ad: "İki Patika",
    pos: [78.5, 0.1, 5.5],
    metin: "Patika burada iki yöne ayrılıyor. Bir rota seçmek için başka hangi ipuçları gerekir?",
    kaynakNotu: null,
  },
  {
    id: "bk_su_08_sessiz_havuz",
    ad: "Durgun Su",
    pos: [59.5, -1.5, 31.0],
    metin: "Bu küçük bölüm diğer yerlerden daha durgun. Aynı dere içinde koşullar nasıl değişebilir?",
    kaynakNotu: null,
  }
];

export const eskiYurtBonusKesifler: BonusKesif[] = [
  {
    id: "bk_yurt_01_yari_gomulu",
    ad: "Yerinde Kalan Kap",
    pos: [-35.5, -0.7, -63.5],
    metin: "Kabın çevresindeki toprak önemli bilgiler taşıyabilir. Onu kaldırmak bu ilişkileri bozabilir.",
    kaynakNotu: "U.S. National Park Service, Archaeology in Big Bend: https://www.nps.gov/bibe/learn/historyculture/archaeology-in-big-bend.htm",
  },
  {
    id: "bk_yurt_02_parca_dagilimi",
    ad: "Dağınık Parçalar",
    pos: [-31.0, -0.7, -60.0],
    metin: "Parçalar aynı noktada toplanmamış. Dağılımları, geçmiş kullanımı araştırırken neden önemlidir?",
    kaynakNotu: "U.S. National Park Service, What Is Archeological Context?: https://www.nps.gov/articles/000/what-is-archeological-context.htm",
  },
  {
    id: "bk_yurt_03_kul_rengi",
    ad: "Kül Lekesi",
    pos: [-27.0, -0.7, -65.5],
    metin: "Taşların ortasında koyu bir leke var. Bu iz, tek başına kesin tarih söylemez.",
    kaynakNotu: "U.S. National Park Service, What Is Archeological Context?: https://www.nps.gov/articles/000/what-is-archeological-context.htm",
  },
  {
    id: "bk_yurt_04_direk_izi",
    ad: "Eğilen Direk",
    pos: [-38.5, 0.1, -56.0],
    metin: "Ahşap direk eğilmiş ve yüzeyi parçalanmış. Zaman, aynı yapının görünüşünü sürekli değiştirebilir.",
    kaynakNotu: "U.S. National Park Service, What Forces Change Archeological Sites?: https://www.nps.gov/articles/000/what-forces-change-archeological-sites.htm",
  },
  {
    id: "bk_yurt_05_solmus_desen",
    ad: "Solmuş Desen",
    pos: [-58.0, 0.1, -69.5],
    metin: "Kilimde bazı renkler daha zor seçiliyor. Malzeme değişirken bir uygulama sürebilir mi?",
    kaynakNotu: null,
  },
  {
    id: "bk_yurt_06_otlu_patika",
    ad: "Kapanan Yol",
    pos: [-65.5, 0.0, -74.5],
    metin: "Otlar patikanın bir bölümünü kapatmış. Kullanılmayan yollar zamanla nasıl görünmezleşir?",
    kaynakNotu: null,
  },
  {
    id: "bk_yurt_07_uzaklik",
    ad: "İzler Arasındaki Mesafe",
    pos: [-50.0, -0.2, -68.0],
    metin: "Ocakla yapı izi arasında belirgin bir mesafe var. Konum ilişkileri yorumlarımızı nasıl değiştirebilir?",
    kaynakNotu: "U.S. National Park Service, What Is Archeological Context?: https://www.nps.gov/articles/000/what-is-archeological-context.htm",
  },
  {
    id: "bk_yurt_08_uc_soru",
    ad: "Üç Bilgi Düzeyi",
    pos: [3.0, 2.1, -89.0],
    metin: "Bazı izleri biliyor, bazılarını yalnız tahmin ediyoruz. Bazı sorular ise şimdilik cevapsız kalır.",
    kaynakNotu: "U.S. National Park Service, What Is Archeological Context?: https://www.nps.gov/articles/000/what-is-archeological-context.htm",
  }
];


/**
 * OBA — mevcut kayıtlar korunmuştur.
 * ChatGPT paketi üç yeni bölgeyi kapsıyordu; Oba'nınkiler burada duruyor.
 */
export const obaBonusKesifler: BonusKesif[] = [
  {
    id: "bk_tug",
    ad: "Tuğ Direği",
    pos: [-1.2, 2.6, -8.5],
    metin: "Obanın ortasındaki bu direk uzaktan görünür. Bir yere ait olmanın işaretidir.",
    kaynakNotu: null,
  },
  {
    id: "bk_tezgah",
    ad: "Dokuma Tezgâhı",
    pos: [-8.5, 1.4, 8.5],
    metin: "Tezgâhtaki ipler sıra sıra ilerliyor. Yapım süresi, ölçüye ve tekniğe göre değişebilir.",
    kaynakNotu: "The Metropolitan Museum of Art, Spindle Whorl, 9th–10th century, Object 38.40.1, https://www.metmuseum.org/art/collection/search/449217; British Museum, Central Asian plain-weave textile, 8th–9th century, Museum no. 1907,1111.216, https://www.britishmuseum.org/collection/object/A_1907-1111-216",
  },
  {
    id: "bk_kagni",
    ad: "Yüklü Kağnı",
    pos: [-9.5, 1.1, -6.5],
    metin: "Araba yüklü duruyor. Yükün ne zaman ve nereye taşınacağını bilmiyoruz.",
    kaynakNotu: "Kağnı tipi ve tekerlek yapısı için dönemsel örnek bulunamadı; biçim temsilîdir.",
  },
  {
    id: "bk_agil",
    ad: "Ağıl",
    pos: [14.5, 1.2, -4.5],
    metin: "Hayvanlar gece ağıla alınır. Bir obanın zenginliği sürüsünde ölçülürdü.",
    kaynakNotu: null,
  },
  {
    id: "bk_odun",
    ad: "Odun Yığını",
    pos: [3.5, 0.7, -6.2],
    metin: "Odun düzgün istiflenmiş. Ateşin sönmemesi bir kişinin değil, herkesin işiydi.",
    kaynakNotu: null,
  },
  {
    id: "bk_kurutma",
    ad: "Kurutma Sehpası",
    pos: [7.5, 1.3, -2.5],
    metin: "Et ve deri burada kurutulur. Kışa hazırlık yazdan başlar.",
    kaynakNotu: null,
  },
  {
    id: "bk_tulum",
    ad: "Su Tulumu",
    pos: [9.5, 1.1, 8.5],
    metin: "Su tulumda taşınır ve gölgede asılı tutulur. Suyu bulmak kadar korumak da bilgi ister.",
    kaynakNotu: null,
  },
  {
    id: "bk_mizrak",
    ad: "Mızrak Rafı",
    pos: [-4.5, 1.9, -7.4],
    metin: "Bunlar burada asılı duruyor, kimse taşımıyor. Bir obanın hikâyesi savaşlardan ibaret değildir.",
    kaynakNotu: null,
  },
];

export const bonusKesifler: BonusKesif[] = [
  ...obaBonusKesifler,
  ...balbalSirtiBonusKesifler,
  ...suBasiBonusKesifler,
  ...eskiYurtBonusKesifler,
];

export const bonusKesiflerByZone = {
  oba: obaBonusKesifler,
  balbal_sirti: balbalSirtiBonusKesifler,
  su_basi: suBasiBonusKesifler,
  eski_yurt: eskiYurtBonusKesifler,
} as const;

export function bonusKesifBul(id: string): BonusKesif | null {
  return bonusKesifler.find((kayit) => kayit.id === id) ?? null;
}

export const BONUS_TOPLAM = bonusKesifler.length;
