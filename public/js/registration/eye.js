const eye = document.getElementById("eye");
const closedEye = document.getElementById("closedEye");
const passwordInput = document.querySelector("#password");

eye.addEventListener("click", function () {
  passwordInput.type = "text";
  eye.style.display = "none";
  closedEye.style.display = "block";
});

closedEye.addEventListener("click", function () {
  passwordInput.type = "password";
  closedEye.style.display = "none";
  eye.style.display = "block";
});
