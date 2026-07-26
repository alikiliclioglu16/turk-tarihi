export type KulturNotu = {
  id: string;
  ad: string;
  metin: string;
  kaynakNotu: string | null;
};

export const d01KulturNotlari: KulturNotu[] = [
  {
    id: "kn_ok_01",
    ad: "Esnek Gövde",
    metin: "Farklı malzemeler bir yayda birleştirilebilirdi. Usta, eğimi dengelerken gövdeyi dikkatle sınardı.",
    kaynakNotu: "The Metropolitan Museum of Art, Nomadic Art of the Eastern Eurasian Steppes, https://www.metmuseum.org/exhibitions/listings/2002/nomadic-art",
  },
  {
    id: "kn_ok_02",
    ad: "Düz Ok",
    metin: "Ok gövdesi düzgün olmalıydı. Uç ve tüy yerleşimi uçuşu etkileyebilirdi.",
    kaynakNotu: "The Metropolitan Museum of Art, Nomadic Art of the Eastern Eurasian Steppes, https://www.metmuseum.org/exhibitions/listings/2002/nomadic-art",
  },
  {
    id: "kn_ok_03",
    ad: "Sadak Düzeni",
    metin: "Sadak, okları taşımayı kolaylaştırırdı. Deri ve ahşap ayrıntılar kullanıma göre değişebilirdi.",
    kaynakNotu: "The Metropolitan Museum of Art, Nomadic Art of the Eastern Eurasian Steppes, https://www.metmuseum.org/exhibitions/listings/2002/nomadic-art",
  },
  {
    id: "kn_kece_01",
    ad: "Yünün Dönüşümü",
    metin: "Yün, su ve baskıyla sıkıştırılınca keçe oluşur. Kalınlık, kullanım yerine göre değişebilirdi.",
    kaynakNotu: "Encyclopaedia Iranica, 'Felt', https://www.iranicaonline.org/articles/felt/",
  },
  {
    id: "kn_kece_02",
    ad: "Kalın Örtü",
    metin: "Keçe parçaları örtü ve giyside kullanılabilirdi. Kenarlar, sürtünmeye karşı sıkıca bastırılırdı.",
    kaynakNotu: "Encyclopaedia Iranica, 'Felt', https://www.iranicaonline.org/articles/felt/",
  },
  {
    id: "kn_kece_03",
    ad: "Birlikte Yuvarlamak",
    metin: "Geniş keçeler birkaç kişiyle yuvarlanabilirdi. Ritmik çalışma, yüzeyi eşit sıkıştırmaya yardım ederdi.",
    kaynakNotu: "Encyclopaedia Iranica, 'Felt', https://www.iranicaonline.org/articles/felt/",
  },
  {
    id: "kn_deri_01",
    ad: "Gerilen Yüzey",
    metin: "Deri işlenmeden önce temizlenirdi. Yağlama ve germe, yüzeyi kullanışlı kılabilirdi.",
    kaynakNotu: "Encyclopaedia Iranica, 'Central Asia x. Economy Before the Timurids', https://www.iranicaonline.org/articles/central-asia-x/",
  },
  {
    id: "kn_deri_02",
    ad: "Çanta Dikişi",
    metin: "Kuşak ve çantalar küçük eşyaları taşırdı. Dikiş izleri çalışma yöntemini gösterebilir.",
    kaynakNotu: "Encyclopaedia Iranica, 'Central Asia x. Economy Before the Timurids', https://www.iranicaonline.org/articles/central-asia-x/",
  },
  {
    id: "kn_deri_03",
    ad: "Su Tulumu",
    metin: "Su tulumunun ağzı sıkıca bağlanmalıydı. Deri yüzey, kullanım boyunca bakım isterdi.",
    kaynakNotu: "Encyclopaedia Iranica, 'Central Asia x. Economy Before the Timurids', https://www.iranicaonline.org/articles/central-asia-x/",
  },
  {
    id: "kn_comlek_01",
    ad: "Biçimlenen Kil",
    metin: "Kil, elle biçimlendirildikten sonra kurutulurdu. Pişirme, kabın dayanıklılığını artırabilirdi.",
    kaynakNotu: "British Museum, Central Asian clay vessel MAS.601, https://www.britishmuseum.org/collection/object/A_MAS-601",
  },
  {
    id: "kn_comlek_02",
    ad: "Yüzey İzleri",
    metin: "Kap yüzeyindeki izleri parmaklar bırakmış olabilir. Her çizgi mutlaka süs anlamına gelmez.",
    kaynakNotu: "British Museum, Central Asian clay vessel MAS.601, https://www.britishmuseum.org/collection/object/A_MAS-601",
  },
  {
    id: "kn_comlek_03",
    ad: "Onarılan Kap",
    metin: "Kırılan kaplar bazen onarılabilirdi. Birleşme izleri, uzun kullanımı düşündürebilir.",
    kaynakNotu: "British Museum, Central Asian clay vessel MAS.601, https://www.britishmuseum.org/collection/object/A_MAS-601",
  },
  {
    id: "kn_ahsap_01",
    ad: "Hafif Çanak",
    metin: "Ahşap çanak hafif ve taşınabilir olabilirdi. Usta, damar yönünü dikkatle izlerdi.",
    kaynakNotu: "Encyclopaedia Iranica, 'Central Asia x. Economy Before the Timurids', https://www.iranicaonline.org/articles/central-asia-x/",
  },
  {
    id: "kn_ahsap_02",
    ad: "Rahat Sap",
    metin: "Kaşığın sapı elde rahat tutulmalıydı. Küçük oyuklar işlev ve süs taşıyabilirdi.",
    kaynakNotu: "Encyclopaedia Iranica, 'Central Asia x. Economy Before the Timurids', https://www.iranicaonline.org/articles/central-asia-x/",
  },
  {
    id: "kn_ahsap_03",
    ad: "Malzemenin Sesi",
    metin: "Kuru odun farklı biçimde işlenir. Usta, malzemeyi sesinden değerlendirmiş olabilir.",
    kaynakNotu: "Encyclopaedia Iranica, 'Central Asia x. Economy Before the Timurids', https://www.iranicaonline.org/articles/central-asia-x/",
  },
  {
    id: "kn_at_01",
    ad: "Eyer Dengesi",
    metin: "Eyer, ağırlığı atın sırtına dağıtırdı. Uygun oturuş, uzun yolculuğu kolaylaştırabilirdi.",
    kaynakNotu: "The Metropolitan Museum of Art, Openwork Fitting, Central Asia, https://www.metmuseum.org/art/collection/search/65326",
  },
  {
    id: "kn_at_02",
    ad: "Koşum Bağları",
    metin: "Koşum parçaları deri ve metalden oluşabilirdi. Bağlantılar hareket sırasında yeniden kontrol edilirdi.",
    kaynakNotu: "The Metropolitan Museum of Art, Openwork Fitting, Central Asia, https://www.metmuseum.org/art/collection/search/65326",
  },
  {
    id: "kn_at_03",
    ad: "Sakin Yaklaşım",
    metin: "Atın yanında sakin çalışmak önemlidir. Ani hareketler yerine tekrar ve alışkanlık kullanılırdı.",
    kaynakNotu: "UNESCO World Heritage Centre, Orkhon Valley Cultural Landscape, https://whc.unesco.org/en/list/1081/",
  },
  {
    id: "kn_dokuma_01",
    ad: "Gerilen İpler",
    metin: "İpler gerilince desenin düzeni belirginleşir. Her sıra, önceki sıraya bağlı ilerler.",
    kaynakNotu: "Encyclopaedia Iranica, 'Central Asia x. Economy Before the Timurids', https://www.iranicaonline.org/articles/central-asia-x/",
  },
  {
    id: "kn_dokuma_02",
    ad: "Taşınan Kilim",
    metin: "Kilim taşınabilir bir eşya olabilir. Desenler ustaya ve döneme göre değişebilirdi.",
    kaynakNotu: "Encyclopaedia Iranica, 'Central Asia x. Economy Before the Timurids', https://www.iranicaonline.org/articles/central-asia-x/",
  },
  {
    id: "kn_dokuma_03",
    ad: "Doğal Renkler",
    metin: "Yün renkleri doğal boyalarla çeşitlenebilirdi. Aynı renk, farklı ışıkta değişik görünebilir.",
    kaynakNotu: "Encyclopaedia Iranica, 'Central Asia x. Economy Before the Timurids', https://www.iranicaonline.org/articles/central-asia-x/",
  },
  {
    id: "kn_demir_01",
    ad: "Kızaran Metal",
    metin: "Demir ısıtılınca biçim vermek kolaylaşır. Usta, rengi izleyerek sıcaklığı değerlendirirdi.",
    kaynakNotu: "The Metropolitan Museum of Art, Nomadic Art of the Eastern Eurasian Steppes, https://www.metmuseum.org/exhibitions/listings/2002/nomadic-art",
  },
  {
    id: "kn_demir_02",
    ad: "Küçük Bağlantılar",
    metin: "Metal parçalar kuşak ve koşumda kullanılabilirdi. İşlev, süslemeyle birlikte düşünülebilirdi.",
    kaynakNotu: "The Metropolitan Museum of Art, Nomadic Art of the Eastern Eurasian Steppes, https://www.metmuseum.org/exhibitions/listings/2002/nomadic-art",
  },
  {
    id: "kn_demir_03",
    ad: "Vuruşun İzi",
    metin: "Soğuyan metal yeniden sertleşir. Her vuruş, biçimi azar azar değiştirir.",
    kaynakNotu: "The Metropolitan Museum of Art, Nomadic Art of the Eastern Eurasian Steppes, https://www.metmuseum.org/exhibitions/listings/2002/nomadic-art",
  },
  {
    id: "kn_ocak_01",
    ad: "Ortak Ocak",
    metin: "Ocak yalnız yemek için kullanılmazdı. Isı, sohbet ve ortak çalışma burada birleşebilirdi.",
    kaynakNotu: "UNESCO, Orkhon Valley Cultural Landscape nomination dossier, https://whc.unesco.org/uploads/nominations/1081rev.pdf",
  },
  {
    id: "kn_ocak_02",
    ad: "Kazan Dengesi",
    metin: "Kazan yüksekliği ateşin gücünü etkilerdi. Sacayak, kabı köz üzerinde dengede tutardı.",
    kaynakNotu: "UNESCO, Orkhon Valley Cultural Landscape nomination dossier, https://whc.unesco.org/uploads/nominations/1081rev.pdf",
  },
  {
    id: "kn_ocak_03",
    ad: "Paylaşılan Kaplar",
    metin: "Yiyecekler paylaşılmadan önce kaplara ayrılırdı. Küçük kaplar günlük düzenin izlerini taşır.",
    kaynakNotu: "UNESCO, Orkhon Valley Cultural Landscape nomination dossier, https://whc.unesco.org/uploads/nominations/1081rev.pdf",
  },
  {
    id: "kn_sut_01",
    ad: "Sütün İşlenmesi",
    metin: "Süt kısa sürede işlenmezse bozulabilir. Peynir ve kurutulmuş ürünler saklamayı kolaylaştırırdı.",
    kaynakNotu: "UNESCO, Orkhon Valley Cultural Landscape nomination dossier, https://whc.unesco.org/uploads/nominations/1081rev.pdf",
  },
  {
    id: "kn_sut_02",
    ad: "Mayalanan Kımız",
    metin: "Kımız, kısrak sütünün mayalanmasıyla hazırlanır. Tat ve yoğunluk yönteme göre değişebilir.",
    kaynakNotu: "UNESCO, Orkhon Valley Cultural Landscape nomination dossier, https://whc.unesco.org/uploads/nominations/1081rev.pdf",
  },
  {
    id: "kn_sut_03",
    ad: "Kalan Sıvı",
    metin: "Peynir altı suyu başka işlemlerde kullanılabilirdi. Obada kaynaklar dikkatle değerlendirilirdi.",
    kaynakNotu: "UNESCO, Orkhon Valley Cultural Landscape nomination dossier, https://whc.unesco.org/uploads/nominations/1081rev.pdf",
  },
  {
    id: "kn_talim_01",
    ad: "Denge Oyunu",
    metin: "Güreş, güç kadar denge ve çeviklik ister. Karşılaşma, belirli kurallarla yürütülebilirdi.",
    kaynakNotu: "The Book of Dede Korkut, translated by Geoffrey Lewis, Penguin Classics, 1974.",
  },
  {
    id: "kn_talim_02",
    ad: "Sabırlı Eğitim",
    metin: "At eğitimi sabırlı tekrarlarla ilerlerdi. Hayvanın tepkisi, çalışmanın hızını belirlerdi.",
    kaynakNotu: "UNESCO World Heritage Centre, Orkhon Valley Cultural Landscape, https://whc.unesco.org/en/list/1081/",
  },
  {
    id: "kn_talim_03",
    ad: "Beceri Kazanmak",
    metin: "Gençler bedenlerini oyun ve talimle geliştirebilirdi. Amaç, beceri ve denge kazanmaktı.",
    kaynakNotu: "The Book of Dede Korkut, translated by Geoffrey Lewis, Penguin Classics, 1974.",
  },
  {
    id: "kn_oyun_01",
    ad: "Basit Oyuncaklar",
    metin: "Çocuklar taş, ip ve kemikle oyun kurabilirdi. Basit nesneler hayal gücüyle değişirdi.",
    kaynakNotu: "The Book of Dede Korkut, translated by Geoffrey Lewis, Penguin Classics, 1974.",
  },
  {
    id: "kn_oyun_02",
    ad: "Kopuzlu Anlatı",
    metin: "Kopuz, anlatıya ritim ve duygu katabilirdi. Dinleyenler ezgiyi sözlerle birlikte hatırlardı.",
    kaynakNotu: "The Book of Dede Korkut, translated by Geoffrey Lewis, Penguin Classics, 1974.",
  },
  {
    id: "kn_oyun_03",
    ad: "Toplu Hareket",
    metin: "Toplu hareketler müzikle uyum kazanabilirdi. Dans biçimleri topluluğa ve zamana göre değişirdi.",
    kaynakNotu: "The Book of Dede Korkut, translated by Geoffrey Lewis, Penguin Classics, 1974.",
  },
];
