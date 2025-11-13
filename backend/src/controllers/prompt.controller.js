import jwt from "jsonwebtoken";
import promptModel from "../models/prompt.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import userModel from "../models/user.model.js";

export const createPrompt = async (req, res) => {
  try {
    const { userId } = req;
    const { title, prompt } = req.body;
    const imageFile = req.file;

    let imageUrl = null;

    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: "prompts",
      });
      imageUrl = uploadResult.secure_url;

      fs.unlinkSync(imageFile.path);
    }

    const newPrompt = new promptModel({
      title,
      prompt,
      imageUrl,
      createdBy: userId,
    });

    const savedPrompt = await newPrompt.save();

    return res.status(201).json({
      success: true,
      message: "Prompt created successfully.",
      prompt: savedPrompt,
    });

  } catch (error) {
    console.error("Error creating prompt:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating prompt.",
    });
  }
};

export const getAllPrompt = async (req, res) => {
  try {
    const prompts = await promptModel.find();

    return res.status(200).json({
      success: true,
      message: "All prompts retrieved successfully.",
      prompts,
    });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching prompts.",
    });
  }
};

export const getOnePrompt = async (req, res) => {
  try {
    const { id } = req.params;

    const prompt = await promptModel.findById(id);
    
    if (!prompt) {
        return res.status(404).json({
            success: false,
            message: "Prompt not found.",
        });
    }

    const userId = prompt.createdBy;
    const user = await userModel.findById(userId);
    
     if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Prompt retrieved successfully.",
      prompt,
      user
    });

  } catch (error) {
    console.error("Error fetching prompt:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching the prompt.",
    });
  }
};

export const getFilterPrompt = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No token provided." 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const userPrompts = await promptModel.find({ createdBy: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
        success: true,
        message: "Prompts retrieved successfully.",
        prompts: userPrompts,
        });

    } catch (error) {
        console.error("Error filtering prompts:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error while filtering prompts.",
        });
    }
};

export const updatePrompt = async (req, res) => {
    try {
    const { id } = req.params;
    const { title, prompt } = req.body;
    const imageFile = req.file;

    const existingPrompt = await promptModel.findById(id);
    if (!existingPrompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    let imageUrl = existingPrompt.imageUrl;

     if (imageFile) {
      if (existingPrompt.imageUrl) {
        try {
          const publicId = existingPrompt.imageUrl
            .split("/")
            .slice(-2)
            .join("/")
            .replace(/\.[^/.]+$/, "");

          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("Failed to delete old image from Cloudinary:", err.message);
        }
      }

      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: "prompts",
      });
      imageUrl = uploadResult.secure_url;

      fs.unlinkSync(imageFile.path);
    }

    existingPrompt.title = title || existingPrompt.title;
    existingPrompt.prompt = prompt || existingPrompt.prompt;
    existingPrompt.imageUrl = imageUrl;

    await existingPrompt.save();

    res.status(200).json({
      message: "Prompt updated successfully",
      prompt: existingPrompt
    });

  } catch (error) {
    console.error("Error updating prompt:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating prompt.",
    });
  }
};

export const deletePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPrompt = await promptModel.findByIdAndDelete(id);

    if (!deletedPrompt) {
      return res.status(404).json({
        success: false,
        message: "Prompt not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Prompt deleted successfully.",
      prompt: deletedPrompt,
    });

  } catch (error) {
    console.error("Error deleting prompt:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting prompt.",
    });
  }
};