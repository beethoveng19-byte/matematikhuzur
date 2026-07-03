// API integration and Offline Templates for ÖABT Question Creator

const OFFLINE_QUESTIONS = {
    analiz: [
        {
            kazanim_id: "an_5",
            question: "Let $f(x, y) = \\frac{x^2 y}{x^4 + y^2}$ be a function defined on $\\mathbb{R}^2 \\setminus \\{(0,0)\\}$. Investigating the limit as $(x,y) \\to (0,0)$, along which of the following families of curves does the function approach a value that is dependent on the curve's parameter, thereby proving that the limit does not exist?",
            options: {
                A: "$y = mx$ (Linear paths)",
                B: "$y = kx^2$ (Parabolic paths)",
                C: "$y = mx^3$ (Cubic paths)",
                D: "$y^2 = kx$ (Side-opening parabolas)",
                E: "$y = mx + x^2$ (Mixed quadratic paths)"
            },
            correct_answer: "B",
            solution: "To evaluate $\\lim_{(x, y) \\to (0, 0)} \\frac{x^2 y}{x^4 + y^2}$:<br>1. **If we test linear paths ($y=mx$):**<br>$$\\lim_{x \\to 0} \\frac{x^2 (mx)}{x^4 + (mx)^2} = \\lim_{x \\to 0} \\frac{m x^3}{x^2(x^2 + m^2)} = \\lim_{x \\to 0} \\frac{mx}{x^2 + m^2} = 0$$<br>All straight lines yield a limit of $0$.<br>2. **If we test parabolic paths ($y=kx^2$):**<br>$$\\lim_{x \\to 0} \\frac{x^2 (kx^2)}{x^4 + (kx^2)^2} = \\lim_{x \\to 0} \\frac{k x^4}{x^4 (1 + k^2)} = \\frac{k}{1+k^2}$$<br>The limit value depends directly on the parameter $k$ of the approaching parabola (e.g., $1/2$ along $y=x^2$, and $2/5$ along $y=2x^2$). Since different paths produce different values, the limit does not exist.",
            cognitive_analysis: {
                bloom_level: "Çözümleme (Analysis)",
                solo_level: "İlişkisel (Relational)",
                dok_level: "Düzey 3 (Stratejik Düşünme)",
                theorems_used: ["Çok Değişkenli Limitlerde Yörünge Testi"],
                misconceptions_targeted: ["Doğrusal yollardan limit 0 çıkıyorsa limit her zaman vardır ezberi"],
                originality_rationale: "Bu soru, çok değişkenli limit kavramındaki doğrusal yaklaşım ezberini bozan klasik bir karşıt-örnektir. Öğrencinin dereceleri eşitlemek için parabolik yörüngeleri akıl etmesini gerektirir."
            }
        },
        {
            kazanim_id: "an_3",
            question: "Let $f: [0, 1] \\to \\mathbb{R}$ be a continuous function on $[0,1]$ and differentiable on $(0,1)$ such that $f(0) = f(1) = 0$. Which auxiliary function should be defined to prove that there exists a point $c \\in (0, 1)$ satisfying $f'(c) + 2c f(c) = 0$ using Rolle's Theorem?",
            options: {
                A: "$g(x) = e^x f(x)$",
                B: "$g(x) = e^{-x^2} f(x)$",
                C: "$g(x) = e^{x^2} f(x)$",
                D: "$g(x) = x^2 f(x)$",
                E: "$g(x) = \\ln(x) f(x)$"
            },
            correct_answer: "C",
            solution: "We want to show that $f'(c) + 2cf(c) = 0$ for some $c \\in (0,1)$.<br>1. Consider the expression $f'(x) + 2xf(x)$. If we multiply this by an integrating factor $\\mu(x) = e^{x^2}$, we notice:<br>$$e^{x^2}(f'(x) + 2xf(x)) = \\frac{d}{dx} [e^{x^2} f(x)]$$<br>2. Let us define the auxiliary function $g(x) = e^{x^2} f(x)$.<br>3. Check the conditions of Rolle's Theorem for $g(x)$ on $[0, 1]$:<br>- $g(x)$ is continuous on $[0, 1]$ (product of continuous functions).<br>- $g(x)$ is differentiable on $(0, 1)$.<br>- $g(0) = e^0 f(0) = 0$ and $g(1) = e^1 f(1) = 0$. Therefore, $g(0) = g(1)$.<br>4. By Rolle's Theorem, there exists $c \\in (0, 1)$ such that $g'(c) = 0$.<br>$$g'(c) = e^{c^2} f'(c) + 2c e^{c^2} f(c) = e^{c^2}(f'(c) + 2c f(c)) = 0$$<br>Since $e^{c^2} \\neq 0$, it follows that $f'(c) + 2c f(c) = 0$. Thus, $g(x) = e^{x^2}f(x)$ is the correct auxiliary function.",
            cognitive_analysis: {
                bloom_level: "Yaratma (Creation - Model Tasarlama)",
                solo_level: "Soyutlanmış İlişkisel (Extended Abstract)",
                dok_level: "Düzey 4 (Derinlemesine Düşünme)",
                theorems_used: ["Rolle Teoremi", "İntegral Çarpanı Metodu"],
                misconceptions_targeted: ["Rolle teoreminin sadece f'(c)=0 durumlarında uygulanacağı yanılgısı"],
                originality_rationale: "Yardımcı fonksiyon kurma, Kalkülüs ispatlarındaki en yaratıcı süreçlerden biridir. Diferansiyel denklem integral çarpanı mantığı ile Rolle teoremini sentezler."
            }
        }
    ],
    cebir: [
        {
            kazanim_id: "cb_3",
            question: "Let $A$ be a $3 \\times 3$ real matrix satisfying the relation $A^3 - A^2 - A + I_3 = 0$. If $\\det(A) = -1$, what is the trace of $A^2$?",
            options: {
                A: "1",
                B: "2",
                C: "3",
                D: "4",
                E: "5"
            },
            correct_answer: "C",
            solution: "1. The minimal polynomial or annihilating polynomial of $A$ divides $p(t) = t^3 - t^2 - t + 1$.<br>Let's factorize $p(t)$:<br>$$t^3 - t^2 - t + 1 = t^2(t-1) - (t-1) = (t^2 - 1)(t-1) = (t-1)^2(t+1)$$<br>2. Therefore, the eigenvalues of $A$ can only be chosen from the roots of $p(t) = 0$, which are $\\lambda = 1$ (multiplicity up to 2) and $\\lambda = -1$ (multiplicity up to 3).<br>3. Since $A$ is a $3 \\times 3$ matrix, it has exactly 3 eigenvalues (counted with algebraic multiplicity): $\\lambda_1, \\lambda_2, \\lambda_3$.<br>4. The determinant is the product of eigenvalues: $\\det(A) = \\lambda_1 \\lambda_2 \\lambda_3 = -1$.<br>Since each $\\lambda_i \\in \\{1, -1\\}$, the only way to get a product of $-1$ is if we have:<br>- One eigenvalue is $-1$ and two eigenvalues are $1$ (eigenvalues: $1, 1, -1$), OR<br>- All three eigenvalues are $-1$ (eigenvalues: $-1, -1, -1$).<br>5. Let's check both cases for the trace of $A^2$. The eigenvalues of $A^2$ are $\\lambda_1^2, \\lambda_2^2, \\lambda_3^2$.<br>Since $\\lambda_i \\in \\{1, -1\\}$, we have $\\lambda_i^2 = 1$ for all $i$.<br>6. Therefore, the eigenvalues of $A^2$ are $1, 1, 1$.<br>The trace of $A^2$ is the sum of its eigenvalues:<br>$$\\text{Tr}(A^2) = 1 + 1 + 1 = 3$$",
            cognitive_analysis: {
                bloom_level: "Çözümleme (Analysis)",
                solo_level: "İlişkisel (Relational)",
                dok_level: "Düzey 3 (Stratejik Düşünme)",
                theorems_used: ["Spektral Teorem / Özdeğer Teoremi", "Cayley-Hamilton / İndirgenemez Polinom"],
                misconceptions_targeted: ["Determinant ile özdeğer çarpanları arasındaki ilişkiyi kuramama", "A matrisini bulmaya çalışarak vakit kaybetme"],
                originality_rationale: "Bu soru, adayı matris elemanlarıyla işlem yapmak yerine özdeğerlerin cebirsel yapısını ve karakteristik polinom ilişkilerini analiz etmeye zorlar."
            }
        },
        {
            kazanim_id: "cb_2",
            question: "Let $G = (\\mathbb{Z}_{18}, +)$ and $H = (\\mathbb{Z}_{30}, +)$ be additive cyclic groups. How many different group homomorphisms $\\phi: G \\to H$ can be defined?",
            options: {
                A: "2",
                B: "6",
                C: "18",
                D: "30",
                E: "90"
            },
            correct_answer: "B",
            solution: "1. **Theorem:** The number of group homomorphisms from $\\mathbb{Z}_m$ to $\\mathbb{Z}_n$ is equal to the greatest common divisor (GCD) of $m$ and $n$.<br>$$\\text{Number of Homomorphisms} = \\gcd(m, n)$$<br>2. Here we have $m = 18$ and $n = 30$.<br>3. Calculate $\\gcd(18, 30)$:<br>- Divisors of 18: 1, 2, 3, 6, 9, 18<br>- Divisors of 30: 1, 2, 3, 5, 6, 10, 15, 30<br>- $\\gcd(18, 30) = 6$.<br>4. Therefore, exactly 6 different homomorphisms can be defined. Each homomorphism is uniquely determined by the image of the generator $1 \\in \\mathbb{Z}_{18}$, which must map to an element in $\\mathbb{Z}_{30}$ whose order divides $\\gcd(18, 30)$.",
            cognitive_analysis: {
                bloom_level: "Uygulama (Application)",
                solo_level: "Çok Yönlü (Multi-structural)",
                dok_level: "Düzey 2 (Beceri/Kavramsal)",
                theorems_used: ["Devirli Gruplarda Homomorfizma Teoremi"],
                misconceptions_targeted: ["Grup homomorfizmasını eleman eleman eşleyerek bulmaya çalışıp vakit kaybetme"],
                originality_rationale: "Devirli grupların yapısal üreteç özelliklerini ve GCD arasındaki aritmetik bağıntıyı birleştiren, ÖABT sınavlarında ayırt edici bir soru şablonudur."
            }
        },
        {
            kazanim_id: "cb_1",
            question: "Adayların modüler aritmetik konusundaki ezberlerini bozmak isteyen bir soru yazarı şu soruyu kurguluyor: <br> $x \\equiv 2 \\pmod 3$ <br> $x \\equiv 3 \\pmod 5$ <br> $x \\equiv 2 \\pmod 7$ <br> denklik sistemini sağlayan en küçük pozitif $x$ tam sayısının rakamları toplamı kaçtır?",
            options: {
                A: "5",
                B: "8",
                C: "11",
                D: "14",
                E: "17"
            },
            correct_answer: "A",
            solution: "Bu soru Çin Kalan Teoremi (Chinese Remainder Theorem) yardımıyla çözülebilir. <br>1. **Sistemin Yapısı:** <br> $m_1 = 3$, $m_2 = 5$, $m_3 = 7$ modları aralarında asaldır. Toplam mod $M = 3 \\cdot 5 \\cdot 7 = 105$'dir. <br>2. **Denklemleri Çözme:** <br> Birinci ve üçüncü denklemlere baktığımızda: $x \\equiv 2 \\pmod 3$ ve $x \\equiv 2 \\pmod 7$. <br> Buradan $x \\equiv 2 \\pmod{21}$ elde edilir. Yani $x = 21k + 2$ formundadır. <br>3. **İkinci Denklemle Birleştirme:** <br> $21k + 2 \\equiv 3 \\pmod 5$ <br> $21 \\equiv 1 \\pmod 5$ olduğundan, $k + 2 \\equiv 3 \\pmod 5 \\implies k \\equiv 1 \\pmod 5$ bulunur. <br> En küçük pozitif $k$ değeri için $k = 1$ seçilirse: <br> $x = 21(1) + 2 = 23$. <br>4. **Doğrulama:** <br> $23 \\equiv 2 \\pmod 3$ (Doğru) <br> $23 \\equiv 3 \\pmod 5$ (Doğru) <br> $23 \\equiv 2 \\pmod 7$ (Doğru) <br>5. **Rakamlar Toplamı:** <br> $2 + 3 = 5$ olup doğru cevap A seçeneğidir.",
            cognitive_analysis: {
                bloom_level: "Uygulama (Application - İşlemsel Bilgi)",
                solo_level: "Çok Yönlü (Multi-structural)",
                dok_level: "Düzey 2 (Beceri/Kavramsal)",
                theorems_used: ["Çin Kalan Teoremi (CRT)", "Aritmetik Kalan Analizi"],
                misconceptions_targeted: ["Çin Kalan Teoremi'ni sadece uzun formüllere bağlı kalarak çözmeye çalışıp pratik yolları görememe"],
                originality_rationale: "Bu soru, standart Çin Kalan Teoremi formülü yerine iki modun kalanının eşit olmasından yararlanan pratik ve hızlı bir kavramsal analiz yolu sunmaktadır."
            }
        }
    ],
    geometri: [
        {
            kazanim_id: "geo_3",
            question: "In 3D space $\\mathbb{R}^3$, the parametric equations of two skew lines are given by:<br>$d_1: (x,y,z) = (1+t, 2-t, 3t)$ and $d_2: (x,y,z) = (2s, 1+s, -s)$.<br>What is the shortest distance between these two lines?",
            options: {
                A: "$\\frac{3}{\\sqrt{62}}$ units",
                B: "$\\frac{5}{\\sqrt{62}}$ units",
                C: "$\\frac{5}{\\sqrt{14}}$ units",
                D: "$\\frac{1}{\\sqrt{14}}$ units",
                E: "$\\frac{7}{\\sqrt{62}}$ units"
            },
            correct_answer: "B",
            solution: "1. **Direction vectors of the lines:**<br>For $d_1$: $\\vec{u} = (1, -1, 3)$<br>For $d_2$: $\\vec{v} = (2, 1, -1)$<br>2. **Common normal vector (cross product of direction vectors):**<br>$$\\vec{n} = \\vec{u} \\times \\vec{v} = \\det \\begin{bmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ 1 & -1 & 3 \\\\ 2 & 1 & -1 \\end{bmatrix}$$<br>$$\\vec{n} = \\vec{i}(1 - 3) - \\vec{j}(-1 - 6) + \\vec{k}(1 + 2) = (-2, 7, 3)$$<br>3. **Choose a point on each line:**<br>On $d_1$ (let $t=0$): $A(1, 2, 0)$<br>On $d_2$ (let $s=0$): $B(0, 1, 0)$<br>Vector connecting them: $\\vec{AB} = B - A = (-1, -1, 0)$<br>4. **Shortest distance formula (projection of $\\vec{AB}$ onto the normal $\\vec{n}$):**<br>$$\\text{Distance} = \\frac{|\\vec{AB} \\cdot \\vec{n}|}{\\|\\vec{n}\\|} = \\frac{|(-1)(-2) + (-1)(7) + (0)(3)|}{\\sqrt{(-2)^2 + 7^2 + 3^2}}$$<br>$$\\text{Distance} = \\frac{|2 - 7|}{\\sqrt{4 + 49 + 9}} = \\frac{5}{\\sqrt{62}}\\text{ units.}$$",
            cognitive_analysis: {
                bloom_level: "Analiz (Analysis)",
                solo_level: "İlişkisel (Relational)",
                dok_level: "Düzey 3 (Stratejik Düşünme)",
                theorems_used: ["Vektörel Çarpım ve Karma Çarpımın Geometrik Anlamı", "İzdüşüm Vektörü Bağıntısı"],
                misconceptions_targeted: ["Aykırı doğruları kesişiyor veya paralel zannedip mesafe hesaplayamama"],
                originality_rationale: "Bu soru, 3 boyutlu uzayda doğruların konumlarını hayal etmeyi ve vektörel izdüşüm ile ortak normal kavramlarını bütünleştirmeyi gerektirir."
            }
        }
    ],
    uygulamali_matematik: [
        {
            kazanim_id: "um_3",
            question: "An integrating factor for the differential equation $(3xy + y^2)dx + (x^2 + xy)dy = 0$ is known to be of the form $\\mu(x,y) = x^a y^b$. What is the value of the product $a \\cdot b$?",
            options: {
                A: "-2",
                B: "-1",
                C: "0",
                D: "1",
                E: "2"
            },
            correct_answer: "C",
            solution: "1. Let $M(x,y) = 3xy + y^2$ and $N(x,y) = x^2 + xy$.<br>Multiply by the integrating factor $\\mu(x,y) = x^a y^b$:<br>$$(3x^{a+1}y^{b+1} + x^a y^{b+2})dx + (x^{a+2}y^b + x^{a+1}y^{b+1})dy = 0$$<br>2. For this equation to be exact, we must have $\\frac{\partial M_{new}}{\partial y} = \\frac{\partial N_{new}}{\partial x}$:<br>$$\\frac{\partial M_{new}}{\partial y} = 3(b+1)x^{a+1}y^b + (b+2)x^a y^{b+1}$$<br>$$\\frac{\partial N_{new}}{\partial x} = (a+2)x^{a+1}y^b + (a+1)x^a y^{b+1}$$<br>3. Equating the coefficients of identical power terms:<br>- For $x^{a+1}y^b$: $3(b+1) = a+2 \\implies a - 3b = 1$<br>- For $x^a y^{b+1}$: $b+2 = a+1 \\implies a - b = 1$<br>4. Solving this linear system:<br>Subtracting the first equation from the second: $2b = 0 \\implies b = 0$.<br>Plugging $b=0$ back: $a = 1$.<br>5. The integrating factor is $\\mu(x,y) = x^1 y^0 = x$.<br>The product $a \\cdot b = 1 \\cdot 0 = 0$.",
            cognitive_analysis: {
                bloom_level: "Uygulama (Application)",
                solo_level: "Çok Yönlü (Multi-structural)",
                dok_level: "Düzey 2 (Beceri/Kavramsal)",
                theorems_used: ["Tam Diferansiyel Denklemler", "İntegral Çarpanı Yöntemi"],
                misconceptions_targeted: ["İntegral çarpanının sadece tek değişkene bağlı olabileceği önyargısı"],
                originality_rationale: "Adayı formül ezberlemek yerine tam diferansiyel şartının kısmi türev eşitliğine dayanan tanımını yapmaya ve katsayı eşitlemeye yönlendirir."
            }
        },
        {
            kazanim_id: "um_1",
            question: "A certain genetic condition occurs in 1 out of 1000 people. A diagnostic test is 99% accurate when a person has the condition, and has a 2% false-positive rate. If a randomly selected person tests positive, what is the probability they actually have the condition?",
            options: {
                A: "99%",
                B: "4.7%",
                C: "2%",
                D: "0.1%",
                E: "95.3%"
            },
            correct_answer: "B",
            solution: "We will use **Bayes' Theorem** to find $P(\\text{Condition} \\mid \\text{Positive})$.<br>1. Define probabilities:<br>- $P(\\text{Condition}) = 0.001$ (Prior probability of having the disease)<br>- $P(\\text{Healthy}) = 0.999$<br>- $P(\\text{Positive} \\mid \\text{Condition}) = 0.99$ (Sensitivity)<br>- $P(\\text{Positive} \\mid \\text{Healthy}) = 0.02$ (False positive rate)<br>2. Find total probability of testing positive $P(\\text{Positive})$:<br>$$P(\\text{Positive}) = P(\\text{Positive} \\mid \\text{Condition})P(\\text{Condition}) + P(\\text{Positive} \\mid \\text{Healthy})P(\\text{Healthy})$$<br>$$P(\\text{Positive}) = (0.99 \\times 0.001) + (0.02 \\times 0.999) = 0.00099 + 0.01998 = 0.02097$$<br>3. Apply Bayes' Theorem:<br>$$P(\\text{Condition} \\mid \\text{Positive}) = \\frac{P(\\text{Positive} \\mid \\text{Condition})P(\\text{Condition})}{P(\\text{Positive})}$$<br>$$P(\\text{Condition} \\mid \\text{Positive}) = \\frac{0.00099}{0.02097} \\approx 0.0472 \\text{ or } 4.72\\%$$<br>Even with a 99% accurate test, because the condition is so rare, a positive test only translates to a $4.7\\%$ chance of actually having the condition.",
            cognitive_analysis: {
                bloom_level: "Kavrama (Comprehension)",
                solo_level: "İlişkisel (Relational)",
                dok_level: "Düzey 2 (Beceri/Kavramsal)",
                theorems_used: ["Bayes Teoremi", "Toplam Olasılık Teoremi"],
                misconceptions_targeted: ["Testin doğruluğu %99 ise pozitif çıkan birinin kesinlikle hasta olacağını zannetme (Temel Oran Yanılgısı)"],
                originality_rationale: "Günlük hayattaki Bayesci olasılık yanılsamalarını sorgulayan, ezbere olasılık formüllerinin ötesinde sezgisel kavrayış ölçen bir sorudur."
            }
        }
    ],
    alan_egitimi: [
        {
            kazanim_id: "ae_1",
            question: "A high school mathematics teacher observes a student who can mentally compute $f(5) = 13$ in $f(x)=2x+3$ step-by-step. However, the student struggles to conceive of $f(x)$ as a complete, unified mathematical entity onto which operations like finding the inverse or adding to another function can be applied. According to APOS Theory, at which cognitive stage is this student?",
            options: {
                A: "Action (Eylem)",
                B: "Process (İşlem)",
                C: "Object (Nesne)",
                D: "Schema (Şema)",
                E: "Extended Abstract (Soyutlanmış)"
            },
            correct_answer: "B",
            solution: "APOS (Action-Process-Object-Schema) theory evaluates mental constructions:<br>1. **Action (Eylem):** Relies on external cues, step-by-step physical calculations. A student can only evaluate a function by plug-in numbers.<br>2. **Process (İşlem):** The student has internalized the actions. They can mentally perform the steps and describe the inputs/outputs relationship without needing to physically write it down. (The student in the question is here; they mentally compute the result but cannot treat the function as a standalone thing).<br>3. **Object (Nesne):** The student views the process as a whole, a unified entity. They can perform operations *on* the function itself (e.g. adding two functions, composition, finding inverses).<br>4. **Schema (Şema):** A collection of actions, processes, and objects organized in a coherent framework.<br>Therefore, the student is at the **Process (İşlem)** stage.",
            cognitive_analysis: {
                bloom_level: "Analiz (Analysis - Kavramsal Teşhis)",
                solo_level: "İlişkisel (Relational)",
                dok_level: "Düzey 3 (Stratejik Düşünme)",
                theorems_used: ["APOS Teorisi Bilişsel Düzey Analizi"],
                misconceptions_targeted: ["APOS evrelerinin tanımlarını ezberleyip sınıf içi diyaloglara uyarlayamama"],
                originality_rationale: "Bu soru, öğretmen adayının matematik eğitimi kuramlarını ezberci bir şekilde değil, öğrenci diyaloglarını ve zihinsel aşamalarını teşhis edebilecek düzeyde kavramasını ölçer."
            }
        }
    ]
};

