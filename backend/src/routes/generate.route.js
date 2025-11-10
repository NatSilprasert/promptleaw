import express from 'express'
import authUser from '../middleware/auth.js'
import { generateImageHandler } from '../controllers/generate.controller.js'
import multer from 'multer';

const generateRouter = express.Router();
const upload = multer({ dest: "uploads/" });

generateRouter.post('/', upload.single("image"), authUser, generateImageHandler);

export default generateRouter