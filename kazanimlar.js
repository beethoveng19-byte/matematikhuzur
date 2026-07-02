const KAZANIMLAR_DATA = {
    analiz: {
        title: "Analiz (Kalkülüs)",
        kazanimlar: [
            { id: "an_1", text: "Tek değişkenli fonksiyonlarda limit, süreklilik ve süreksizlik türlerinin analizi" },
            { id: "an_2", text: "Türevlenebilme ve türevin fiziksel/geometrik yorumu, ekstremum problemleri" },
            { id: "an_3", text: "Belirli/belirsiz integral, alan, yay uzunluğu ve dönel cisimlerin hacim hesapları" },
            { id: "an_4", text: "Çok değişkenli fonksiyonlarda limit, kısmi türev, zincir kuralı ve katlı integraller" },
            { id: "an_5", text: "Sonsuz seriler, yakınsaklık testleri, Taylor ve Maclaurin açılımları" },
            { id: "an_6", text: "Vektör alanları, çizgi ve yüzey integralleri, Green, Stokes ve Gauss (Diverjans) teoremleri" }
        ],
        theorems: [
            "Ortalama Değer Teoremi (MVT)",
            "Rolle Teoremi",
            "Bolzano / Ara Değer Teoremi (IVT)",
            "Analizin Temel Teoremi (FTC)",
            "L'Hopital Kuralı",
            "Green Teoremi",
            "Stokes Teoremi",
            "Diverjans (Gauss) Teoremi",
            "Sıkıştırma (Sandwich) Teoremi",
            "Taylor Teoremi",
            "Weierstrass Yakınsaklık Teoremi"
        ]
    },
    lineer_cebir: {
        title: "Lineer Cebir",
        kazanimlar: [
            { id: "lc_1", text: "Vektör uzayları, alt uzaylar, lineer bağımsızlık, taban (baz) ve boyut kavramları" },
            { id: "lc_2", text: "Lineer dönüşümler, çekirdek (kernel), görüntü uzayı ve boyut (Rank-Nullity) teoremi" },
            { id: "lc_3", text: "Matrislerin determinantı, tersi ve lineer denklem sistemlerinin çözümü" },
            { id: "lc_4", text: "Özdeğerler, özvektörler, karakteristik polinom ve köşegenleştirilebilme" },
            { id: "lc_5", text: "İç çarpım uzayları, diklik (ortagonallik), Gram-Schmidt süreci ve izdüşüm" }
        ],
        theorems: [
            "Rank-Nullity Teoremi",
            "Cayley-Hamilton Teoremi",
            "Gram-Schmidt Dikleştirme Teoremi",
            "Kronecker-Capelli Teoremi",
            "Spektral Teorem",
            "Schur Ayrışım Teoremi"
        ]
    },
    soyut_cebir: {
        title: "Soyut Cebir",
        kazanimlar: [
            { id: "sc_1", text: "Grup tanımı, temel özellikler, alt gruplar, permütasyon grupları ve devirli gruplar" },
            { id: "sc_2", text: "Eş kümeler (cosetler), Lagrange Teoremi ve normal alt gruplar" },
            { id: "sc_3", text: "Grup homomorfizmaları, izomorfizmalar ve izomorfizma teoremleri" },
            { id: "sc_4", text: "Halkalar, alt halkalar, idealler (asal ve maksimal) ve bölüm halkaları" },
            { id: "sc_5", text: "Polinom halkaları, cisimler ve cisim genişlemeleri" }
        ],
        theorems: [
            "Lagrange Teoremi (Grup Teorisi)",
            "Birinci İzomorfizma Teoremi",
            "Fermat'nın Küçük Teoremi",
            "Euler Teoremi",
            "Çin Kalan Teoremi (CRT)",
            "Cayley Teoremi",
            "Burnside Teoremi",
            "Sylow Teoremleri",
            "Eisenstein Kriteri"
        ]
    },
    diferansiyel_denklemler: {
        title: "Diferansiyel Denklemler",
        kazanimlar: [
            { id: "dd_1", text: "Birinci mertebeden diferansiyel denklemler (ayrılabilir, doğrusal, homojen, tam) ve integral çarpanı" },
            { id: "dd_2", text: "Yüksek mertebeden sabit katsayılı doğrusal denklemler ve parametrelerin değişimi yöntemi" },
            { id: "dd_3", text: "Laplace ve ters Laplace dönüşümleri ile başlangıç değer problemlerinin çözümü" },
            { id: "dd_4", text: "Diferansiyel denklem sistemleri ve çözümleri" }
        ],
        theorems: [
            "Picard-Lindelöf Varlık ve Teklik Teoremi",
            "Abel Teoremi (Wronskiyen)",
            "Superpozisyon İlkesi",
            "Laplace Dönüşüm Teoremleri",
            "Sturm-Liouville Teoremi"
        ]
    },
    analitik_geometri: {
        title: "Analitik Geometri",
        kazanimlar: [
            { id: "ag_1", text: "Düzlemde ve uzayda vektörler, iç çarpım, dış çarpım ve karma çarpımın geometrik yorumu" },
            { id: "ag_2", text: "Uzayda doğru ve düzlem denklemleri, kesişimler ve uzaklık hesapları" },
            { id: "ag_3", text: "Koniklerin (çember, parabol, elips, hiperbol) standart denklemleri ve analitik özellikleri" },
            { id: "ag_4", text: "Uzayda küre, silindir, koni ve dönel yüzeylerin denklemleri" }
        ],
        theorems: [
            "İzdüşüm Teoremi",
            "Karma Çarpımın Hacimsel Yorumu",
            "Koniklerin Odak-Doğrultman Tanımı",
            "Euler Doğrusu ve Dokuz Nokta Çemberi",
            "Cavalieri İlkesi"
        ]
    },
    olasilik_istatistik: {
        title: "Olasılık ve İstatistik",
        kazanimlar: [
            { id: "oi_1", text: "Permütasyon, kombinasyon, binom ve koşullu olasılık, Bayes teoremi" },
            { id: "oi_2", text: "Kesikli ve sürekli rastgele değişkenler, olasılık yoğunluk fonksiyonları" },
            { id: "oi_3", text: "Beklenen değer, varyans, kovaryans ve moment üreten fonksiyonlar" },
            { id: "oi_4", text: "Örnekleme dağılımları, güven aralıkları ve hipotez testleri" }
        ],
        theorems: [
            "Bayes Teoremi",
            "Merkezi Limit Teoremi (CLT)",
            "Büyük Sayılar Yasası (LLN)",
            "Chebyshev Eşitsizliği",
            "Toplam Olasılık Teoremi",
            "Markov Eşitsizliği"
        ]
    },
    alan_egitimi: {
        title: "Alan Eğitimi",
        kazanimlar: [
            { id: "ae_1", text: "Matematik öğretiminde bilişsel gelişim kuramları (APOS, SOLO, Van Hiele)" },
            { id: "ae_2", text: "Öğrencilerin kavram yanılgıları, hata çözümlemeleri ve zorluk çekilen konuların teşhisi" },
            { id: "ae_3", text: "Matematik öğretim programlarındaki kazanım sınırları ve sınıf düzeylerinin analizi" },
            { id: "ae_4", text: "Matematiksel kavramların somutlaştırılmasında temsil ve materyal (GeoGebra vb.) kullanımı" }
        ],
        theorems: [
            "Lee Shulman'ın PCK (Pedagojik Alan Bilgisi) Modeli",
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
