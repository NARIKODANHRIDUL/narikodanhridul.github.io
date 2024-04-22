
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
    var copyText = button.closest('.code').querySelector(".codeContent").innerText;
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

function openNav() {
    var sidenav = document.getElementById("mySidenav");
    sidenav.style.width = "250px";
    document.getElementsByClassName("openbtn")[0].style.display = "none";
    // Add event listener to close sidebar when clicking outside of it
    if (window.innerWidth <= 600) {
      document.addEventListener("click", closeNavOutside);
      
    }
  }
  
  function closeNav() {
    if (window.innerWidth <= 600) { 
      var sidenav = document.getElementById("mySidenav");
      sidenav.style.width = "0";
      document.getElementsByClassName("openbtn")[0].style.display = "block";
      // Remove event listener when sidebar is closed
      document.removeEventListener("click", closeNavOutside);
    }
  }
  
  function toggleNav() {
    var sidenav = document.getElementById("mySidenav");
    if (sidenav.style.width === "250px") {
      closeNav();
    } else {
      openNav();
    }
  }
  
  function closeNavOutside(event) {
    var sidenav = document.getElementById("mySidenav");
    var openbtn = document.getElementsByClassName("openbtn")[0];
    var content = document.getElementById("content"); // Replace "content" with the ID of your content area

    if (!sidenav.contains(event.target) && event.target !== openbtn && event.target !== content) {
        closeNav();
    }
}