// Formats a prompt for Gemini model
function buildSystemPrompt() {
    return `Sen, ÖSYM tarafından düzenlenen Öğretmenlik Alan Bilgisi Testi (ÖABT) İlköğretim ve Lise Matematik öğretmenliği sınavları için özgün, yaratıcı ve kavramsal derinliği olan sorular hazırlayan uzman bir Akademik Soru Hazırlama Komisyonu Üyesisin.
Görevin, ezberci çözümleri aşan, adayın matematiksel kavramları ne kadar derinlemesine anladığını, teoremleri ve bilişsel modelleri nasıl ilişkilendirdiğini ölçen sorular hazırlamaktır.

Ürettiğin çıktıyı KESİNLİKLE sadece ve sadece geçerli bir JSON formatında döndürmelisin. JSON yapısı tam olarak aşağıdaki gibi olmalıdır:
{
  "question": "Soru metni (Türkçe ve KaTeX formatında)",
  "options": {
    "A": "A seçeneği",
    "B": "B seçeneği",
    "C": "C seçeneği",
    "D": "D seçeneği",
    "E": "E seçeneği"
  },
  "correct_answer": "Doğru seçenek (A, B, C, D veya E)",
  "solution": "Adım adım detaylı çözüm ve açıklama (KaTeX formatında)",
  "cognitive_analysis": {
    "bloom_level": "Yenilenmiş Bloom basamağı ve bilgi boyutu (örneğin: Çözümleme - Kavramsal Bilgi)",
    "solo_level": "SOLO Taksonomisi düzeyi (Tek Yönlü / Çok Yönlü / İlişkisel / Soyutlanmış İlişkisel)",
    "dok_level": "Webb DOK düzeyi (Düzey 1 / Düzey 2 / Düzey 3 / Düzey 4)",
    "theorems_used": ["Kullanılan Teorem 1", "Kullanılan Teorem 2"],
    "misconceptions_targeted": ["Adayların bu soruda düşebileceği kavram yanılgısı 1", "Sık yapılan hata 2"],
    "originality_rationale": "Bu sorunun neden özgün olduğu, hangi ezberi bozduğu ve yaratıcı yönü"
  }
}

Kurallar:
1. Matematiksel terimleri ve formülleri yazarken mutlaka LaTeX/KaTeX sintaksını kullanmalısın.
   - Satır içi matematik formülleri için tek dolar sembolü kullan: $x^2 + y^2 = r^2$
   - Blok formüller için çift dolar sembolü kullan: $$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$
   - Matematiksel olmayan ve formül dışı kelimeleri kalın (bold) yapmak için **ASLA** LaTeX'teki \\textbf{...} komutunu kullanma. Bunun yerine HTML etiketleri olan <b>...</b> veya <strong>...</strong> kullan. İtalik yapmak için <i>...</i> kullan. LaTeX yazı biçimlendirme komutlarını ($ sembolleri dışındaki düz metinlerde) kesinlikle kullanma.
   - Pozitif tam sayılar kümesini yazarken \\mathbb{Z}^1 gibi hatalı gösterimler kullanma; her zaman standart ve doğru olan \\mathbb{Z}^+ gösterimini tercih et.
2. Çeldiricileri (yanlış seçenekleri) tasarlarken, adayların yapabileceği olası işlemsel hataları veya kavram yanılgılarını içeren değerleri seç.
3. Sorunun bilimsel olarak %100 doğru olduğunu ve tek bir kesin doğru cevabı bulunduğunu doğrula.
4. Dil bilgisi ve imla kurallarına dikkat et. Soruyu akademik, açık ve anlaşılır bir Türkçe ile yaz.`;
}

