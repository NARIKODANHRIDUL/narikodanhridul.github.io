// Everyday Unit & Kitchen Converter Script

const CATEGORIES = {
    cooking: {
        title: "🍳 Kitchen & Cooking Quick Cheat Sheet",
        base: "ml",
        units: {
            "cup_us": { name: "Cup (US)", toBase: 236.588 },
            "tbsp": { name: "Tablespoon (tbsp)", toBase: 14.787 },
            "tsp": { name: "Teaspoon (tsp)", toBase: 4.929 },
            "ml": { name: "Milliliter (ml)", toBase: 1 },
            "l": { name: "Liter (L)", toBase: 1000 },
            "floz": { name: "Fluid Ounce (fl oz)", toBase: 29.5735 },
            "pint_us": { name: "Pint (US)", toBase: 473.176 },
            "quart_us": { name: "Quart (US)", toBase: 946.353 }
        },
        defaultFrom: "cup_us",
        defaultTo: "ml",
        presets: [
            { label: "1 Cup → ml", from: "cup_us", to: "ml", val: 1 },
            { label: "1 tbsp → tsp", from: "tbsp", to: "tsp", val: 1 },
            { label: "1 fl oz → ml", from: "floz", to: "ml", val: 1 },
            { label: "1 Liter → Cups", from: "l", to: "cup_us", val: 1 },
            { label: "4 Cups → Quart", from: "cup_us", to: "quart_us", val: 4 }
        ],
        cheatSheet: [
            { label: "1 US Cup", val: "16 tbsp = 237 ml" },
            { label: "1 Tablespoon (tbsp)", val: "3 teaspoons = ~15 ml" },
            { label: "1 Teaspoon (tsp)", val: "~5 ml" },
            { label: "1 Fluid Ounce (fl oz)", val: "2 tbsp = ~30 ml" },
            { label: "1 Pint (US)", val: "2 cups = 473 ml" },
            { label: "1 Quart (US)", val: "4 cups = 946 ml" },
            { label: "1 Gallon (US)", val: "16 cups = 3.785 Liters" },
            { label: "1 Stick Butter (US)", val: "1/2 cup = 8 tbsp = 113g" }
        ]
    },
    length: {
        title: "📏 Height & Length Quick Cheat Sheet",
        base: "m",
        units: {
            "cm": { name: "Centimeter (cm)", toBase: 0.01 },
            "m": { name: "Meter (m)", toBase: 1 },
            "km": { name: "Kilometer (km)", toBase: 1000 },
            "in": { name: "Inch (in)", toBase: 0.0254 },
            "ft": { name: "Foot (ft)", toBase: 0.3048 },
            "yd": { name: "Yard (yd)", toBase: 0.9144 },
            "mi": { name: "Mile (mi)", toBase: 1609.344 }
        },
        defaultFrom: "ft",
        defaultTo: "cm",
        presets: [
            { label: "5' 8\" (5.67 ft) → cm", from: "ft", to: "cm", val: 5.667 },
            { label: "6' 0\" (6 ft) → cm", from: "ft", to: "cm", val: 6 },
            { label: "170 cm → Feet", from: "cm", to: "ft", val: 170 },
            { label: "1 Mile → km", from: "mi", to: "km", val: 1 },
            { label: "100 Meters → Feet", from: "m", to: "ft", val: 100 }
        ],
        cheatSheet: [
            { label: "5 Feet 0 Inches", val: "152.4 cm" },
            { label: "5 Feet 6 Inches", val: "167.6 cm" },
            { label: "5 Feet 8 Inches", val: "172.7 cm" },
            { label: "5 Feet 10 Inches", val: "177.8 cm" },
            { label: "6 Feet 0 Inches", val: "182.9 cm" },
            { label: "1 Inch", val: "2.54 cm" },
            { label: "1 Foot", val: "12 in = 30.48 cm" },
            { label: "1 Mile", val: "1.609 km = 5,280 ft" }
        ]
    },
    weight: {
        title: "⚖️ Weight & Body Mass Quick Cheat Sheet",
        base: "kg",
        units: {
            "kg": { name: "Kilogram (kg)", toBase: 1 },
            "g": { name: "Gram (g)", toBase: 0.001 },
            "mg": { name: "Milligram (mg)", toBase: 0.000001 },
            "lb": { name: "Pound (lb / lbs)", toBase: 0.45359237 },
            "oz": { name: "Ounce (oz)", toBase: 0.028349523 },
            "ton": { name: "Metric Ton (t)", toBase: 1000 }
        },
        defaultFrom: "kg",
        defaultTo: "lb",
        presets: [
            { label: "1 kg → Pounds", from: "kg", to: "lb", val: 1 },
            { label: "150 lbs → kg", from: "lb", to: "kg", val: 150 },
            { label: "1 Ounce → Grams", from: "oz", to: "g", val: 1 },
            { label: "500 Grams → lbs", from: "g", to: "lb", val: 500 },
            { label: "70 kg Body Weight", from: "kg", to: "lb", val: 70 }
        ],
        cheatSheet: [
            { label: "1 Kilogram (kg)", val: "2.205 Pounds (lbs)" },
            { label: "1 Pound (lb)", val: "453.6 g = 16 oz" },
            { label: "1 Ounce (oz)", val: "28.35 Grams" },
            { label: "50 kg Body Weight", val: "110.2 lbs" },
            { label: "65 kg Body Weight", val: "143.3 lbs" },
            { label: "75 kg Body Weight", val: "165.3 lbs" },
            { label: "85 kg Body Weight", val: "187.4 lbs" },
            { label: "1 Metric Ton", val: "1,000 kg = 2,204 lbs" }
        ]
    },
    temp: {
        title: "🌡️ Temperature Reference & Daily Benchmarks",
        isSpecial: true,
        units: {
            "c": { name: "Celsius (°C)" },
            "f": { name: "Fahrenheit (°F)" },
            "k": { name: "Kelvin (K)" }
        },
        defaultFrom: "c",
        defaultTo: "f",
        presets: [
            { label: "Body Temp (37°C)", from: "c", to: "f", val: 37 },
            { label: "Freezing (0°C)", from: "c", to: "f", val: 0 },
            { label: "Boiling (100°C)", from: "c", to: "f", val: 100 },
            { label: "Baking Oven (180°C / 356°F)", from: "c", to: "f", val: 180 },
            { label: "Warm Room (24°C / 75°F)", from: "c", to: "f", val: 24 }
        ],
        cheatSheet: [
            { label: "Water Freezing Point", val: "0°C / 32°F" },
            { label: "Comfortable Room Temp", val: "20 - 22°C / 68 - 72°F" },
            { label: "Normal Human Body Temp", val: "37°C / 98.6°F" },
            { label: "Mild Fever Threshold", val: "38°C / 100.4°F" },
            { label: "Hot Bath / Shower", val: "40°C / 104°F" },
            { label: "Baking Moderate Oven", val: "180°C / 356°F" },
            { label: "High Heat Roasting", val: "200°C / 392°F" },
            { label: "Water Boiling Point", val: "100°C / 212°F" }
        ]
    },
    area: {
        title: "📐 Land, Plot & Room Area Quick Cheat Sheet",
        base: "sqm",
        units: {
            "sqft": { name: "Square Foot (sq ft)", toBase: 0.092903 },
            "sqm": { name: "Square Meter (sq m)", toBase: 1 },
            "sqyd": { name: "Square Yard (sq yd)", toBase: 0.836127 },
            "acre": { name: "Acre (ac)", toBase: 4046.8564 },
            "hectare": { name: "Hectare (ha)", toBase: 10000 },
            "cent": { name: "Cent (India - 435.6 sq ft)", toBase: 40.4686 },
            "guntha": { name: "Guntha (India - 1089 sq ft)", toBase: 101.171 }
        },
        defaultFrom: "sqft",
        defaultTo: "sqm",
        presets: [
            { label: "1000 sq ft Flat → sq m", from: "sqft", to: "sqm", val: 1000 },
            { label: "1 Acre → sq ft", from: "acre", to: "sqft", val: 1 },
            { label: "1 Cent → sq ft", from: "cent", to: "sqft", val: 1 },
            { label: "5 Cents Land Plot → sq ft", from: "cent", to: "sqft", val: 5 },
            { label: "1 Hectare → Acres", from: "hectare", to: "acre", val: 1 }
        ],
        cheatSheet: [
            { label: "1 Acre", val: "43,560 sq ft (~4,047 sq m)" },
            { label: "1 Cent (South India)", val: "435.6 sq ft (~40.5 sq m)" },
            { label: "1 Acre in Cents", val: "100 Cents" },
            { label: "1 Guntha (MH/KA/GJ)", val: "1,089 sq ft (~101.2 sq m)" },
            { label: "1 Hectare", val: "2.471 Acres = 10,000 sq m" },
            { label: "1000 sq ft Home", val: "~92.9 sq meters" },
            { label: "1 Square Meter", val: "10.764 Square Feet" },
            { label: "1 Square Yard (Gaj)", val: "9 sq ft = 0.836 sq m" }
        ]
    },
    speed: {
        title: "🚗 Speed & Travel Conversion Quick Cheat Sheet",
        base: "ms",
        units: {
            "kmh": { name: "Kilometers per hour (km/h)", toBase: 0.277778 },
            "mph": { name: "Miles per hour (mph)", toBase: 0.44704 },
            "ms": { name: "Meters per second (m/s)", toBase: 1 },
            "knot": { name: "Knots (kn)", toBase: 0.514444 },
            "fts": { name: "Feet per second (ft/s)", toBase: 0.3048 }
        },
        defaultFrom: "mph",
        defaultTo: "kmh",
        presets: [
            { label: "60 mph Highway → km/h", from: "mph", to: "kmh", val: 60 },
            { label: "100 km/h → mph", from: "kmh", to: "mph", val: 100 },
            { label: "30 km/h City Zone → mph", from: "kmh", to: "mph", val: 30 },
            { label: "120 km/h Expressway → mph", from: "kmh", to: "mph", val: 120 }
        ],
        cheatSheet: [
            { label: "Slow Walking Pace", val: "4 - 5 km/h (2.5 - 3.1 mph)" },
            { label: "Bicycle Commute", val: "15 - 20 km/h (9.3 - 12.4 mph)" },
            { label: "City Speed Limit (30 mph)", val: "48.3 km/h" },
            { label: "Highway Speed (60 mph)", val: "96.6 km/h" },
            { label: "Expressway (100 km/h)", val: "62.1 mph" },
            { label: "Expressway (120 km/h)", val: "74.6 mph" },
            { label: "1 Meter per second", val: "3.6 km/h = 2.24 mph" },
            { label: "Cruising Cruise Ship (20 kn)", val: "37 km/h (23 mph)" }
        ]
    }
};

