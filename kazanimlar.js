const KAZANIMLAR_DATA = {
    analiz: {
        title: "Analiz (Kalkülüs) - %36",
        kazanimlar: [
            { id: "an_1", text: "Tek Değişkenli Fonksiyonlar: Fonksiyon tanımı, türleri, ters/bileşke fonksiyonlar, trigonometrik, üstel, logaritmik fonksiyonlar ve grafikleri" },
            { id: "an_2", text: "Limit ve Süreklilik: Sağdan/soldan limit, limit kuralları, belirsizlikler (L'Hôpital), süreklilik ve düzgün süreklilik" },
            { id: "an_3", text: "Türev ve Uygulamaları: Türev alma kuralları, zincir kuralı, kapalı fonksiyon türevi, teğet/normal denklemleri, artan/azalanlık, ekstremum ve dönüm noktaları, asimptotlar" },
            { id: "an_4", text: "İntegral ve Uygulamaları: Belirsiz integral yöntemleri (değişken değiştirme, kısmi, basit kesirler), belirli integral, Riemann toplamı, alan/hacim/yay uzunluğu hesabı, has olmayan integraller" },
            { id: "an_5", text: "Çok Değişkenli Fonksiyonlar: Tanım kümesi, limit, süreklilik, kısmi ve yönlü türevler, iki ve üç katlı integraller" },
            { id: "an_6", text: "Diziler ve Seriler: Reel sayı dizileri, yakınsaklık ve monotonluk, Cauchy dizileri, serilerde yakınsaklık testleri, kuvvet, Taylor ve Maclaurin serileri" }
        ],
        theorems: [
            "Ortalama Değer Teoremi (MVT)",
            "Rolle Teoremi",
            "Bolzano / Ara Değer Teoremi (IVT)",
            "Analizin Temel Teoremi (FTC)",
            "L'Hopital Kuralı",
            "Sıkıştırma (Sandwich) Teoremi",
            "Taylor Teoremi",
            "Weierstrass Yakınsaklık Teoremi",
            "Green Teoremi",
            "Stokes Teoremi",
            "Diverjans (Gauss) Teoremi",
            "De Moivre Formülü (Karmaşık Sayılar)"
        ]
    },
    cebir: {
        title: "Cebir - %24",
        kazanimlar: [
            { id: "cb_1", text: "Sayılar Teorisi: Bölünebilme kuralları, asallık, EBOB-EKOK, Diophantine denklemleri, modüler aritmetik, kongrüanslar, Euler ve Fermat teoremleri" },
            { id: "cb_2", text: "Soyut Cebir: Kümeler, bağıntı (denklik/sıralama), grup teorisi (alt/devirli gruplar, Lagrange, simetrik gruplar), normal alt gruplar, homomorfizma ve izomorfizma, halka, tamlık bölgesi ve cisim" },
            { id: "cb_3", text: "Lineer Cebir: Matris/determinant işlemleri, lineer denklem sistemleri (Gauss, Cramer), vektör uzayları, lineer bağımlılık/bağımsızlık, taban ve boyut, lineer dönüşümler, çekirdek ve görüntü uzayı, özdeğer ve özvektör" }
        ],
        theorems: [
            "Fermat'nın Küçük Teoremi",
            "Euler Teoremi",
            "Çin Kalan Teoremi (CRT)",
            "Wilson Teoremi",
            "Lagrange Teoremi (Grup Teorisi)",
            "Birinci İzomorfizma Teoremi",
            "Rank-Nullity Teoremi",
            "Cayley-Hamilton Teoremi",
            "Gram-Schmidt Dikleştirme Teoremi",
            "Spektral Teorem"
        ]
    },
    geometri: {
        title: "Geometri - %24",
        kazanimlar: [
            { id: "geo_1", text: "Sentetik (Düzlem) Geometri: Üçgenler (açı-kenar, eşlik, benzerlik, alan), çokgenler ve özel dörtgenler (paralelkenar, eşkenar dörtgen, kare, dikdörtgen, yamuk, deltoid), çember ve daire özellikleri" },
            { id: "geo_2", text: "Katı Cisimler: Prizma, piramit, silindir, koni ve kürenin yüzey alanı ile hacim hesaplamaları" },
            { id: "geo_3", text: "Analitik Geometri: Nokta/doğru/çember analitiği, konikler (parabol, elips, hiperbol), uzayda koordinat sistemleri, uzayda doğru/düzlem denklemleri ve mesafe/açı ilişkileri" },
            { id: "geo_4", text: "Dönüşümler ve Vektörler: Öteleme, dönme, yansıma, homoteti; düzlem ve uzayda vektörler, iç (skaler) ve vektörel çarpım" }
        ],
        theorems: [
            "İzdüşüm Teoremi",
            "Karma Çarpımın Hacimsel Yorumu",
            "Koniklerin Odak-Doğrultman Tanımı",
            "Cavalieri İlkesi",
            "Ceva ve Menelaus Teoremleri",
            "Ptolemy (Batlamyus) Teoremi",
            "Euler Doğrusu ve Dokuz Nokta Çemberi"
        ]
    },
    uygulamali_matematik: {
        title: "Uygulamalı Matematik - %16",
        kazanimlar: [
            { id: "um_1", text: "Sayma ve Olasılık: Permütasyon, kombinasyon, binom, örneklem uzayı, koşullu olasılık, Bayes teoremi, kesikli/sürekli rastgele değişkenler, beklenen değer, varyans" },
            { id: "um_2", text: "İstatistik: Merkezi eğilim (ortalama, medyan, mod) ve yayılım ölçüleri (açıklık, standart sahme, varyans), veri gruplandırma, grafik yorumlama, standart normal dağılım (Z tablosu)" },
            { id: "um_3", text: "Diferansiyel Denklemler: Sınıflandırma (mertebe, derece), birinci mertebeden denklemler (ayrılabilir, homojen, tam, lineer) ve başlangıç değer problemleri" }
        ],
        theorems: [
            "Bayes Teoremi",
            "Merkezi Limit Teoremi (CLT)",
            "Büyük Sayılar Yasası (LLN)",
            "Chebyshev Eşitsizliği",
            "Picard-Lindelöf Varlık ve Teklik Teoremi",
            "Abel Teoremi (Wronskiyen)"
        ]
    },
    alan_egitimi: {
        title: "Alan Eğitimi - %20",
        kazanimlar: [
            { id: "ae_1", text: "Bilişsel Gelişim Kuramları: APOS Teorisi, SOLO Taksonomisi, Van Hiele Geometrik Düşünme Düzeyleri ve Yenilenmiş Bloom Taksonomisi" },
            { id: "ae_2", text: "Öğrenciyi Anlama Bilgisi: Matematiksel kavram yanılgıları, öğrenci hatalarının analizi ve zorluk çekilen konuların teşhisi" },
            { id: "ae_3", text: "Müfredat ve Öğretim Programı Bilgisi: Kazanım sınırları, sınıf düzeylerinin analizi ve yeni öğretim programı temaları" },
            { id: "ae_4", text: "Öğretim Stratejileri ve Temsiller: Somut materyaller, modeller ve dinamik matematik yazılımları (GeoGebra vb.) kullanımı" }
        ],
        theorems: [
            "Lee Shulman'ın PCK Modeli",
            "APOS Kuramı (Eylem-İşlem-Nesne-Şema)",
            "SOLO Taksonomisi",
            "Van Hiele Geometrik Düşünme Düzeyleri",
            "Yenilenmiş Bloom Taksonomisi",
            "Brousseau'nun Didaktik Durumlar Teorisi",
            "Webb'in Bilgi Derinliği (DOK)"
        ]
    }
};

// If running in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KAZANIMLAR_DATA };
}
