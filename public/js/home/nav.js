//nav on scroll
onscroll = () => {
    if (window.scrollY > 5) {
      document.getElementById("nav").classList.add("scroll");
    } else {
      document.getElementById("nav").classList.remove("scroll");
    }
  };
  
  // nav on mobile
  document.getElementById("menu-btn").addEventListener("click", () => {
    document.getElementById("ul").classList.add("active");
  });
  document.getElementById("menu-close").addEventListener("click", () => {
    document.getElementById("ul").classList.remove("active");
  });
  