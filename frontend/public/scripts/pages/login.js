import { login } from "../api.js"; // import ฟังก์ชัน login จาก api.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const token = await login(username, password);

      if (token) {
        localStorage.setItem("token", token);
        window.location.href = "index.html";
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong.");
    }
  });
});