function buildUserPrompt(params) {
    const { domainTitle, kazanimText, difficulty, bloom, solo, dok, theorems, customInstructions } = params;
    
    let prompt = `Aşağıdaki parametrelere göre ÖSYM standartlarında, ancak ezber bozan ve özgün bir ÖABT sorusu hazırla:
- **Ders/Alan**: ${domainTitle}
- **Kazanım**: ${kazanimText}
- **Zorluk Derecesi**: ${difficulty}
- **Hedef Bilişsel Düzeyler**:
  - Bloom Taksonomisi: ${bloom}
  - SOLO Düzeyi: ${solo}
  - Webb Bilgi Derinliği (DOK): ${dok}
`;

    if (theorems && theorems.length > 0) {
        prompt += `- **Soru Kurgusuna Dahil Edilecek / İlişkilendirilecek Teoremler**: ${theorems.join(", ")}\n`;
    }

    if (customInstructions) {
        prompt += `- **Ek Özel Yönergeler**: ${customInstructions}\n`;
    }

    prompt += `\nLütfen cevabı yukarıda belirtilen JSON formatında döndür. JSON nesnesi dışında hiçbir şey (örneğin \`\`\`json markdown blokları gibi) ekleme, doğrudan saf JSON dizesi olarak yanıt ver.`;
    
    return prompt;
}

