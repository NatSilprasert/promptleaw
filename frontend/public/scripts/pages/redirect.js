const urlParams = new URLSearchParams(window.location.search);
const imageUrl = urlParams.get("imageUrl");
const downloadBtn = document.getElementById("download-btn");

if (imageUrl) {
    const cardImageDiv = document.querySelector(".promptCardImage");
    
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Generated Prompt Image";
    
    cardImageDiv.appendChild(img);


    downloadBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = "prompt-image.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(blobUrl); // ล้าง memory
        } catch (err) {
            console.error("Failed to download image:", err);
        }
    });

} else {
    console.error("No image URL found in query parameters.");
}