const MATH_KEYBOARD_LAYOUT = {
    semboller: {
        title: "Temel Semboller",
        keys: [
            { label: "π", code: "\\pi " },
            { label: "θ", code: "\\theta " },
            { label: "α", code: "\\alpha " },
            { label: "β", code: "\\beta " },
            { label: "λ", code: "\\lambda " },
            { label: "μ", code: "\\mu " },
            { label: "σ", code: "\\sigma " },
            { label: "∞", code: "\\infty " },
            { label: "→", code: "\\to " },
            { label: "∂", code: "\\partial " },
            { label: "∇", code: "\\nabla " },
            { label: "∀", code: "\\forall " },
            { label: "∃", code: "\\exists " },
            { label: "∈", code: "\\in " },
            { label: "∉", code: "\\notin " },
            { label: "∩", code: "\\cap " },
            { label: "∪", code: "\\cup " },
            { label: "⊂", code: "\\subset " },
            { label: "∅", code: "\\emptyset " },
            { label: "±", code: "\\pm " }
        ]
    },
    kalkulus: {
        title: "Kalkülüs",
        keys: [
            { label: "lim", code: "\\lim_{x \\to 0} " },
            { label: "d/dx", code: "\\frac{d}{dx} " },
            { label: "∫", code: "\\int " },
            { label: "∫_a^b", code: "\\int_{a}^{b} " },
            { label: "∑", code: "\\sum_{i=1}^{n} " },
            { label: "∑_∞", code: "\\sum_{n=1}^{\\infty} " },
            { label: "∏", code: "\\prod_{i=1}^{n} " },
            { label: "Kısmi Türev", code: "\\frac{\\partial f}{\\partial x} " },
            { label: "Çift Katlı İntegral", code: "\\iint_{R} " },
            { label: "Üç Katlı İntegral", code: "\\iiint_{V} " }
        ]
    },
    cebir: {
        title: "Cebir & Matris",
        keys: [
            { label: "ℝ (Reel)", code: "\\mathbb{R} " },
            { label: "ℤ (Tam)", code: "\\mathbb{Z} " },
            { label: "ℕ (Doğal)", code: "\\mathbb{N} " },
            { label: "ℂ (Karmaşık)", code: "\\mathbb{C} " },
            { label: "ℚ (Rasyonel)", code: "\\mathbb{Q} " },
            { label: "2x2 Matris", code: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} " },
            { label: "det(A)", code: "\\det(A) " },
            { label: "⊕ (Direkt Toplam)", code: "\\oplus " },
            { label: "⊗ (Tensör)", code: "\\otimes " },
            { label: "≅ (İzomorf)", code: "\\cong " },
            { label: "EBOB", code: "\\gcd(a, b) " },
            { label: "Vektör v", code: "\\vec{v} " }
        ]
    },
    format: {
        title: "Biçimlendirme",
        keys: [
            { label: "Satır İçi Formül", code: "$...$", wrap: true },
            { label: "Blok Formül", code: "$$...$$", wrap: true },
            { label: "Kesir (a/b)", code: "\\frac{a}{b} " },
            { label: "Kök (√x)", code: "\\sqrt{x} " },
            { label: "Kök (ⁿ√x)", code: "\\sqrt[n]{x} " },
            { label: "Üs (xⁿ)", code: "x^{n} " },
            { label: "Alt İndis (xᵢ)", code: "x_{i} " },
            { label: "Metin Kutusu", code: "\\text{metin} " },
            { label: "Kalın (Bold)", code: "\\mathbf{x} " },
            { label: "Boşluk (Space)", code: "\\, " }
        ]
    }
};

class MathKeyboard {
    constructor(targetInputId, keyboardContainerId) {
        this.targetInput = document.getElementById(targetInputId);
        this.container = document.getElementById(keyboardContainerId);
        this.activeTab = 'semboller';
        
        if (this.targetInput && this.container) {
            this.init();
        }
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = '';
        this.container.className = 'math-keyboard-wrapper';

        // Render Tabs Header
        const tabHeader = document.createElement('div');
        tabHeader.className = 'keyboard-tab-header';
        
        Object.keys(MATH_KEYBOARD_LAYOUT).forEach(tabKey => {
            const tabBtn = document.createElement('button');
            tabBtn.type = 'button';
            tabBtn.className = `keyboard-tab-btn ${tabKey === this.activeTab ? 'active' : ''}`;
            tabBtn.textContent = MATH_KEYBOARD_LAYOUT[tabKey].title;
            tabBtn.dataset.tab = tabKey;
            tabHeader.appendChild(tabBtn);
        });

        this.container.appendChild(tabHeader);

        // Render Keys Area
        const keysArea = document.createElement('div');
        keysArea.className = 'keyboard-keys-area';

        const currentLayout = MATH_KEYBOARD_LAYOUT[this.activeTab];
        currentLayout.keys.forEach(key => {
            const keyBtn = document.createElement('button');
            keyBtn.type = 'button';
            keyBtn.className = 'keyboard-key';
            keyBtn.textContent = key.label;
            keyBtn.title = key.code;
            
            keyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.insertCode(key);
            });

            keysArea.appendChild(keyBtn);
        });

        this.container.appendChild(keysArea);
    }

    bindEvents() {
        // Tab switching
        this.container.addEventListener('click', (e) => {
            const tabBtn = e.target.closest('.keyboard-tab-btn');
            if (tabBtn) {
                this.activeTab = tabBtn.dataset.tab;
                this.render();
            }
        });
    }

    insertCode(key) {
        if (!this.targetInput) return;

        const startPos = this.targetInput.selectionStart;
        const endPos = this.targetInput.selectionEnd;
        const text = this.targetInput.value;

        let codeToInsert = key.code;
        let newCursorPos = startPos;

        if (key.wrap) {
            const selectedText = text.substring(startPos, endPos);
            if (key.code === "$...$") {
                codeToInsert = `$${selectedText || ' '}$`;
                newCursorPos = startPos + 1 + (selectedText ? selectedText.length : 1);
            } else if (key.code === "$$...$$") {
                codeToInsert = `$$${selectedText || ' '}$$`;
                newCursorPos = startPos + 2 + (selectedText ? selectedText.length : 1);
            }
        } else {
            newCursorPos = startPos + codeToInsert.length;
        }

        this.targetInput.value = text.substring(0, startPos) + codeToInsert + text.substring(endPos);
        
        // Refocus & set selection
        this.targetInput.focus();
        this.targetInput.setSelectionRange(newCursorPos, newCursorPos);

        // Trigger input event to update preview
        const event = new Event('input', { bubbles: true });
        this.targetInput.dispatchEvent(event);
    }
}

// If running in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MathKeyboard };
}
