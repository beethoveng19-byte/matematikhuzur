// ÖABT Matematik Soru Hazırlama ve Analiz Platformu - Uygulama Mantığı

let activeDomain = "analiz";
let selectedOutcome = "";
let selectedTheorems = [];
let questionHistory = [];
let testPool = []; // Selected questions for test
let currentQuestion = null;
let cognitiveChart = null;

// Online Solver State
let solverAnswers = {}; // { qId: selectedLetter }
let solverActiveIndex = 0;
let solverTimerInterval = null;
let solverSeconds = 0;

// Initial parameters
let selectedDifficulty = "Orta";
let selectedBloom = "Uygulama";
let selectedSOLO = "İlişkisel";
let selectedDOK = "Düzey 2";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initializations
    loadHistory();
    loadTestPool();
    initSettings();
    renderDomains();
    switchDomain(activeDomain);
    initKeyboard();
    initTheme();
    updateHistoryUI();
    updateTestPoolUI();
    updateChart();

    // 2. Set event listeners for parameter buttons
    setupParameterListeners();
    
    // 3. Live Preview listener
    const additionalInput = document.getElementById("additional-instructions");
    const livePreview = document.getElementById("live-preview");
    
    additionalInput.addEventListener("input", () => {
        const text = additionalInput.value;
        if (!text) {
            livePreview.innerHTML = "<span style='font-style:italic;color:var(--text-muted)'>Matematiksel klavye veya el yazısı KaTeX kodlarının anlık önizlemesi burada gösterilir...</span>";
            return;
        }
        livePreview.innerHTML = text;
        try {
            // Render math in the preview box
            renderMathInElement(livePreview, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ],
                throwOnError: false
            });
        } catch (e) {
            console.error(e);
        }
    });

    // 4. Generate Button listener
    document.getElementById("generate-btn").addEventListener("click", generateQuestion);

    // 5. Action listeners
    document.getElementById("btn-print").addEventListener("click", () => window.print());
    document.getElementById("btn-copy").addEventListener("click", copyLatexToClipboard);
    document.getElementById("btn-clear-history").addEventListener("click", clearHistory);
    document.getElementById("btn-toggle-test").addEventListener("click", toggleTestQuestion);
    
    // 6. Test Pool Print/Export/Solve actions
    document.getElementById("btn-print-test-student").addEventListener("click", () => printTest("student"));
    document.getElementById("btn-print-test-teacher").addEventListener("click", () => printTest("teacher"));
    document.getElementById("btn-solve-test-online").addEventListener("click", startTestSolver);
    document.getElementById("btn-export-test-latex").addEventListener("click", exportTestToLatex);
    
    // 7. Solver Control listeners
    document.getElementById("btn-close-solver").addEventListener("click", closeTestSolver);
    document.getElementById("btn-solver-prev").addEventListener("click", solverPrevQuestion);
    document.getElementById("btn-solver-next").addEventListener("click", solverNextQuestion);
    document.getElementById("btn-solver-finish").addEventListener("click", finishTestSolver);
    document.getElementById("btn-results-close").addEventListener("click", closeTestSolver);
    
    // 8. Tab switching in results panel
    setupResultsTabListeners();
});

// Setup results tab navigation
function setupResultsTabListeners() {
    const tabContainer = document.querySelector(".analysis-tabs");
    if (!tabContainer) return;

    tabContainer.addEventListener("click", (e) => {
        const tabBtn = e.target.closest(".analysis-tab-btn");
        if (!tabBtn) return;

        // Deactivate all tabs
        document.querySelectorAll(".analysis-tab-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

        // Activate selected
        tabBtn.classList.add("active");
        const targetId = tabBtn.dataset.tab;
        document.getElementById(`tab-${targetId}`).classList.add("active");
    });
}

// Load settings from localStorage
function initSettings() {
    const apiKey = localStorage.getItem("oabt_gemini_api_key") || "";
    document.getElementById("api-key-input").value = apiKey;
    
    const savedModel = localStorage.getItem("oabt_gemini_model") || "gemini-2.5-flash";
    document.getElementById("model-select").value = savedModel;

    // API Key input change listener
    document.getElementById("api-key-input").addEventListener("change", (e) => {
        localStorage.setItem("oabt_gemini_api_key", e.target.value.trim());
    });

    // Model selection change listener
    document.getElementById("model-select").addEventListener("change", (e) => {
        localStorage.setItem("oabt_gemini_model", e.target.value);
    });
}

// Theme handling
function initTheme() {
    const savedTheme = localStorage.getItem("oabt_theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    document.getElementById("toggle-theme").addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme") || "dark";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", newTheme);
        localStorage.setItem("oabt_theme", newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeBtn = document.getElementById("toggle-theme");
    if (theme === "dark") {
        themeBtn.innerHTML = '<i data-lucide="sun"></i>';
    } else {
        themeBtn.innerHTML = '<i data-lucide="moon"></i>';
    }
    // Re-render lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Setup keyboard
function initKeyboard() {
    if (typeof MathKeyboard !== 'undefined') {
        new MathKeyboard("additional-instructions", "math-keyboard");
    }
}

// Render domains selector
function renderDomains() {
    const container = document.getElementById("domain-tabs");
    container.innerHTML = "";

    Object.keys(KAZANIMLAR_DATA).forEach(domainKey => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `tab-btn ${domainKey === activeDomain ? "active" : ""}`;
        btn.textContent = KAZANIMLAR_DATA[domainKey].title;
        btn.dataset.domain = domainKey;

        btn.addEventListener("click", () => {
            document.querySelectorAll("#domain-tabs .tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            switchDomain(domainKey);
        });

        container.appendChild(btn);
    });
}

// Switch active domain
function switchDomain(domainKey) {
    activeDomain = domainKey;
    selectedTheorems = [];
    
    const domainData = KAZANIMLAR_DATA[domainKey];
    
    // Render sub outcomes
    const outcomesContainer = document.getElementById("sub-outcomes-container");
    outcomesContainer.innerHTML = "";
    
    domainData.kazanimlar.forEach((kazanim, index) => {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "outcome-pill";
        pill.textContent = kazanim.text;
        pill.dataset.id = kazanim.id;
        
        // Select first outcome by default
        if (index === 0) {
            pill.classList.add("active");
            selectedOutcome = kazanim.id;
        }

        pill.addEventListener("click", () => {
            document.querySelectorAll("#sub-outcomes-container .outcome-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            selectedOutcome = kazanim.id;
        });

        outcomesContainer.appendChild(pill);
    });

    // Render theorems
    const theoremsContainer = document.getElementById("theorems-container");
    theoremsContainer.innerHTML = "";
    
    if (domainData.theorems && domainData.theorems.length > 0) {
        domainData.theorems.forEach(theorem => {
            const pill = document.createElement("button");
            pill.type = "button";
            pill.className = "theorem-pill";
            pill.textContent = theorem;
            
            pill.addEventListener("click", () => {
                pill.classList.toggle("active");
                if (pill.classList.contains("active")) {
                    selectedTheorems.push(theorem);
                } else {
                    selectedTheorems = selectedTheorems.filter(t => t !== theorem);
                }
            });

            theoremsContainer.appendChild(pill);
        });
    } else {
        theoremsContainer.innerHTML = "<div class='empty-state' style='padding:10px 0;'>Bu konu için tanımlı teorem yok.</div>";
    }
}

// Setup parameters listeners (Bloom, SOLO, DOK, Difficulty)
function setupParameterListeners() {
    // Difficulty
    document.querySelectorAll(".btn-group[data-param='difficulty'] .selector-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-group[data-param='difficulty'] .selector-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedDifficulty = btn.textContent.trim();
        });
    });

    // Bloom
    document.querySelectorAll(".btn-group[data-param='bloom'] .selector-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-group[data-param='bloom'] .selector-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedBloom = btn.textContent.trim();
        });
    });

    // SOLO
    document.querySelectorAll(".btn-group[data-param='solo'] .selector-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-group[data-param='solo'] .selector-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedSOLO = btn.textContent.trim();
        });
    });

    // DOK
    document.querySelectorAll(".btn-group[data-param='dok'] .selector-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-group[data-param='dok'] .selector-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedDOK = btn.textContent.trim();
        });
    });
}

