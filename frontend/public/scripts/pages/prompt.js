import { generateImage, getOnePrompt } from "../api.js";

const urlParams = new URLSearchParams(window.location.search);
const promptId = urlParams.get("id");
const token = localStorage.getItem("token");

const titleText = document.getElementById("prompt");
const profileDiv = document.getElementById("profilename");
const bigImage = document.getElementById("big-image");
const promptText = document.getElementById("prompt-textarea");
const generateBtn = document.getElementById("generateimage");
const additionalText = document.querySelectorAll(".promptbody .textbox")[1];
const imageInput = document.getElementById("imageinput");

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("imageinput");
  const browseBtn = document.getElementById("browse-btn");
  const imageBox = document.getElementById("image-box");
  const previewImage = document.getElementById("preview-image");
  const uploadText = document.getElementById("upload-text");

  browseBtn.addEventListener("click", () => fileInput.click());
  imageBox.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.style.width = "100%";
      previewImage.style.height = "100%";
      previewImage.style.objectFit = "cover";
      previewImage.style.borderRadius = "16px";

      uploadText.style.display = "none";
      browseBtn.style.display = "none";
      imageBox.style.border = "none";
      imageBox.style.backgroundColor = "#1f1f1f";
      imageBox.style.padding = "0";
    };
    reader.readAsDataURL(file);
  });
});

generateBtn.addEventListener("click", async () => {
    const basePrompt = promptText.value.trim();
    const additionalPrompt = additionalText.value.trim();

    const finalPrompt = additionalPrompt ? `${basePrompt} ${additionalPrompt}` : basePrompt;
    const imageFile = imageInput.files[0];

    if (!finalPrompt && !imageFile) {
        alert("Please provide a prompt or an image.");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.innerHTML = `
        <div class="spinner"></div> Generating...
    `;

    try {
        const imageUrl = await generateImage(finalPrompt, imageFile);
        if (imageUrl) window.location.href = `redirect.html?imageUrl=${encodeURIComponent(imageUrl)}`;

    } catch (err) {
        console.error("Failed to generate image:", err);
        alert("Failed to generate image.");
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `
            <img src="assets/wand-sparkles.svg" width="16px" height="16px" alt="">
            <p>
                Generate Image
            </p>
        `;


    }
});

async function loadPrompt() {
    if (!promptId) return;

    try {
        const { prompt, user } = await getOnePrompt(promptId);

        titleText.textContent = prompt.title;
        promptText.value = prompt.prompt;
        promptText.disabled = true;

        profileDiv.innerHTML = `
            <div class="profile-icon"></div>
            <p>${user.username}</p>
        `;

        bigImage.innerHTML = `
            <img src=${prompt.imageUrl} />
        `;
        
    } catch (err) {
        console.error("Error loading prompt:", err);
        alert("Failed to load prompt");
    }
}

loadPrompt();