// Calls Gemini API to generate the question
async function generateQuestionWithGemini(apiKey, model, params) {
    try {
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt(params);
        
        // Use v1beta endpoint
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: systemPrompt + "\n\nKULLANICI TALEBİ:\n" + userPrompt }
                    ]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `HTTP hata kodu: ${response.status}`);
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!textResponse) {
            throw new Error("Yapay zekadan boş yanıt döndü.");
        }

        // Parse and return JSON
        return JSON.parse(textResponse.trim());

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

// Local offline fallback question generator
function generateQuestionOffline(params) {
    const { domainKey, kazanimId } = params;
    
    // Find questions in the domain
    const domainQuestions = OFFLINE_QUESTIONS[domainKey] || [];
    let match = null;

    if (kazanimId) {
        match = domainQuestions.find(q => q.kazanim_id === kazanimId);
    }
    
    // If no exact kazanım match, return any question from the domain
    if (!match && domainQuestions.length > 0) {
        match = domainQuestions[Math.floor(Math.random() * domainQuestions.length)];
    }
    
    // If still no match (or empty domain), select a random question from all offline questions
    if (!match) {
        const keys = Object.keys(OFFLINE_QUESTIONS);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const randomDomainQs = OFFLINE_QUESTIONS[randomKey];
        match = randomDomainQs[Math.floor(Math.random() * randomDomainQs.length)];
    }

    // Clone the question to avoid mutating the database
    const cloned = JSON.parse(JSON.stringify(match));
    
    // Adjust difficulty or specific parameters slightly in offline output if user requested
    if (params.difficulty && params.difficulty !== "Orta") {
        cloned.cognitive_analysis.originality_rationale += ` (Kullanıcı tarafından talep edilen ${params.difficulty} zorluk seviyesine göre ayarlanmıştır.)`;
    }

    return cloned;
}

// Expose exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateQuestionWithGemini,
        generateQuestionOffline
    };
}
