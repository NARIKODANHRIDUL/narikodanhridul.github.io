document.addEventListener('DOMContentLoaded', () => {
    const passwordOutput = document.getElementById('passwordOutput');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const copiedTooltip = document.getElementById('copiedTooltip');
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const wordsSlider = document.getElementById('wordsSlider');
    const wordsValue = document.getElementById('wordsValue');
    const mainGenerateBtn = document.getElementById('mainGenerateBtn');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const entropyText = document.getElementById('entropyText');
    const crackTime = document.getElementById('crackTime');
    const modeTabs = document.querySelectorAll('.mode-tab');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    const lengthGroup = document.getElementById('lengthGroup');
    const wordsGroup = document.getElementById('wordsGroup');
    const optionsGrid = document.getElementById('optionsGrid');

    const chkUpper = document.getElementById('chkUpper');
    const chkLower = document.getElementById('chkLower');
    const chkNumbers = document.getElementById('chkNumbers');
    const chkSymbols = document.getElementById('chkSymbols');
    const chkNoAmbiguous = document.getElementById('chkNoAmbiguous');

    let currentMode = 'password';
    let history = [];

    const wordList = [
        "quantum", "cyber", "vector", "kernel", "matrix", "crypto", "shield", "packet",
        "buffer", "socket", "beacon", "router", "daemon", "nexus", "vertex", "tensor",
        "cipher", "syntax", "galaxy", "shadow", "blazer", "plasma", "meteor", "nebula",
        "pulsar", "cosmos", "dynamo", "cobalt", "silver", "atomic", "binary", "optics",
        "neuron", "fusion", "proton", "lambda", "helium", "aurora", "falcon", "zenith",
        "stride", "beacon", "glider", "timber", "canyon", "velvet", "harbor", "anchor",
        "summit", "spirit", "bronze", "copper", "breeze", "crater", "whisper", "orbit"
    ];

    function getCharset() {
        let chars = '';
        if (chkLower.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (chkUpper.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chkNumbers.checked) chars += '0123456789';
        if (chkSymbols.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (chkNoAmbiguous.checked) {
            chars = chars.replace(/[Il1O0]/g, '');
        }

        return chars;
    }

    function getRandomBytes(count) {
        const arr = new Uint32Array(count);
        window.crypto.getRandomValues(arr);
        return arr;
    }

    function generatePassword() {
        let result = '';

        if (currentMode === 'password') {
            const len = parseInt(lengthSlider.value);
            const chars = getCharset();
            if (!chars) {
                passwordOutput.textContent = 'Select at least 1 option!';
                updateStrength(0, 0);
                return;
            }

            const rand = getRandomBytes(len);
            for (let i = 0; i < len; i++) {
                result += chars[rand[i] % chars.length];
            }

            const poolSize = chars.length;
            const entropy = Math.round(len * Math.log2(poolSize));
            updateStrength(entropy, len);

        } else if (currentMode === 'passphrase') {
            const count = parseInt(wordsSlider.value);
            const rand = getRandomBytes(count);
            const selected = [];
            for (let i = 0; i < count; i++) {
                selected.push(wordList[rand[i] % wordList.length]);
            }
            // Add a random number at the end
            const num = rand[0] % 90 + 10;
            result = selected.join('-') + '-' + num;

            const poolSize = wordList.length;
            const entropy = Math.round(count * Math.log2(poolSize) + Math.log2(90));
            updateStrength(entropy, result.length);

        } else if (currentMode === 'pin') {
            const len = parseInt(lengthSlider.value);
            const rand = getRandomBytes(len);
            for (let i = 0; i < len; i++) {
                result += (rand[i] % 10).toString();
            }
            const entropy = Math.round(len * Math.log2(10));
            updateStrength(entropy, len);
        }

        passwordOutput.textContent = result;
        addToHistory(result);
    }

    function updateStrength(entropy, length) {
        entropyText.textContent = `Entropy: ${entropy} bits`;

        let pct = Math.min(100, Math.round((entropy / 100) * 100));
        strengthBar.style.width = pct + '%';

        let label = 'Very Weak';
        let color = '#ef4444';
        let crack = 'Instant';

        if (entropy >= 80) {
            label = 'Very Strong';
            color = '#10b981';
            crack = 'Centuries / Impractical';
        } else if (entropy >= 60) {
            label = 'Strong';
            color = '#22c55e';
            crack = 'Several years';
        } else if (entropy >= 45) {
            label = 'Moderate';
            color = '#eab308';
            crack = 'A few months';
        } else if (entropy >= 30) {
            label = 'Weak';
            color = '#f97316';
            crack = 'A few hours';
        }

        strengthText.textContent = `Strength: ${label}`;
        strengthBar.style.backgroundColor = color;
        crackTime.textContent = `Estimated crack time (100B guesses/sec): ${crack}`;
    }

    function addToHistory(pwd) {
        if (!pwd || pwd.length < 3 || pwd.includes('Select at least')) return;
        history.unshift(pwd);
        if (history.length > 5) history.pop();
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-history">No generated passwords yet.</div>';
            return;
        }

        historyList.innerHTML = '';
        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <span>${escapeHtml(item)}</span>
                <button class="copy-mini-btn" title="Copy">📋</button>
            `;
            div.querySelector('.copy-mini-btn').addEventListener('click', () => {
                copyToClipboard(item);
            });
            historyList.appendChild(div);
        });
    }

    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        })[m]);
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            copiedTooltip.classList.add('show');
            setTimeout(() => {
                copiedTooltip.classList.remove('show');
            }, 1500);
        });
    }

    copyBtn.addEventListener('click', () => {
        const text = passwordOutput.textContent;
        if (text && !text.includes('Select at least')) {
            copyToClipboard(text);
        }
    });

    regenerateBtn.addEventListener('click', () => {
        regenerateBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => regenerateBtn.style.transform = '', 300);
        generatePassword();
    });

    mainGenerateBtn.addEventListener('click', generatePassword);

    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
        presetBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-len') === lengthSlider.value);
        });
        generatePassword();
    });

    wordsSlider.addEventListener('input', () => {
        wordsValue.textContent = wordsSlider.value;
        generatePassword();
    });

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            lengthSlider.value = btn.getAttribute('data-len');
            lengthValue.textContent = lengthSlider.value;
            generatePassword();
        });
    });

    [chkUpper, chkLower, chkNumbers, chkSymbols, chkNoAmbiguous].forEach(chk => {
        chk.addEventListener('change', generatePassword);
    });

    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMode = tab.getAttribute('data-mode');

            if (currentMode === 'password') {
                lengthGroup.style.display = 'block';
                wordsGroup.style.display = 'none';
                optionsGrid.style.display = 'grid';
            } else if (currentMode === 'passphrase') {
                lengthGroup.style.display = 'none';
                wordsGroup.style.display = 'block';
                optionsGrid.style.display = 'none';
            } else if (currentMode === 'pin') {
                lengthGroup.style.display = 'block';
                wordsGroup.style.display = 'none';
                optionsGrid.style.display = 'none';
            }
            generatePassword();
        });
    });

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        renderHistory();
    });

    // Initial generate
    generatePassword();
});
