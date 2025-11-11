import express from 'express'
import authUser from '../middleware/auth.js'
import { createPrompt, deletePrompt, getAllPrompt, getFilterPrompt, getOnePrompt, updatePrompt } from '../controllers/prompt.controller.js'
import { upload } from '../middleware/upload.js';

const promptRouter = express.Router()

promptRouter.get('/', getAllPrompt)
promptRouter.get('/:id', getOnePrompt)
promptRouter.post('/filter', authUser, getFilterPrompt)
promptRouter.post('/create', authUser, upload.single("imageFile"), createPrompt)
promptRouter.put('/update/:id', authUser, updatePrompt)
promptRouter.delete('/:id', authUser, deletePrompt)

export default promptRouter