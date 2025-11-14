import { getAllPrompt } from "../api.js";

const list = document.getElementById("promptCardSection");
const searchBox = document.getElementById("search-input");

let allPrompts = [];

async function renderPrompts(promptsToRender) {
  list.innerHTML = "";

  promptsToRender.forEach(p => {
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

    card.addEventListener("click", () => {
      window.location.href = `prompt.html?id=${p._id}`;
    });

    card.appendChild(img);
    card.appendChild(btn);
    list.appendChild(card);
  });
}

async function init() {
  allPrompts = await getAllPrompt();
  renderPrompts(allPrompts);
}

// ฟัง event จากช่อง search
searchBox.addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  const filtered = allPrompts.filter(p => 
    p.title?.toLowerCase().includes(query) ||
    p.prompt?.toLowerCase().includes(query)
  );
  renderPrompts(filtered);
});

init();