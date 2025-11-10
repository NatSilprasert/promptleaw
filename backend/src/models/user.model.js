import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  prompts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);