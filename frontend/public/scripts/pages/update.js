import { getOnePrompt, updatePrompt, deletePrompt } from "../api.js";

const urlParams = new URLSearchParams(window.location.search);
const promptId = urlParams.get("id");
const token = localStorage.getItem("token");

const titleInput = document.querySelector(".form-group-1 .form-input");
const promptTextarea = document.getElementById("prompt-textarea");

const imageBox = document.getElementById("image-box");
const previewImage = document.getElementById("preview-image");
const uploadText = document.getElementById("upload-text");
const imageInput = document.getElementById("imageinput");
const browseBtn = document.getElementById("browse-btn");

const updateBtn = document.getElementById("create");
const deleteBtn = document.getElementById("delete");

let selectedFile = null;
let currentImageUrl = null;

async function loadPrompt() {
  if (!promptId) return;

  try {
    const prompt = await getOnePrompt(promptId);
    
    titleInput.value = prompt.title || "";
    promptTextarea.value = prompt.prompt || "";

    if (prompt.imageUrl) {
      currentImageUrl = prompt.imageUrl;
      previewImage.src = prompt.imageUrl;
      previewImage.style.width = "100%";
      previewImage.style.height = "100%";
      previewImage.style.objectFit = "cover";
      previewImage.style.borderRadius = "16px";
      uploadText.style.display = "none";

      uploadText.style.display = "none";
      browseBtn.style.display = "none";
      imageBox.style.border = "none";
      imageBox.style.padding = "0";
      imageBox.classList.add("previewing");
    } else {
      previewImage.src = "assets/upload.svg";
      previewImage.style.width = "36px";
      previewImage.style.height = "36px";
      uploadText.style.display = "block";
    }

  } catch (err) {
    console.error("Error loading prompt:", err);
    alert("Failed to load prompt");
  }
}

// เลือกไฟล์ใหม่
previewImage.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  selectedFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.style.width = "100%";
    previewImage.style.height = "100%";
    previewImage.style.objectFit = "cover";
    previewImage.style.borderRadius = "16px";
    uploadText.style.display = "none";
  };
  reader.readAsDataURL(file);
});

// Update Prompt
updateBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const prompt = promptTextarea.value.trim();

  if (!title || !prompt) {
    alert("Title and prompt are required");
    return;
  }

  updateBtn.disabled = true;
  updateBtn.innerHTML = `
    <div class="spinner"></div> Updating...
  `;

  try {
    const item = {
        title,
        prompt,
        imageFile: selectedFile
    }

    await updatePrompt(item, promptId, token);
    alert("Prompt updated successfully!");
    window.location.href = "my-prompts.html";

  } catch (err) {
    console.error("Error updating prompt:", err);
    alert("Failed to update prompt");
  
  } finally {
    updateBtn.disabled = false;
    updateBtn.innerHTML = "Update";
  }
});

// Delete Prompt
deleteBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!confirm("Are you sure you want to delete this prompt?")) return;

  try {
    await deletePrompt(promptId, token);
    alert("Prompt deleted successfully!");
    window.location.href = "my-prompts.html";

  } catch (err) {
    console.error("Error deleting prompt:", err);
    alert("Failed to delete prompt");
  }
});

loadPrompt();