let currentCategory = 'cooking';

// Elements
const catTabs = document.querySelectorAll('.cat-tab');
const fromValInput = document.getElementById('fromValue');
const toValInput = document.getElementById('toValue');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const swapBtn = document.getElementById('swapBtn');
const formulaBanner = document.getElementById('formulaBanner');
const presetChipsContainer = document.getElementById('presetChips');
const cheatTitle = document.getElementById('cheatTitle');
const cheatGrid = document.getElementById('cheatGrid');

// Format clean number output
function formatNumber(num) {
    if (isNaN(num)) return '0';
    if (Math.abs(num) < 0.000001 && num !== 0) {
        return num.toExponential(4);
    }
    // Round to max 6 decimals without trailing zeros
    const rounded = Math.round(num * 1000000) / 1000000;
    return String(rounded);
}

// Convert functions
function convertUnits(val, fromUnit, toUnit, catKey) {
    const cat = CATEGORIES[catKey];
    if (!cat) return 0;

    if (cat.isSpecial) {
        // Temperature
        if (fromUnit === toUnit) return val;
        let cVal = val;
        // From to Celsius
        if (fromUnit === 'f') cVal = (val - 32) * (5 / 9);
        else if (fromUnit === 'k') cVal = val - 273.15;

        // Celsius to To
        if (toUnit === 'c') return cVal;
        if (toUnit === 'f') return (cVal * 9 / 5) + 32;
        if (toUnit === 'k') return cVal + 273.15;
        return cVal;
    }

    // Standard linear conversion
    const fromFactor = cat.units[fromUnit].toBase;
    const toFactor = cat.units[toUnit].toBase;
    const baseValue = val * fromFactor;
    return baseValue / toFactor;
}

