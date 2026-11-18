document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const amountInput = document.getElementById('amountInput');
    const amountSlider = document.getElementById('amountSlider');
    const interestInput = document.getElementById('interestInput');
    const interestSlider = document.getElementById('interestSlider');
    const tenureInput = document.getElementById('tenureInput');
    const tenureSlider = document.getElementById('tenureSlider');
    const extraPayInput = document.getElementById('extraPayInput');
    const currencySelect = document.getElementById('currencySelect');

    const tenureYearsBtn = document.getElementById('tenureYearsBtn');
    const tenureMonthsBtn = document.getElementById('tenureMonthsBtn');
    const tenureUnitLabel = document.getElementById('tenureUnitLabel');

    const emiAmount = document.getElementById('emiAmount');
    const emiTenureMonths = document.getElementById('emiTenureMonths');
    const resPrincipal = document.getElementById('resPrincipal');
    const resInterest = document.getElementById('resInterest');
    const resTotalPayment = document.getElementById('resTotalPayment');

    const donutPrincipal = document.getElementById('donutPrincipal');
    const principalPercent = document.getElementById('principalPercent');

    const savingsResult = document.getElementById('savingsResult');
    const scheduleBody = document.getElementById('scheduleBody');
    const toggleScheduleBtn = document.getElementById('toggleScheduleBtn');
    const scheduleTableWrapper = document.getElementById('scheduleTableWrapper');

    let tenureMode = 'years'; // 'years' or 'months'
    let currentCurrency = '₹';

    function formatNumber(num) {
        return Math.round(num).toLocaleString('en-IN');
    }

    function formatCurrency(num) {
        return `${currentCurrency}${formatNumber(num)}`;
    }

    function calculateEMI() {
        const principal = parseFloat(amountInput.value) || 0;
        const annualRate = parseFloat(interestInput.value) || 0;
        const tenureVal = parseFloat(tenureInput.value) || 0;
        const extraPay = parseFloat(extraPayInput.value) || 0;

        const totalMonths = tenureMode === 'years' ? tenureVal * 12 : tenureVal;

        if (principal <= 0 || annualRate <= 0 || totalMonths <= 0) {
            emiAmount.textContent = formatCurrency(0);
            resPrincipal.textContent = formatCurrency(principal);
            resInterest.textContent = formatCurrency(0);
            resTotalPayment.textContent = formatCurrency(principal);
            return;
        }

        const monthlyRate = (annualRate / 12) / 100;
        // Formula: P * r * (1+r)^n / ((1+r)^n - 1)
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                    (Math.pow(1 + monthlyRate, totalMonths) - 1);

        const totalPayment = emi * totalMonths;
        const totalInterest = totalPayment - principal;

        emiAmount.textContent = formatCurrency(emi);
        emiTenureMonths.textContent = totalMonths;
        resPrincipal.textContent = formatCurrency(principal);
        resInterest.textContent = formatCurrency(totalInterest);
        resTotalPayment.textContent = formatCurrency(totalPayment);

        // Update Donut Chart
        const principalPct = Math.round((principal / totalPayment) * 100) || 0;
        donutPrincipal.setAttribute('stroke-dasharray', `${principalPct}, 100`);
        principalPercent.textContent = `${principalPct}%`;

        // Extra Prepayment Calculation
        if (extraPay > 0) {
            let balance = principal;
            let prepayMonths = 0;
            let prepayInterest = 0;
            const newMonthlyPayment = emi + extraPay;

            while (balance > 0 && prepayMonths < totalMonths * 2) {
                const interestForMonth = balance * monthlyRate;
                prepayInterest += interestForMonth;
                const principalForMonth = newMonthlyPayment - interestForMonth;
                balance -= principalForMonth;
                prepayMonths++;
            }

            const monthsSaved = Math.max(0, totalMonths - prepayMonths);
            const interestSaved = Math.max(0, totalInterest - prepayInterest);

            savingsResult.style.display = 'block';
            savingsResult.innerHTML = `🎉 Paying an extra <strong>${formatCurrency(extraPay)}/mo</strong> will finish your loan <strong>${monthsSaved} months earlier</strong> and save <strong>${formatCurrency(interestSaved)}</strong> in interest!`;
        } else {
            savingsResult.style.display = 'none';
        }

        // Build Yearly Schedule Table
        buildSchedule(principal, monthlyRate, emi, totalMonths);
    }

    function buildSchedule(principal, monthlyRate, emi, totalMonths) {
        scheduleBody.innerHTML = '';
        let balance = principal;
        const years = Math.ceil(totalMonths / 12);

        for (let y = 1; y <= years; y++) {
            const startBal = balance;
            let yearPrincipal = 0;
            let yearInterest = 0;

            for (let m = 1; m <= 12; m++) {
                if (balance <= 0) break;
                const interest = balance * monthlyRate;
                const princ = Math.min(balance, emi - interest);
                yearInterest += interest;
                yearPrincipal += princ;
                balance -= princ;
            }

            const yearTotal = yearPrincipal + yearInterest;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Year ${y}</td>
                <td>${formatCurrency(startBal)}</td>
                <td>${formatCurrency(yearTotal)}</td>
                <td style="color: var(--accent-green-bright);">${formatCurrency(yearPrincipal)}</td>
                <td style="color: var(--accent-gold);">${formatCurrency(yearInterest)}</td>
                <td>${formatCurrency(Math.max(0, balance))}</td>
            `;
            scheduleBody.appendChild(row);

            if (balance <= 0) break;
        }
    }

    // Sync input and sliders
    amountInput.addEventListener('input', () => {
        amountSlider.value = amountInput.value;
        calculateEMI();
    });
    amountSlider.addEventListener('input', () => {
        amountInput.value = amountSlider.value;
        calculateEMI();
    });

    interestInput.addEventListener('input', () => {
        interestSlider.value = interestInput.value;
        calculateEMI();
    });
    interestSlider.addEventListener('input', () => {
        interestInput.value = interestSlider.value;
        calculateEMI();
    });

    tenureInput.addEventListener('input', () => {
        tenureSlider.value = tenureInput.value;
        calculateEMI();
    });
    tenureSlider.addEventListener('input', () => {
        tenureInput.value = tenureSlider.value;
        calculateEMI();
    });

    extraPayInput.addEventListener('input', calculateEMI);

    // Currency Switcher
    currencySelect.addEventListener('change', () => {
        currentCurrency = currencySelect.value;
        document.querySelectorAll('.currency-symbol').forEach(el => el.textContent = currentCurrency);
        calculateEMI();
    });

    // Quick chips
    document.querySelectorAll('#amountChips .chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#amountChips .chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            amountInput.value = btn.dataset.val;
            amountSlider.value = btn.dataset.val;
            calculateEMI();
        });
    });

    document.querySelectorAll('#interestChips .chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#interestChips .chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            interestInput.value = btn.dataset.val;
            interestSlider.value = btn.dataset.val;
            calculateEMI();
        });
    });

    document.querySelectorAll('#tenureChips .chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#tenureChips .chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            let val = parseInt(btn.dataset.val);
            if (tenureMode === 'months') val *= 12;
            tenureInput.value = val;
            tenureSlider.value = val;
            calculateEMI();
        });
    });

    // Tenure Toggle
    tenureYearsBtn.addEventListener('click', () => {
        if (tenureMode === 'years') return;
        tenureMode = 'years';
        tenureYearsBtn.classList.add('active');
        tenureMonthsBtn.classList.remove('active');
        tenureUnitLabel.textContent = 'Yr';
        tenureSlider.max = 30;
        tenureInput.value = Math.max(1, Math.round(tenureInput.value / 12));
        tenureSlider.value = tenureInput.value;
        calculateEMI();
    });

    tenureMonthsBtn.addEventListener('click', () => {
        if (tenureMode === 'months') return;
        tenureMode = 'months';
        tenureMonthsBtn.classList.add('active');
        tenureYearsBtn.classList.remove('active');
        tenureUnitLabel.textContent = 'Mo';
        tenureSlider.max = 360;
        tenureInput.value = tenureInput.value * 12;
        tenureSlider.value = tenureInput.value;
        calculateEMI();
    });

    // Loan Category Presets
    document.querySelectorAll('.loan-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.loan-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.dataset.type;

            if (type === 'home') {
                amountInput.value = 3500000;
                interestInput.value = 8.5;
                tenureInput.value = tenureMode === 'years' ? 20 : 240;
            } else if (type === 'car') {
                amountInput.value = 800000;
                interestInput.value = 9.0;
                tenureInput.value = tenureMode === 'years' ? 5 : 60;
            } else if (type === 'personal') {
                amountInput.value = 300000;
                interestInput.value = 11.5;
                tenureInput.value = tenureMode === 'years' ? 3 : 36;
            }

            amountSlider.value = amountInput.value;
            interestSlider.value = interestInput.value;
            tenureSlider.value = tenureInput.value;
            calculateEMI();
        });
    });

    // Toggle Schedule
    toggleScheduleBtn.addEventListener('click', () => {
        if (scheduleTableWrapper.style.display === 'none') {
            scheduleTableWrapper.style.display = 'block';
            toggleScheduleBtn.textContent = 'Hide Breakdown ▲';
        } else {
            scheduleTableWrapper.style.display = 'none';
            toggleScheduleBtn.textContent = 'Show Breakdown ▼';
        }
    });

    // Initial calc
    calculateEMI();
});
