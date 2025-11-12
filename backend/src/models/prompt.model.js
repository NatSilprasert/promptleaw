import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Prompt', promptSchema);