// Update conversion when fromValue changes
function updateFromLeft() {
    const val = parseFloat(fromValInput.value);
    if (isNaN(val)) {
        toValInput.value = '';
        return;
    }
    const fromU = fromUnitSelect.value;
    const toU = toUnitSelect.value;
    const result = convertUnits(val, fromU, toU, currentCategory);
    toValInput.value = formatNumber(result);
    updateFormula(fromU, toU);
}

// Update conversion when toValue changes
function updateFromRight() {
    const val = parseFloat(toValInput.value);
    if (isNaN(val)) {
        fromValInput.value = '';
        return;
    }
    const fromU = fromUnitSelect.value;
    const toU = toUnitSelect.value;
    // Reverse conversion
    const result = convertUnits(val, toU, fromU, currentCategory);
    fromValInput.value = formatNumber(result);
    updateFormula(fromU, toU);
}

// Formula banner updater
function updateFormula(fromU, toU) {
    const cat = CATEGORIES[currentCategory];
    const fromName = cat.units[fromU].name;
    const toName = cat.units[toU].name;

    if (cat.isSpecial) {
        let formulaText = "";
        if (fromU === 'c' && toU === 'f') formulaText = "(°C × 9/5) + 32 = °F";
        else if (fromU === 'f' && toU === 'c') formulaText = "(°F − 32) × 5/9 = °C";
        else if (fromU === 'c' && toU === 'k') formulaText = "°C + 273.15 = K";
        else if (fromU === 'k' && toU === 'c') formulaText = "K − 273.15 = °C";
        else if (fromU === 'f' && toU === 'k') formulaText = "(°F − 32) × 5/9 + 273.15 = K";
        else if (fromU === 'k' && toU === 'f') formulaText = "(K − 273.15) × 9/5 + 32 = °F";
        else formulaText = "Same unit (1:1)";
        formulaBanner.innerHTML = `<strong>💡 Formula:</strong> ${formulaText}`;
    } else {
        const oneFromInTo = convertUnits(1, fromU, toU, currentCategory);
        formulaBanner.innerHTML = `<strong>💡 Quick Formula:</strong> 1 ${fromName} = <strong>${formatNumber(oneFromInTo)}</strong> ${toName}`;
    }
}

