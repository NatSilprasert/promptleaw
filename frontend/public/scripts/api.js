
import { BACKEND_URL } from "./config.js";

export async function createPrompt(title, prompt, imageFile) {
   try {
      const formData = new FormData();
      formData.append("title" , title);
      formData.append("prompt", prompt);
      formData.append("imageFile", imageFile);
      
      await fetch(BACKEND_URL + "/api/prompt/create", {
        method: "POST",
        body: formData
      });

   } catch (error) {
      console.log(error.message);
   }
}

export async function getAllPrompt() {
   try {
        const response = await fetch(BACKEND_URL + "/api/prompt", {
            method: "GET"
        })

        const data = await response.json();
        const prompts = data?.prompts;
        if(!prompts) throw new Error("No prompts from server");

        return prompts;

   } catch (error) {
      console.log(error.message);
   }
}

export async function getOnePrompt(id) {
   try {
     const response = await fetch(BACKEND_URL + `/api/prompt/${id}`, {
        method: "GET",
     });

     const data = await response.json();
     const prompt = data?.prompt;
     if (!prompt){
        throw new Error("No prompt from server");
     }
     
     return prompt;

   } catch (error) {
      console.log(error.message);
   }
}

// FiterPrompt
export async function getMyPrompt(id) {
   try {
     const response = await fetch(BACKEND_URL + '/api/prompt/filter', {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "user_id": id
        })
     });

     const data = await response.json();
     const prompts = data?.prompts;
     if (!prompts){
        throw new Error("No prompts from server");
     }
     
     return prompts;

   } catch (error) {
      console.log(error.message);
   }
}

export async function updatePrompt(item, id) {
   try {
     await fetch(BACKEND_URL + `/api/prompt/update/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
     });
   } catch (error) {
     console.log(error.message);
   }
}

export async function deletePrompt(id) {
    try {
        await fetch(BACKEND_URL + `/api/prompt/${id}`, {
            method: "DELETE"
        });
    } catch (error) {
        console.log(error.message);
    }
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