// Generate question action
async function generateQuestion() {
    const apiKey = localStorage.getItem("oabt_gemini_api_key") || "";
    const model = localStorage.getItem("oabt_gemini_model") || "gemini-2.5-flash";
    const customInstructions = document.getElementById("additional-instructions").value.trim();
    
    // Find active outcome text
    const domainData = KAZANIMLAR_DATA[activeDomain];
    const outcomeObj = domainData.kazanimlar.find(k => k.id === selectedOutcome);
    const kazanimText = outcomeObj ? outcomeObj.text : "";

    const params = {
        domainKey: activeDomain,
        domainTitle: domainData.title,
        kazanimId: selectedOutcome,
        kazanimText: kazanimText,
        difficulty: selectedDifficulty,
        bloom: selectedBloom,
        solo: selectedSOLO,
        dok: selectedDOK,
        theorems: selectedTheorems,
        customInstructions: customInstructions
    };

    // Show loading spinner
    document.getElementById("loading-box").style.display = "flex";
    document.getElementById("results-panel").style.display = "none";
    document.getElementById("empty-results-state").style.display = "none";
    document.getElementById("generate-btn").disabled = true;

    try {
        let questionData = null;
        
        if (apiKey) {
            console.log("Generating with Gemini API...");
            questionData = await generateQuestionWithGemini(apiKey, model, params);
        } else {
            console.log("Generating offline template...");
            // Mimic loading delay for offline generator for natural feel
            await new Promise(resolve => setTimeout(resolve, 1200));
            questionData = generateQuestionOffline(params);
        }

        // Add additional meta
        questionData.id = Date.now().toString();
        questionData.metadata = {
            domainTitle: params.domainTitle,
            domainKey: params.domainKey,
            kazanimText: params.kazanimText,
            difficulty: params.difficulty,
            timestamp: new Date().toLocaleString("tr-TR")
        };

        currentQuestion = questionData;
        
        // Save to history & render
        saveToHistory(questionData);
        renderQuestion(questionData);
        updateHistoryUI();
        updateChart();

        // Switch to the first tab (Question & Options)
        document.querySelector(".analysis-tab-btn[data-tab='question']").click();

        // Scroll to results
        document.getElementById("results-panel").scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        alert("Soru üretilirken hata oluştu: " + err.message + "\n\nİpucu: API anahtarınızın doğru olduğundan ve internet bağlantınızın bulunduğundan emin olun. API anahtarı olmadan yerel şablon modunda soru üretmek için API anahtarı kutusunu boş bırakabilirsiniz.");
        document.getElementById("empty-results-state").style.display = "flex";
    } finally {
        document.getElementById("loading-box").style.display = "none";
        document.getElementById("generate-btn").disabled = false;
    }
}

// Pre-process text to convert LaTeX formatting commands to HTML and fix math symbols
function preprocessText(text) {
    if (!text) return "";
    
    let cleaned = text;
    let last;
    
    // Replace \textbf{something} with <b>something</b>
    const textbfRegex = /\\textbf{([^}]+)}/g;
    do {
        last = cleaned;
        cleaned = cleaned.replace(textbfRegex, '<b>$1</b>');
    } while (cleaned !== last);
    
    // Replace \textit{something} with <i>something</i>
    const textitRegex = /\\textit{([^}]+)}/g;
    do {
        last = cleaned;
        cleaned = cleaned.replace(textitRegex, '<i>$1</i>');
    } while (cleaned !== last);
    
    // Replace \underline{something} with <u>something</u>
    const underlineRegex = /\\underline{([^}]+)}/g;
    do {
        last = cleaned;
        cleaned = cleaned.replace(underlineRegex, '<u>$1</u>');
    } while (cleaned !== last);
    
    // Correct common mathematical symbol typos like \mathbb{Z}^1 to \mathbb{Z}^+
    cleaned = cleaned.replace(/\\mathbb{Z}\^1/g, '\\mathbb{Z}^+');
    cleaned = cleaned.replace(/\\mathbb{Z}\^{1}/g, '\\mathbb{Z}^+');
    
    return cleaned;
}

