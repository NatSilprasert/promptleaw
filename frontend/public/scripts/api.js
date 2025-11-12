
import { BACKEND_URL } from "./config.js";

export async function createPrompt(title, prompt, imageFile, token) {
   try {
      const formData = new FormData();
      formData.append("title" , title);
      formData.append("prompt", prompt);
      formData.append("imageFile", imageFile);
      
      await fetch(BACKEND_URL + "/api/prompt/create", {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${token}`
          },
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
export async function getMyPrompt(token) {
   try {
     const response = await fetch(BACKEND_URL + '/api/prompt/filter', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
        
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

export async function updatePrompt(item, id, token) {
   try {
        const formData = new FormData();
        formData.append("title", item.title);
        formData.append("prompt", item.prompt);

        if (item.imageFile) {
            formData.append("imageFile", item.imageFile);
        }

        await fetch(BACKEND_URL + `/api/prompt/update/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

   } catch (error) {
     console.log(error.message);
   }
}

export async function deletePrompt(id, token) {
    try {
        await fetch(BACKEND_URL + `/api/prompt/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            },
        });
    } catch (error) {
        console.log(error.message);
    }
}

export async function login(username, password) {
    try {
        const response = await fetch(BACKEND_URL + '/api/user/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }

        const data = await response.json();
        return data.token;      

   } catch (error) {
        console.log(error.message);
   }
}

export async function register(username, password) {
    try {
        const response = await fetch(BACKEND_URL + '/api/user/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Register failed");
        }

        const data = await response.json();
        return data.token;

   } catch (error) {
        console.log(error.message);
   }
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