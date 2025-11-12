import { register } from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const token = await register(username, password);
      
      if (token) {
        localStorage.setItem("token", token);
        window.location.href = "index.html"; 
      } else {
        alert("Registration failed. Please try again.");
      }

    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong.");
    }
  });
});