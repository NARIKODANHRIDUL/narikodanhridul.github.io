function convert(source) {
    let value = document.getElementById(source).value.trim();
    
    // Check if value is empty
    if (value === "") {
        clearAllInputs();
        return;
    }

    switch (source) {
        case 'binary':
            updateFromBinary(value);
            break;
        case 'decimal':
            updateFromDecimal(value);
            break;
        case 'octal':
            updateFromOctal(value);
            break;
        case 'hexadecimal':
            updateFromHexadecimal(value);
            break;
    }
}

function clearAllInputs() {
    document.getElementById('binary').value = "";
    document.getElementById('decimal').value = "";
    document.getElementById('octal').value = "";
    document.getElementById('hexadecimal').value = "";
}

function updateFromBinary(value) {
    let decimal = parseInt(value, 2);
    document.getElementById('decimal').value = isNaN(decimal) ? "" : decimal;
    document.getElementById('octal').value = isNaN(decimal) ? "" : decimal.toString(8);
    document.getElementById('hexadecimal').value = isNaN(decimal) ? "" : decimal.toString(16).toUpperCase();
}

function updateFromDecimal(value) {
    let binary = parseInt(value, 10).toString(2);
    document.getElementById('binary').value = isNaN(binary) ? "" : binary;
    document.getElementById('octal').value = isNaN(value) ? "" : parseInt(value, 10).toString(8);
    document.getElementById('hexadecimal').value = isNaN(value) ? "" : parseInt(value, 10).toString(16).toUpperCase();
}

function updateFromOctal(value) {
    let decimal = parseInt(value, 8);
    document.getElementById('decimal').value = isNaN(decimal) ? "" : decimal;
    document.getElementById('binary').value = isNaN(decimal) ? "" : decimal.toString(2);
    document.getElementById('hexadecimal').value = isNaN(decimal) ? "" : decimal.toString(16).toUpperCase();
}

function updateFromHexadecimal(value) {
    let decimal = parseInt(value, 16);
    document.getElementById('decimal').value = isNaN(decimal) ? "" : decimal;
    document.getElementById('binary').value = isNaN(decimal) ? "" : decimal.toString(2);
    document.getElementById('octal').value = isNaN(decimal) ? "" : decimal.toString(8);
}

function copyText(fieldId) {
    const textField = document.getElementById(fieldId);
    textField.select();
    document.execCommand("copy");
  
}



let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.body.scrollTop;
    if (scrollTop > lastScrollTop) { //scrolling down
        document.body.classList.remove('scrolling-up');
    } else {//scrolling up
        document.body.classList.add('scrolling-up');
    }
    lastScrollTop = scrollTop;
});