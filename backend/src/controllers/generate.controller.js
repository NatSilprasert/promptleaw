import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const generateImageHandler = async (req, res) => {
  try {
    const { prompt } = req.body;
    const imagePath = req.file.path;

    // Read file in buffer
    const imageData = fs.readFileSync(imagePath);
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

    fs.unlinkSync(imagePath); // Delete file done

    res.status(200).json({
      success: true,
      message: "Image generated successfully",
      imageBase64: savedImageBase64,
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
