import express from 'express'
import authUser from '../middleware/auth.js'
import { generateImageHandler } from '../controllers/generate.controller.js'
import { upload } from '../middleware/upload.js';

const generateRouter = express.Router();

generateRouter.post('/', upload.single("imageFile"), generateImageHandler);

export default generateRouter