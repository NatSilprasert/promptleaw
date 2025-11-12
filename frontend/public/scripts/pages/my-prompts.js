import { getMyPrompt } from "../api.js";

const list = document.getElementById("promptCardSection");

async function renderPrompts() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const prompts = await getMyPrompt(token);
  list.innerHTML = "";

  if (!prompts) return;

  prompts.forEach(p => {
    const card = document.createElement("div");
    card.className = "promptCard";

    const img = document.createElement("img");
    img.className = "prompt-image";
    img.alt = p.title || "Prompt image";
    img.src = p.imageUrl || "assets/placeholder.png";

    const btn = document.createElement("button");
    btn.className = "prompt-btn";
    btn.innerHTML = `
        <img src="assets/pencil.svg" width="16px" height="16px" alt="AI Icon" class="btn-icon">
        <span>Edit Item</span>
    `;

    btn.addEventListener("click", () => {
      window.location.href = `update.html?id=${p._id}`;
    });

    card.appendChild(img);
    card.appendChild(btn);
    list.appendChild(card);
  });
}

renderPrompts();