// controllers/user.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import userModel from '../models/user.model.js';

// Helper: sign a JWT with the user's Mongo _id
const signToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error('Missing JWT_SECRET');
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const registerHandler = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    // Validate input: both username and password are required
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required',data: null });
    }

    const normUsername = String(username).trim();

    // Check if the username is already taken
    const exists = await userModel.findOne({ username: normUsername });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Username already taken',data: null });
    }

    // Hash the password and generate a random userId
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = 'u_' + randomBytes(6).toString('hex');

    // Create the user document
    const user = await userModel.create({
      userId,
      username: normUsername,
      passwordHash,
    });

    // Issue a JWT containing the user's Mongo _id
    const token = signToken(user._id.toString());

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    // Handle duplicate key errors (e.g., username or userId already exists)
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: 'Duplicate field value', data: null });
    }
    // Fallback for unexpected errors
    console.error('registerHandler error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error',data: null });
  }
};

export const loginHandler = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    // Validate input: both username and password are required
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'username and password are required',data: null });
    }

    const normUsername = String(username).trim();

    // Fetch user by username; return a generic 401 if not found
    const user = await userModel.findOne({ username: normUsername });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password',data: null });
    }

    // Verify the plaintext password against the stored bcrypt hash
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid username or password',data: null });
    }

    // Issue a JWT containing the user's Mongo _id
    const token = signToken(user._id.toString());

    // Respond with auth token and minimal public user info (no password/hash)
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    // Fallback for unexpected errors
    console.error('loginHandler error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error', data: null });
  }
};