// Render generated question data to right panel
function renderQuestion(qData) {
    document.getElementById("results-panel").style.display = "grid";
    
    // Set titles
    document.getElementById("q-domain-title").textContent = qData.metadata.domainTitle;
    document.getElementById("q-kazanim-text").textContent = qData.metadata.kazanimText;
    
    // Set Difficulty Badge
    const diffBadge = document.getElementById("q-difficulty-badge");
    diffBadge.textContent = qData.metadata.difficulty;
    diffBadge.className = "history-difficulty " + getDifficultyClass(qData.metadata.difficulty);

    // Set Question Text
    document.getElementById("question-text-content").innerHTML = preprocessText(qData.question);

    // Render options
    const optionsContainer = document.getElementById("options-list");
    optionsContainer.innerHTML = "";
    
    const correctLetter = qData.correct_answer;

    Object.keys(qData.options).forEach(letter => {
        const optionText = qData.options[letter];
        
        const optionDiv = document.createElement("div");
        optionDiv.className = `option-item ${letter === correctLetter ? 'correct' : ''}`;
        
        const badge = document.createElement("span");
        badge.className = "option-badge";
        badge.textContent = letter;
        
        const textSpan = document.createElement("span");
        textSpan.innerHTML = preprocessText(optionText);
        
        optionDiv.appendChild(badge);
        optionDiv.appendChild(textSpan);
        optionsContainer.appendChild(optionDiv);
    });

    // Set Solution Text
    document.getElementById("solution-content").innerHTML = preprocessText(qData.solution);

    // Render Cognitive Badges
    const bloomVal = qData.cognitive_analysis?.bloom_level || selectedBloom;
    const soloVal = qData.cognitive_analysis?.solo_level || selectedSOLO;
    const dokVal = qData.cognitive_analysis?.dok_level || selectedDOK;

    document.getElementById("bloom-badge").innerHTML = `<i data-lucide="brain"></i> Bloom: ${bloomVal}`;
    document.getElementById("solo-badge").innerHTML = `<i data-lucide="layers"></i> SOLO: ${soloVal}`;
    document.getElementById("dok-badge").innerHTML = `<i data-lucide="line-chart"></i> DOK: ${dokVal}`;

    // Render Theorems used
    const theoremsList = document.getElementById("theorems-used-list");
    theoremsList.innerHTML = "";
    const theorems = qData.cognitive_analysis?.theorems_used || [];
    if (theorems.length > 0) {
        theorems.forEach(t => {
            const li = document.createElement("li");
            li.textContent = t;
            theoremsList.appendChild(li);
        });
    } else {
        theoremsList.innerHTML = "<li>Herhangi bir teorem belirtilmemiş.</li>";
    }

    // Render targeted misconceptions
    const misconceptionsList = document.getElementById("misconceptions-list");
    misconceptionsList.innerHTML = "";
    const misconceptions = qData.cognitive_analysis?.misconceptions_targeted || [];
    if (misconceptions.length > 0) {
        misconceptions.forEach(m => {
            const li = document.createElement("li");
            li.textContent = m;
            misconceptionsList.appendChild(li);
        });
    } else {
        misconceptionsList.innerHTML = "<li>Genel işlemsel hatalar hedeflenmiştir.</li>";
    }

    // Originality Rationale
    document.getElementById("originality-text").innerHTML = qData.cognitive_analysis?.originality_rationale || "Bu soru kavramsal bağıntıları ölçmek amacıyla tasarlanmıştır.";

    // Render Math Equations with KaTeX
    try {
        renderMathInElement(document.getElementById("results-panel"), {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ],
            throwOnError: false
        });
    } catch (e) {
        console.error("KaTeX AutoRender Error:", e);
    }

    // Update Test Pool Button State for this question
    updateTestToggleBtnState(qData.id);

    // Re-render Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Copy LaTeX to Clipboard
function copyLatexToClipboard() {
    if (!currentQuestion) return;

    let latexCode = `% --- ÖABT MATEMATİK ÖZGÜN SORU --- \n`;
    latexCode += `% Alan: ${currentQuestion.metadata.domainTitle}\n`;
    latexCode += `% Kazanım: ${currentQuestion.metadata.kazanimText}\n`;
    latexCode += `% Bilişsel Seviye: Bloom: ${currentQuestion.cognitive_analysis?.bloom_level} | SOLO: ${currentQuestion.cognitive_analysis?.solo_level}\n\n`;
    
    latexCode += `\\question\n`;
    latexCode += `${cleanLatexDelimiters(currentQuestion.question)}\n\n`;
    
    latexCode += `\\begin{choices}\n`;
    Object.keys(currentQuestion.options).forEach(letter => {
        latexCode += `  \\choice ${cleanLatexDelimiters(currentQuestion.options[letter])}\n`;
    });
    latexCode += `\\end{choices}\n\n`;
    
    latexCode += `\\begin{solution}\n`;
    latexCode += `${cleanLatexDelimiters(currentQuestion.solution)}\n`;
    latexCode += `\\end{solution}\n`;

    navigator.clipboard.writeText(latexCode).then(() => {
        alert("LaTeX kodu panoya kopyalandı! LaTeX editörünüze doğrudan yapıştırabilirsiniz.");
    }).catch(err => {
        alert("Kopyalanamadı: " + err);
    });
}

