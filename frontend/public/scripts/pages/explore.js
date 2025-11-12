import { getAllPrompt } from "../api.js";

const list = document.getElementById("promptCardSection");

async function renderPrompts() {
  const prompts = await getAllPrompt();
  list.innerHTML = "";

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
        <img src="assets/wand-sparkles.svg" width="16px" height="16px" alt="AI Icon" class="btn-icon">
        <span>Create with AI</span>
    `;

    btn.addEventListener("click", () => {
      window.location.href = `prompt.html?id=${p._id}`;
    });

    card.appendChild(img);
    card.appendChild(btn);
    list.appendChild(card);
  });
}

renderPrompts();