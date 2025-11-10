import { BACKEND_URL } from "./config.js";

export async function createPrompt(item) {
  
}

export async function getAllPrompt() {

}

export async function getOnePrompt(id) {

}

// FiterPrompt
export async function getMyPrompt(id) {

}

export async function updatePrompt(item, id) {

}

export async function deletePrompt(id) {

}

export async function login(username, password) {

}

export async function register(username, password) {
    
}

export async function generateImage(prompt, imageFile) {
    try {
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("image", imageFile);
    
        const response = await fetch(BACKEND_URL + "/api/generate", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        const imageBase64 = data?.imageBase64;
        if (!imageBase64) throw new Error("No image returned from server");
        const imageUrl = `data:image/png;base64,${imageBase64}`;
        
        return imageUrl;

    } catch (error) {
        console.log(error.message);
    }
}