// Toggle menu visibility on mobile
const hamburger = document.getElementById("hamburger");
const closeNav = document.getElementById("nav-x");
const nav = document.getElementById("nav");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
});

closeNav.addEventListener("click", () => {
    nav.classList.toggle("active");
});

// Create Prompt
const createBtn = document.getElementById("create-prompt");

if (createBtn != null) {
    createBtn.addEventListener("click", () => {
        window.location.href = "create.html";
    });
}

// Check login
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const navRight = document.querySelector(".nav-right");

  if (token) {
    navRight.innerHTML = "";

    const logoutBtn = document.createElement("button");
    logoutBtn.className = "signout-btn";
    logoutBtn.innerHTML = `
        <img src="assets/log-out.svg" width="16" height="16" alt="Sign Out Icon" style="margin-right: 8px;">
        Sign Out
    `;
    
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token"); 
      location.reload();
    });

    navRight.appendChild(logoutBtn);
  }
});