function cleanLatexDelimiters(text) {
    // Replaces HTML line breaks with newlines and converts backslash escapes
    return text.replace(/<br>/gi, "\n").replace(/<br\/>/gi, "\n").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

// Local Storage History Management
function loadHistory() {
    try {
        const stored = localStorage.getItem("oabt_question_history");
        questionHistory = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error(e);
        questionHistory = [];
    }
}

function saveToHistory(qData) {
    // Avoid duplicates in history
    const exists = questionHistory.some(q => q.id === qData.id);
    if (!exists) {
        questionHistory.unshift(qData);
        // Limit history to 20 items
        if (questionHistory.length > 20) {
            questionHistory.pop();
        }
        localStorage.setItem("oabt_question_history", JSON.stringify(questionHistory));
    }
}

function clearHistory() {
    if (confirm("Tüm soru geçmişini silmek istediğinize emin misiniz?")) {
        questionHistory = [];
        localStorage.removeItem("oabt_question_history");
        updateHistoryUI();
        updateChart();
        document.getElementById("results-panel").style.display = "none";
        document.getElementById("empty-results-state").style.display = "flex";
    }
}

// Clean LaTeX commands and translate them to readable Unicode symbols for sidebar previews
function cleanLatexForPreview(text) {
    if (!text) return "";
    
    let clean = text;
    
    // First, strip HTML tags
    clean = clean.replace(/<[^>]*>/g, '');
    
    // Translate fractions \frac{A}{B} to A/B
    const fracRegex = /\\frac{([^}]+)}{([^}]+)}/g;
    while (fracRegex.test(clean)) {
        clean = clean.replace(fracRegex, '$1/$2');
    }
    
    // Translate formatting
    clean = clean.replace(/\\textbf{([^}]+)}/g, '$1');
    clean = clean.replace(/\\textit{([^}]+)}/g, '$1');
    clean = clean.replace(/\\underline{([^}]+)}/g, '$1');
    clean = clean.replace(/\\text{([^}]+)}/g, '$1');
    
    // Common mathematical sets
    clean = clean.replace(/\\mathbb{R}/g, 'ℝ');
    clean = clean.replace(/\\mathbb{Z}/g, 'ℤ');
    clean = clean.replace(/\\mathbb{N}/g, 'ℕ');
    clean = clean.replace(/\\mathbb{Q}/g, 'ℚ');
    clean = clean.replace(/\\mathbb{C}/g, 'ℂ');
    
    // Greek letters
    clean = clean.replace(/\\alpha/g, 'α');
    clean = clean.replace(/\\beta/g, 'β');
    clean = clean.replace(/\\theta/g, 'θ');
    clean = clean.replace(/\\lambda/g, 'λ');
    clean = clean.replace(/\\mu/g, 'μ');
    clean = clean.replace(/\\sigma/g, 'σ');
    clean = clean.replace(/\\pi/g, 'π');
    
    // Mathematical symbols and relations
    clean = clean.replace(/\\ge/g, '≥');
    clean = clean.replace(/\\geq/g, '≥');
    clean = clean.replace(/\\le/g, '≤');
    clean = clean.replace(/\\leq/g, '≤');
    clean = clean.replace(/\\to/g, '→');
    clean = clean.replace(/\\rightarrow/g, '→');
    clean = clean.replace(/\\in/g, '∈');
    clean = clean.replace(/\\notin/g, '∉');
    clean = clean.replace(/\\subset/g, '⊂');
    clean = clean.replace(/\\cup/g, '∪');
    clean = clean.replace(/\\cap/g, '∩');
    clean = clean.replace(/\\emptyset/g, '∅');
    clean = clean.replace(/\\infty/g, '∞');
    clean = clean.replace(/\\partial/g, '∂');
    clean = clean.replace(/\\nabla/g, '∇');
    clean = clean.replace(/\\pm/g, '±');
    clean = clean.replace(/\\times/g, '×');

    // Unicode character maps for super/subscripts
    const superscripts = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
        'n': 'ⁿ', 'i': 'ⁱ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ', 'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
        'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ',
        's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ'
    };

    const subscripts = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
        'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
        'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ'
    };

    const mapToUnicode = (str, map) => {
        return str.split('').map(char => map[char] || char).join('');
    };

    // Replace superscripts with braces, e.g. x^{n+1} -> xⁿ⁺¹
    clean = clean.replace(/\^{([^}]+)}/g, (match, p1) => mapToUnicode(p1, superscripts));
    // Replace superscripts without braces, e.g. x^2 -> x²
    clean = clean.replace(/\^([a-zA-Z0-9+\-])/g, (match, p1) => mapToUnicode(p1, superscripts));

    // Replace subscripts with braces, e.g. S_{n} -> Sₙ
    clean = clean.replace(/_{([^}]+)}/g, (match, p1) => mapToUnicode(p1, subscripts));
    // Replace subscripts without braces, e.g. S_n -> Sₙ
    clean = clean.replace(/_([a-zA-Z0-9+\-])/g, (match, p1) => mapToUnicode(p1, subscripts));

    // Remove leftover backslashes and dollar signs
    clean = clean.replace(/\\/g, '');
    clean = clean.replace(/\$/g, '');
    
    // Remove extra whitespaces
    clean = clean.replace(/\s+/g, ' ').trim();
    
    return clean;
}

