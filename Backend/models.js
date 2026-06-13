import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  canCreateLevels: { type: Boolean, default: false }, // Controlled by Admin
  levelCreationStatus: { 
    type: String, 
    enum: ['none', 'requested', 'approved', 'rejected'], 
    default: 'none' 
  }
});

// Level Schema
const levelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['default', 'community'], required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{
    question: { type: String, required: true },
    answers: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    timeToThink: { type: Number, default: 15 },
    maxScore: { type: Number, default: 100 }
  }]
});

export const User = mongoose.model('User', userSchema);
export const Level = mongoose.model('Level', levelSchema);