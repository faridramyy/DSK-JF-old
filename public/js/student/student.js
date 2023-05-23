let menu = document.getElementById("profileMenu");

function showMenu() {
menu.classList.toggle("active-list");
}
document.addEventListener("click", function (e) {
if (
  menu.classList.contains("active-list") &&
  !menu.contains(e.target) &&
  !document.getElementById("profilePic").contains(e.target)
) {
  menu.classList.remove("active-list");
}
});

//nav on scroll
onscroll = () => {
  if (window.scrollY > 5) {
    document.getElementById("nav").classList.add("scroll");
  } else {
    document.getElementById("nav").classList.remove("scroll");
  }
};
//search
const search = document.querySelector(".search");
const btn = document.querySelector(".btn");
const input = document.querySelector(".input");

btn.addEventListener("click", () => {
  search.classList.toggle("active");
  input.focus();
});