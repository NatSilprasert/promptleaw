import { createPrompt, createPrompt as createPromptAPI } from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("imageinput");
  const browseBtn = document.getElementById("browse-btn");
  const imageBox = document.getElementById("image-box");
  const previewImage = document.getElementById("preview-image");
  const uploadText = document.getElementById("upload-text");

  const form = document.getElementById("create-form");
  const titleInput = form.querySelector(".form-group-1 .form-input");
  const promptTextarea = form.querySelector("#prompt-textarea");
  const clearBtn = document.getElementById("clear");

  let selectedFile = null;

  browseBtn.addEventListener("click", () => fileInput.click());
  imageBox.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
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
      browseBtn.style.display = "none";
      imageBox.style.border = "none";
      imageBox.style.padding = "0";
      imageBox.classList.add("previewing");
    };
    reader.readAsDataURL(file);
  });

  // Clear form
  clearBtn.addEventListener("click", () => {
    selectedFile = null;
    previewImage.src = "assets/upload.svg";
    previewImage.style.width = "36px";
    previewImage.style.height = "36px";
    uploadText.style.display = "block";
    browseBtn.style.display = "block";
    imageBox.style.border = "2px dashed #524FF0";
    imageBox.style.padding = "60px 0";
    imageBox.classList.remove("previewing");
  });

  // Submit form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const prompt = promptTextarea.value.trim();
    const token = localStorage.getItem("token");

    if (!title || !prompt) {
      alert("Title and prompt are required");
      return;
    }

    try {
        const newPrompt = await createPrompt(title, prompt, selectedFile, token);

        window.location.href = "my-prompts.html";

    } catch (error) {
        console.error("Error creating prompt:", error);
        alert(error.message)
    }
  })
});