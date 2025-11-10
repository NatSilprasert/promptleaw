import express from 'express'
import authUser from '../middleware/auth.js'
import { createPrompt, deletePrompt, getAllPrompt, getFilterPrompt, getOnePrompt, updatePrompt } from '../controllers/prompt.controller.js'

const promptRouter = express.Router()

promptRouter.get('/', getAllPrompt)
promptRouter.get('/:id', getOnePrompt)
promptRouter.post('/filter', authUser, getFilterPrompt)
promptRouter.post('/create', authUser, createPrompt)
promptRouter.put('/update/:id', authUser, updatePrompt)
promptRouter.delete('/:id', authUser, deletePrompt)

export default promptRouter