const burger = document.getElementById("burgerMenu");
const sidebar = document.getElementById("sidebar");
burger.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-open");
});
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
profileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (profileDropdown.style.display === "block") {
    profileDropdown.style.display = "none";
  } else {
    profileDropdown.style.display = "block";
  }
});
