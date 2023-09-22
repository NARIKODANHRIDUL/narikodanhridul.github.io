
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