// Swap units
function swapUnits() {
    const prevFrom = fromUnitSelect.value;
    const prevTo = toUnitSelect.value;
    fromUnitSelect.value = prevTo;
    toUnitSelect.value = prevFrom;
    updateFromLeft();
}

// Render Presets
function renderPresets() {
    presetChipsContainer.innerHTML = '';
    const cat = CATEGORIES[currentCategory];
    cat.presets.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'chip-btn';
        btn.textContent = p.label;
        btn.addEventListener('click', () => {
            fromUnitSelect.value = p.from;
            toUnitSelect.value = p.to;
            fromValInput.value = p.val;
            updateFromLeft();
        });
        presetChipsContainer.appendChild(btn);
    });
}

// Render Cheat Sheet
function renderCheatSheet() {
    const cat = CATEGORIES[currentCategory];
    cheatTitle.textContent = cat.title;
    cheatGrid.innerHTML = '';
    cat.cheatSheet.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cheat-item';
        div.innerHTML = `
            <span class="cheat-label">${item.label}</span>
            <span class="cheat-val">${item.val}</span>
        `;
        cheatGrid.appendChild(div);
    });
}

// Populate Unit Dropdowns
function populateDropdowns(categoryKey) {
    const cat = CATEGORIES[categoryKey];
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    Object.entries(cat.units).forEach(([key, info]) => {
        const optFrom = document.createElement('option');
        optFrom.value = key;
        optFrom.textContent = info.name;
        fromUnitSelect.appendChild(optFrom);

        const optTo = document.createElement('option');
        optTo.value = key;
        optTo.textContent = info.name;
        toUnitSelect.appendChild(optTo);
    });

    fromUnitSelect.value = cat.defaultFrom;
    toUnitSelect.value = cat.defaultTo;
}

// Set Active Category
function switchCategory(catKey) {
    if (!CATEGORIES[catKey]) return;
    currentCategory = catKey;

    catTabs.forEach(tab => {
        if (tab.getAttribute('data-cat') === catKey) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    populateDropdowns(catKey);
    renderPresets();
    renderCheatSheet();
    updateFromLeft();
}

// Event Listeners
catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const cat = tab.getAttribute('data-cat');
        switchCategory(cat);
    });
});

fromValInput.addEventListener('input', updateFromLeft);
toValInput.addEventListener('input', updateFromRight);
fromUnitSelect.addEventListener('change', updateFromLeft);
toUnitSelect.addEventListener('change', updateFromLeft);
swapBtn.addEventListener('click', swapUnits);

// Initial Load
switchCategory('cooking');
