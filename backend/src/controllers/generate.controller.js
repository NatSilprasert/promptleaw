import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const generateImageHandler = async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageFile = req.file.path;

    // Read file in buffer
    const imageData = fs.readFileSync(imageFile);
    const base64Image = imageData.toString("base64");

    const contents = [
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
      { text: prompt },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
    });

    const candidates = response.candidates || [];
    let savedImageBase64 = null;

    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          savedImageBase64 = part.inlineData.data;
        }
      }
    }

    fs.unlinkSync(imageFile); // Delete file done

    if (!savedImageBase64) {
      return res.status(400).json({
        success: false,
        message: "No generated image data returned.",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${savedImageBase64}`,
      { folder: "generated_images" }
    );

    res.status(200).json({
      success: true,
      message: "Image generated successfully",
      imageUrl: uploadResult.secure_url,
    });

  } catch (err) {
    console.error("Error generating image:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate image",
      data: null,
    });
  }
};
