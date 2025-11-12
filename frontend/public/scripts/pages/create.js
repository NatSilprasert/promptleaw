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