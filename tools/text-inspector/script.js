document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const statChars = document.getElementById('statChars');
    const statWords = document.getElementById('statWords');
    const statLines = document.getElementById('statLines');
    const statBytes = document.getElementById('statBytes');

    const hashSha256 = document.getElementById('hashSha256');
    const hashSha1 = document.getElementById('hashSha1');
    const hashSha512 = document.getElementById('hashSha512');

    const encBase64 = document.getElementById('encBase64');
    const encUrl = document.getElementById('encUrl');
    const encHex = document.getElementById('encHex');
    const encBinary = document.getElementById('encBinary');

    const actionChips = document.querySelectorAll('.action-chip[data-case]');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');

    function showToast(msg) {
        toast.textContent = msg || 'Copied to clipboard!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1500);
    }

    async function computeHash(algorithm, text) {
        if (!text) return '-';
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest(algorithm, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            return 'Error: ' + e.message;
        }
    }

    function stringToHex(text) {
        if (!text) return '-';
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
    }

    function stringToBinary(text) {
        if (!text) return '-';
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        return Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ');
    }

    function utf8ByteCount(str) {
        return new TextEncoder().encode(str).length;
    }

    async function updateOutputs() {
        const text = inputText.value;

        // Stats
        statChars.textContent = `${text.length} chars`;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        statWords.textContent = `${words} words`;
        const lines = text ? text.split('\n').length : 0;
        statLines.textContent = `${lines} lines`;
        statBytes.textContent = `${utf8ByteCount(text)} bytes`;

        if (!text) {
            hashSha256.textContent = '-';
            hashSha1.textContent = '-';
            hashSha512.textContent = '-';
            encBase64.textContent = '-';
            encUrl.textContent = '-';
            encHex.textContent = '-';
            encBinary.textContent = '-';
            return;
        }

        // Hashes
        hashSha256.textContent = await computeHash('SHA-256', text);
        hashSha1.textContent = await computeHash('SHA-1', text);
        hashSha512.textContent = await computeHash('SHA-512', text);

        // Encodings
        try {
            // Encode UTF-8 safely to base64
            encBase64.textContent = btoa(unescape(encodeURIComponent(text)));
        } catch (e) {
            encBase64.textContent = 'Invalid binary input';
        }

        encUrl.textContent = encodeURIComponent(text);
        encHex.textContent = stringToHex(text);
        encBinary.textContent = stringToBinary(text);
    }

    inputText.addEventListener('input', updateOutputs);

    // Case conversions
    actionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const mode = chip.getAttribute('data-case');
            const val = inputText.value;
            if (!val) return;

            let converted = val;
            if (mode === 'upper') {
                converted = val.toUpperCase();
            } else if (mode === 'lower') {
                converted = val.toLowerCase();
            } else if (mode === 'title') {
                converted = val.toLowerCase().replace(/(?:^|\s)\w/g, m => m.toUpperCase());
            } else if (mode === 'camel') {
                converted = val.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
                    if (+match === 0) return "";
                    return index === 0 ? match.toLowerCase() : match.toUpperCase();
                }).replace(/\s+/g, '');
            } else if (mode === 'snake') {
                converted = val.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '');
            } else if (mode === 'kebab') {
                converted = val.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            }

            inputText.value = converted;
            updateOutputs();
        });
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        updateOutputs();
        inputText.focus();
    });

    // Copy handlers
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl && targetEl.textContent && targetEl.textContent !== '-') {
                navigator.clipboard.writeText(targetEl.textContent).then(() => {
                    showToast();
                });
            }
        });
    });

    // Initial run
    updateOutputs();
});