// Update History Sidebar list
function updateHistoryUI() {
    const list = document.getElementById("history-list");
    list.innerHTML = "";

    if (questionHistory.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i data-lucide="history"></i>
                <span>Geçmişte oluşturulan soru bulunamadı.</span>
            </div>`;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }

    questionHistory.forEach(q => {
        const item = document.createElement("div");
        item.className = "history-item";
        
        // Clean and translate math symbols for a clean Unicode-based preview text
        const cleanPreview = cleanLatexForPreview(q.question).substring(0, 45) + "...";

        item.innerHTML = `
            <div class="history-item-header">
                <span class="history-domain">${q.metadata.domainTitle}</span>
                <span class="history-difficulty ${getDifficultyClass(q.metadata.difficulty)}">${q.metadata.difficulty}</span>
            </div>
            <div class="history-preview">${cleanPreview}</div>
        `;

        item.addEventListener("click", () => {
            currentQuestion = q;
            renderQuestion(q);
            // Switch to question tab
            document.querySelector(".analysis-tab-btn[data-tab='question']").click();
            document.getElementById("results-panel").scrollIntoView({ behavior: 'smooth' });
        });

        list.appendChild(item);
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Helper classes
function getDifficultyClass(difficulty) {
    if (difficulty === "Kolay") return "easy";
    if (difficulty === "Zor") return "hard";
    return "medium";
}

// Chart.js - Update distribution chart
function updateChart() {
    const canvas = document.getElementById("cognitive-chart");
    if (!canvas) return;

    // Count distributions of Bloom levels in history
    const counts = {
        "Bilgi": 0,
        "Kavrama": 0,
        "Uygulama": 0,
        "Analiz": 0,
        "Değerlendirme": 0,
        "Yaratma": 0
    };

    questionHistory.forEach(q => {
        const level = q.cognitive_analysis?.bloom_level || "";
        Object.keys(counts).forEach(key => {
            if (level.includes(key)) {
                counts[key]++;
            }
        });
    });

    const chartData = Object.values(counts);
    const labels = Object.keys(counts);

    if (cognitiveChart) {
        cognitiveChart.data.datasets[0].data = chartData;
        cognitiveChart.update();
    } else {
        const ctx = canvas.getContext('2d');
        cognitiveChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Soru Dağılımı (Bloom)',
                    data: chartData,
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    borderColor: 'rgba(168, 85, 247, 0.8)',
                    borderWidth: 2,
                    pointBackgroundColor: '#06b6d4',
                    pointBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: {
                            color: '#a39eb9',
                            font: { size: 10, family: 'Inter' }
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: '#6e6988',
                            font: { size: 9 },
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

// ==================== TEST BUILDER FEATURES ====================

// Load Test Pool from localStorage
function loadTestPool() {
    try {
        const stored = localStorage.getItem("oabt_test_pool");
        testPool = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error(e);
        testPool = [];
    }
}

// Add or Remove Question from Test Pool
function toggleTestQuestion() {
    if (!currentQuestion) return;
    
    const idx = testPool.findIndex(q => q.id === currentQuestion.id);
    if (idx !== -1) {
        // Remove
        testPool.splice(idx, 1);
    } else {
        // Add
        testPool.push(currentQuestion);
    }
    
    // Save to localStorage
    localStorage.setItem("oabt_test_pool", JSON.stringify(testPool));
    
    // Update UIs
    updateTestToggleBtnState(currentQuestion.id);
    updateTestPoolUI();
}

// Update the label and styling of the "Teste Ekle / Çıkar" button
function updateTestToggleBtnState(qId) {
    const btn = document.getElementById("btn-toggle-test");
    if (!btn) return;
    
    const isInPool = testPool.some(q => q.id === qId);
    
    if (isInPool) {
        btn.innerHTML = `<i data-lucide="minus-circle"></i> Testten Çıkar`;
        btn.classList.add("primary"); // makes it colored/active
    } else {
        btn.innerHTML = `<i data-lucide="plus-circle"></i> Teste Ekle`;
        btn.classList.remove("primary");
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Update the Test Pool Sidebar UI list
function updateTestPoolUI() {
    const list = document.getElementById("test-pool-list");
    const countBadge = document.getElementById("test-pool-count");
    
    if (!list || !countBadge) return;
    
    countBadge.textContent = `${testPool.length} Soru`;
    list.innerHTML = "";
    
    // Enable/Disable action buttons
    const hasQuestions = testPool.length > 0;
    document.getElementById("btn-print-test-student").disabled = !hasQuestions;
    document.getElementById("btn-print-test-teacher").disabled = !hasQuestions;
    document.getElementById("btn-solve-test-online").disabled = !hasQuestions;
    document.getElementById("btn-export-test-latex").disabled = !hasQuestions;
    
    if (testPool.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="padding: 20px 10px;">
                <i data-lucide="folder-plus"></i>
                <span>Henüz teste soru eklenmedi. Soruların altındaki 'Teste Ekle' butonunu kullanın.</span>
            </div>`;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }
    
    testPool.forEach(q => {
        const item = document.createElement("div");
        item.className = "history-item";
        item.style.position = "relative";
        item.style.paddingRight = "35px";
        
        const cleanPreview = cleanLatexForPreview(q.question).substring(0, 35) + "...";
        
        item.innerHTML = `
            <div class="history-item-header">
                <span class="history-domain">${q.metadata.domainTitle}</span>
                <span class="history-difficulty ${getDifficultyClass(q.metadata.difficulty)}">${q.metadata.difficulty}</span>
            </div>
            <div class="history-preview">${cleanPreview}</div>
            <button class="toggle-theme-btn" title="Testten Çıkar" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--color-danger);">
                <i data-lucide="x-circle"></i>
            </button>
        `;
        
        // Remove button click
        item.querySelector("button").addEventListener("click", (e) => {
            e.stopPropagation();
            testPool = testPool.filter(qp => qp.id !== q.id);
            localStorage.setItem("oabt_test_pool", JSON.stringify(testPool));
            updateTestPoolUI();
            if (currentQuestion && currentQuestion.id === q.id) {
                updateTestToggleBtnState(q.id);
            }
        });
        
        // Click item to view question
        item.addEventListener("click", () => {
            currentQuestion = q;
            renderQuestion(q);
            document.querySelector(".analysis-tab-btn[data-tab='question']").click();
            document.getElementById("results-panel").scrollIntoView({ behavior: 'smooth' });
        });
        
        list.appendChild(item);
    });
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// LaTeX sanitation utility
function sanitizeForLatex(text) {
    if (!text) return "";
    let clean = text;
    
    // Replace <br> and <br/> with double newlines
    clean = clean.replace(/<br\s*\/?>/gi, "\n\n");
    
    // Clean common HTML tags to LaTeX formatting
    clean = clean.replace(/<b>([^<]+)<\/b>/g, '\\textbf{$1}');
    clean = clean.replace(/<strong>([^<]+)<\/strong>/g, '\\textbf{$1}');
    clean = clean.replace(/<i>([^<]+)<\/i>/g, '\\textit{$1}');
    clean = clean.replace(/<em>([^<]+)<\/em>/g, '\\textit{$1}');
    clean = clean.replace(/<u>([^<]+)<\/u>/g, '\\underline{$1}');
    
    // Resolve HTML entities
    clean = clean.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    
    return clean;
}

// Consolidated Export to LaTeX Document
function exportTestToLatex() {
    if (testPool.length === 0) return;
    
    let latexCode = `% ====================================================\n`;
    latexCode += `%   ÖABT MATEMATİK ÖZGÜN DENEME SINAVI KITAPÇIĞI\n`;
    latexCode += `%   Soru Sayısı: ${testPool.length}\n`;
    latexCode += `%   Tarih: ${new Date().toLocaleDateString('tr-TR')}\n`;
    latexCode += `% ====================================================\n\n`;
    
    latexCode += `\\documentclass[11pt,a4paper]{exam}\n`;
    latexCode += `\\usepackage[utf8]{inputenc}\n`;
    latexCode += `\\usepackage[turkish]{babel}\n`;
    latexCode += `\\usepackage{amsmath,amssymb,amsfonts}\n`;
    latexCode += `\\usepackage{geometry}\n`;
    latexCode += `\\geometry{a4paper, margin=1in}\n\n`;
    
    latexCode += `\\qformat{\\textbf{Soru \\thequestion} \\hfill [\\textbf{\\thepoints} Puan]}\n`;
    latexCode += `\\renewcommand{\\solutiontitle}{\\noindent\\textbf{Çözüm:}\\enspace}\n`;
    latexCode += `\\printanswers % Çözümleri yazdırmak için aktif bırakın, öğrenci için kapatın (yorum satırı yapın)\n\n`;
    
    latexCode += `\\title{ÖABT Matematik Özgün Deneme Sınavı}\n`;
    latexCode += `\\author{Matematik Soru Tasarım ve Analiz Laboratuvarı}\n`;
    latexCode += `\\date{${new Date().toLocaleDateString('tr-TR')}}\n\n`;
    
    latexCode += `\\begin{document}\n`;
    latexCode += `\\maketitle\n\n`;
    
    latexCode += `\\begin{questions}\n\n`;
    
    testPool.forEach((q, index) => {
        latexCode += `\\question[10] % Her soru 10 puan\n`;
        latexCode += `% Alan: ${q.metadata.domainTitle} - Kazanım: ${q.metadata.kazanimText}\n`;
        latexCode += `${sanitizeForLatex(q.question)}\n\n`;
        
        latexCode += `\\begin{choices}\n`;
        Object.keys(q.options).forEach(letter => {
            const prefix = (letter === q.correct_answer) ? `\\CorrectChoice ` : `\\choice `;
            latexCode += `  ${prefix} ${sanitizeForLatex(q.options[letter])}\n`;
        });
        latexCode += `\\end{choices}\n\n`;
        
        latexCode += `\\begin{solution}\n`;
        latexCode += `${sanitizeForLatex(q.solution)}\n`;
        latexCode += `\\end{solution}\n\n`;
        latexCode += `\\vspace{1cm}\n\n`;
    });
    
    latexCode += `\\end{questions}\n`;
    latexCode += `\\end{document}\n`;
    
    navigator.clipboard.writeText(latexCode).then(() => {
        alert(`${testPool.length} sorudan oluşan toplu LaTeX sınav kitapçığı kodu panoya kopyalandı! Overleaf veya yerel LaTeX editörünüzde derleyebilirsiniz.`);
    }).catch(err => {
        alert("Toplu LaTeX kopyalanamadı: " + err);
    });
}

// Generate & Print HTML Booklet (Student or Teacher mode)
function printTest(mode) {
    if (testPool.length === 0) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Pop-up engelleyiciyi devre dışı bırakın.");
        return;
    }
    
    let questionsHtml = "";
    let solutionsHtml = "";
    
    testPool.forEach((q, index) => {
        questionsHtml += `
            <div class="print-question" style="page-break-inside: avoid; margin-bottom: 40px; border-bottom: 1px dashed #eee; padding-bottom: 20px;">
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px; color: #111;">
                    Soru ${index + 1}. <span style="font-weight: normal; font-size: 11px; color: #666; margin-left: 10px;">[${q.metadata.domainTitle} | Zorluk: ${q.metadata.difficulty}]</span>
                </div>
                <div style="margin-bottom: 20px; font-size: 14.5px; line-height: 1.7;">
                    ${q.question}
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-left: 15px; margin-bottom: 10px;">
        `;
        
        Object.keys(q.options).forEach(letter => {
            const isCorrect = letter === q.correct_answer;
            const highlightStyle = (mode === 'teacher' && isCorrect) ? 'font-weight: bold; background: #e6f7ed; border-color: #10b981;' : '';
            questionsHtml += `
                <div style="display: flex; align-items: center; gap: 10px; padding: 8px 14px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13.5px; ${highlightStyle}">
                    <span style="font-weight: bold; color: #4a5568;">${letter})</span>
                    <span>${q.options[letter]}</span>
                </div>
            `;
        });
        
        questionsHtml += `
                </div>
            </div>
        `;
        
        solutionsHtml += `
            <div style="page-break-inside: avoid; margin-bottom: 30px; border-left: 4px solid #a855f7; padding-left: 18px;">
                <div style="font-weight: bold; font-size: 15px; margin-bottom: 10px; color: #7e22ce;">Soru ${index + 1} Çözümü (Doğru Cevap: ${q.correct_answer})</div>
                <div style="font-size: 13.5px; line-height: 1.7; color: #2d3748;">${q.solution}</div>
            </div>
        `;
    });
    
    let answerGridHtml = "";
    if (mode === 'student') {
        answerGridHtml = `
            <div class="page-break" style="margin-top: 50px; page-break-inside: avoid;">
                <h3 style="border-bottom: 2px solid #2d3748; padding-bottom: 6px; margin-bottom: 18px; font-family: 'Outfit', sans-serif; font-size: 18px; color: #1a202c;">Cevap Anahtarı Formu</h3>
                <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 13px;">
                    <thead>
                        <tr style="background: #edf2f7; color: #2d3748;">
                            <th style="border: 1px solid #cbd5e0; padding: 10px; font-weight: 600;">Soru No</th>
                            <th style="border: 1px solid #cbd5e0; padding: 10px; font-weight: 600;" colspan="5">Cevap Seçenekleri</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        testPool.forEach((q, index) => {
            answerGridHtml += `
                <tr>
                    <td style="border: 1px solid #cbd5e0; padding: 10px; font-weight: bold; background: #f7fafc;">${index + 1}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 10px; width: 16%; color: #a0aec0; font-weight: 600;">[ A ]</td>
                    <td style="border: 1px solid #cbd5e0; padding: 10px; width: 16%; color: #a0aec0; font-weight: 600;">[ B ]</td>
                    <td style="border: 1px solid #cbd5e0; padding: 10px; width: 16%; color: #a0aec0; font-weight: 600;">[ C ]</td>
                    <td style="border: 1px solid #cbd5e0; padding: 10px; width: 16%; color: #a0aec0; font-weight: 600;">[ D ]</td>
                    <td style="border: 1px solid #cbd5e0; padding: 10px; width: 16%; color: #a0aec0; font-weight: 600;">[ E ]</td>
                </tr>
            `;
        });
        answerGridHtml += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    const bookletTitle = mode === 'student' ? 'Öğrenci Kitapçığı' : 'Öğretmen Kitapçığı (Cevap Anahtarlı)';
    
    // Build solutions portion if teacher mode
    let solutionsSectionHtml = "";
    if (mode === 'teacher') {
        solutionsSectionHtml = `
            <div class="page-break" style="margin-top: 50px;">
                <h2 style="border-bottom: 2px solid #7e22ce; padding-bottom: 6px; color: #7e22ce; margin-bottom: 25px; font-family: 'Outfit', sans-serif; font-size: 22px;">Soru Çözümleri & Detaylı Analiz Raporları</h2>
                ` + solutionsHtml + `
            </div>
        `;
    }
    
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <title>${bookletTitle} - ÖABT Sınavı</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
            <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    color: #2d3748;
                    padding: 50px;
                    max-width: 850px;
                    margin: 0 auto;
                    line-height: 1.6;
                }
                .test-header {
                    text-align: center;
                    border-bottom: 3px double #2d3748;
                    padding-bottom: 25px;
                    margin-bottom: 45px;
                }
                .test-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 28px;
                    margin: 0 0 8px 0;
                    color: #1a202c;
                    letter-spacing: -0.5px;
                }
                .test-subtitle {
                    font-size: 15px;
                    color: #4a5568;
                    margin: 0;
                    font-weight: 500;
                }
                @media print {
                    body { padding: 0; }
                    .page-break { page-break-before: always; }
                    .print-question { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="test-header">
                <h1 class="test-title">ÖABT Matematik Özgün Deneme Sınavı</h1>
                <p class="test-subtitle">${bookletTitle} | Toplam Soru: ${testPool.length}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 13px; color: #4a5568; border-top: 1px dashed #cbd5e0; padding-top: 12px;">
                    <span>Aday Adı Soyadı: ................................................................</span>
                    <span>Tarih: ${new Date().toLocaleDateString('tr-TR')}</span>
                </div>
            </div>
            
            <div class="questions-section">
                ${questionsHtml}
            </div>
            
            ${answerGridHtml}
            
            ${solutionsSectionHtml}
            
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    renderMathInElement(document.body, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true},
                            {left: "$", right: "$", display: false}
                        ],
                        throwOnError: false
                    });
                    
                    // Trigger print after rendering
                    setTimeout(function() {
                        window.print();
                    }, 600);
                });
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}

// ==================== ONLINE TEST SOLVER FUNCTIONS ====================

// Start Online Test Solver Session
function startTestSolver() {
    if (testPool.length === 0) return;
    
    // Reset state
    solverAnswers = {};
    solverActiveIndex = 0;
    solverSeconds = 0;
    
    // Hide results card if open
    document.getElementById("solver-results-overlay").style.display = "none";
    
    // Show Modal
    const modal = document.getElementById("test-solver-modal");
    modal.style.display = "flex";
    
    // Start Timer
    document.getElementById("solver-timer-text").textContent = "00:00";
    if (solverTimerInterval) clearInterval(solverTimerInterval);
    solverTimerInterval = setInterval(() => {
        solverSeconds++;
        const mins = String(Math.floor(solverSeconds / 60)).padStart(2, "0");
        const secs = String(solverSeconds % 60).padStart(2, "0");
        document.getElementById("solver-timer-text").textContent = `${mins}:${secs}`;
    }, 1000);
    
    // Render
    renderSolverQuestion(0);
    renderSolverNavGrid();
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Close/Exit Solver Session
function closeTestSolver() {
    // Stop Timer
    if (solverTimerInterval) {
        clearInterval(solverTimerInterval);
        solverTimerInterval = null;
    }
    
    // Hide Modal
    document.getElementById("test-solver-modal").style.display = "none";
}

// Render active solver question
function renderSolverQuestion(index) {
    if (index < 0 || index >= testPool.length) return;
    
    solverActiveIndex = index;
    const q = testPool[index];
    
    // Update progress text
    document.getElementById("solver-progress").textContent = `Soru ${index + 1} / ${testPool.length}`;
    
    // Render question text
    document.getElementById("solver-q-text").innerHTML = preprocessText(q.question);
    
    // Render options
    const optionsContainer = document.getElementById("solver-options-list");
    optionsContainer.innerHTML = "";
    
    Object.keys(q.options).forEach(letter => {
        const optionText = q.options[letter];
        
        const optionDiv = document.createElement("div");
        optionDiv.className = "solver-option-item";
        if (solverAnswers[q.id] === letter) {
            optionDiv.classList.add("selected");
        }
        
        const badge = document.createElement("span");
        badge.className = "option-badge";
        badge.textContent = letter;
        
        const textSpan = document.createElement("span");
        textSpan.innerHTML = preprocessText(optionText);
        
        optionDiv.appendChild(badge);
        optionDiv.appendChild(textSpan);
        
        // Option selection listener
        optionDiv.addEventListener("click", () => {
            // Select or Toggle Answer
            if (solverAnswers[q.id] === letter) {
                delete solverAnswers[q.id];
                optionDiv.classList.remove("selected");
            } else {
                solverAnswers[q.id] = letter;
                // Remove selected class from other options
                Array.from(optionsContainer.children).forEach(child => child.classList.remove("selected"));
                optionDiv.classList.add("selected");
            }
            
            // Re-render nav grid to update answering indicators
            renderSolverNavGrid();
        });
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update navigation button states
    document.getElementById("btn-solver-prev").disabled = (index === 0);
    document.getElementById("btn-solver-next").disabled = (index === testPool.length - 1);
    
    // Render Math Equations with KaTeX
    try {
        renderMathInElement(document.getElementById("solver-q-text"), {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ],
            throwOnError: false
        });
        renderMathInElement(optionsContainer, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ],
            throwOnError: false
        });
    } catch (e) {
        console.error("KaTeX AutoRender Error in solver:", e);
    }
    
    // Re-render nav grid to highlight active
    updateSolverNavActive();
}

// Render navigation selector grid
function renderSolverNavGrid() {
    const grid = document.getElementById("solver-nav-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    testPool.forEach((q, index) => {
        const btn = document.createElement("button");
        btn.className = "nav-dot";
        btn.textContent = index + 1;
        
        if (index === solverActiveIndex) {
            btn.classList.add("active");
        }
        
        if (solverAnswers[q.id]) {
            btn.classList.add("answered");
        }
        
        btn.addEventListener("click", () => {
            renderSolverQuestion(index);
        });
        
        grid.appendChild(btn);
    });
}

// Update the active state highlight in navigation grid
function updateSolverNavActive() {
    const grid = document.getElementById("solver-nav-grid");
    if (!grid) return;
    
    Array.from(grid.children).forEach((child, index) => {
        if (index === solverActiveIndex) {
            child.classList.add("active");
        } else {
            child.classList.remove("active");
        }
    });
}

// Previous Question in Solver
function solverPrevQuestion() {
    if (solverActiveIndex > 0) {
        renderSolverQuestion(solverActiveIndex - 1);
    }
}

// Next Question in Solver
function solverNextQuestion() {
    if (solverActiveIndex < testPool.length - 1) {
        renderSolverQuestion(solverActiveIndex + 1);
    }
}

// Finish Solver Session and Compute Scores
function finishTestSolver() {
    if (testPool.length === 0) return;
    
    // Stop Timer
    if (solverTimerInterval) {
        clearInterval(solverTimerInterval);
        solverTimerInterval = null;
    }
    
    let correctCount = 0;
    let incorrectCount = 0;
    let blankCount = 0;
    
    const reviewList = document.getElementById("results-review-list");
    reviewList.innerHTML = "";
    
    testPool.forEach((q, index) => {
        const userAnswer = solverAnswers[q.id];
        const correctAnswer = q.correct_answer;
        
        let statusClass = "blank";
        let statusText = "Boş Bırakıldı";
        
        if (userAnswer) {
            if (userAnswer === correctAnswer) {
                correctCount++;
                statusClass = "correct";
                statusText = "Doğru";
            } else {
                incorrectCount++;
                statusClass = "incorrect";
                statusText = `Yanlış (Cevabınız: ${userAnswer}, Doğru: ${correctAnswer})`;
            }
        } else {
            blankCount++;
        }
        
        // Add detailed collapsible review item
        const reviewItem = document.createElement("div");
        reviewItem.className = "review-q-card";
        
        const qPreview = cleanLatexForPreview(q.question).substring(0, 50) + "...";
        
        reviewItem.innerHTML = `
            <div class="review-q-header">
                <span style="font-weight:bold;color:white;">Soru ${index + 1} (${q.metadata.domainTitle})</span>
                <span class="review-badge ${statusClass}">${statusText}</span>
            </div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
                ${qPreview}
            </div>
            <details style="margin-top:6px;font-size:12.5px;">
                <summary style="cursor:pointer;color:var(--color-secondary);font-weight:600;outline:none;">Çözümü Göster</summary>
                <div style="margin-top:8px;padding:8px 12px;background:rgba(255,255,255,0.02);border-radius:6px;border-left:2px solid var(--color-primary);line-height:1.6;color:var(--text-primary);">
                    <div style="margin-bottom:8px;font-weight:bold;">Doğru Seçenek: ${correctAnswer}</div>
                    ${q.solution}
                </div>
            </details>
        `;
        
        reviewList.appendChild(reviewItem);
    });
    
    // Update Scorecard
    document.getElementById("results-correct").textContent = correctCount;
    document.getElementById("results-incorrect").textContent = incorrectCount;
    document.getElementById("results-blank").textContent = blankCount;
    
    // Render KaTeX for review solutions
    try {
        renderMathInElement(reviewList, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ],
            throwOnError: false
        });
    } catch (e) {
        console.error("KaTeX AutoRender Error in review:", e);
    }
    
    // Show Results overlay
    document.getElementById("solver-results-overlay").style.display = "block";
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
