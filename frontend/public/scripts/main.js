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