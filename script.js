let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.body.scrollTop;
    if (scrollTop > lastScrollTop) { // scrolling down
        document.body.classList.remove('scrolling-up');
    } else { // scrolling up
        document.body.classList.add('scrolling-up');
    }
    lastScrollTop = scrollTop;
});

function copy(button) {
    const codeBox = button.closest('.code');
    const codeContent = codeBox ? codeBox.querySelector(".codeContent") : null;
    const copyText = codeContent ? codeContent.innerText : "";

    function showTooltip() {
        const tooltip = button.querySelector('.tool-tip');
        if (tooltip) {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
            setTimeout(() => {
                tooltip.style.visibility = '';
                tooltip.style.opacity = '';
            }, 1600);
        }
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(copyText).then(showTooltip, fallbackCopy);
    } else {
        fallbackCopy();
    }

    function fallbackCopy() {
        const textarea = document.createElement('textarea');
        textarea.value = copyText;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            showTooltip();
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        document.body.removeChild(textarea);
    }
}

function openNav() {
    const sidenav = document.getElementById("mySidenav");
    const overlay = document.getElementById("sidenavOverlay");
    if (sidenav) {
        sidenav.classList.add("open");
        sidenav.style.width = ""; // Reset legacy inline style
    }
    if (overlay) {
        overlay.classList.add("active");
    }
    if (window.innerWidth <= 900) {
        document.body.style.overflow = "hidden";
        document.addEventListener("click", closeNavOutside);
    }
}

function closeNav() {
    const sidenav = document.getElementById("mySidenav");
    const overlay = document.getElementById("sidenavOverlay");
    if (sidenav) {
        sidenav.classList.remove("open");
        sidenav.style.width = ""; // Reset legacy inline style
    }
    if (overlay) {
        overlay.classList.remove("active");
    }
    document.body.style.overflow = "";
    document.removeEventListener("click", closeNavOutside);
}

function toggleNav() {
    const sidenav = document.getElementById("mySidenav");
    if (sidenav && sidenav.classList.contains("open")) {
        closeNav();
    } else {
        openNav();
    }
}

function closeNavOutside(event) {
    const sidenav = document.getElementById("mySidenav");
    const openbtn = document.querySelector(".openbtn");
    if (sidenav && !sidenav.contains(event.target) && openbtn && !openbtn.contains(event.target)) {
        closeNav();
    }
}

// Scrollspy and dynamic sidenav interactions
document.addEventListener("DOMContentLoaded", () => {
    const sidenav = document.getElementById("mySidenav");
    if (!sidenav) return;

    // Auto-close drawer on mobile when clicking any anchor link inside sidenav
    const links = sidenav.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                closeNav();
            }
        });
    });

    // ScrollSpy to highlight active section in sidebar
    const hashLinks = Array.from(sidenav.querySelectorAll('a[href^="#"]'));
    if (!hashLinks.length) return;

    const sections = [];
    hashLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const targetId = decodeURIComponent(href.substring(1));
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            sections.push({ id: targetId, link: link, element: targetEl });
        }
    });

    if (!sections.length) return;

    function onScrollSpy() {
        const scrollPosition = window.scrollY + 140;
        let currentSection = null;

        for (let i = 0; i < sections.length; i++) {
            const el = sections[i].element;
            const top = el.getBoundingClientRect().top + window.scrollY;
            if (top <= scrollPosition) {
                currentSection = sections[i];
            }
        }

        hashLinks.forEach(l => l.classList.remove("active"));
        if (currentSection) {
            currentSection.link.classList.add("active");
        }
    }

    window.addEventListener("scroll", onScrollSpy, { passive: true });
    onScrollSpy();
});
