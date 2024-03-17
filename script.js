
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

function copy(button) {
    var copyText = button.parentElement.querySelector("#copy-content").innerText;
    var textarea = document.createElement('textarea');
    textarea.id = 'temp_element';
    textarea.style.height = 0;
    document.body.appendChild(textarea);
    textarea.value = copyText;
    var selector = document.querySelector('#temp_element');
    selector.select();
    document.execCommand('copy');
    document.body.removeChild(selector);
}
