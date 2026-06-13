import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Level } from './models.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'SUPERSECRETKEY', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ENDPOINTS ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Automatically set your specific email as Admin
    const isAdmin = email.toLowerCase() === 'luka.chitidze2109@gmail.com';

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin,
      canCreateLevels: isAdmin // Admin can naturally create levels
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed. Email might already exist." });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(400).json({ error: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin, canCreateLevels: user.canCreateLevels },
    process.env.JWT_SECRET || 'SUPERSECRETKEY'
  );

  res.json({ token, user: { email: user.email, isAdmin: user.isAdmin, canCreateLevels: user.canCreateLevels, status: user.levelCreationStatus } });
});

// --- ADMIN & CREATION PERMISSION ENDPOINTS ---

// User requests permission to create levels
app.post('/api/user/request-creator', authenticateToken, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { levelCreationStatus: 'requested' });
  res.json({ message: "Request sent to Admin successfully!" });
});

// Admin views pending creator requests
app.get('/api/admin/requests', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Access Denied" });
  const pendingUsers = await User.find({ levelCreationStatus: 'requested' }, 'email levelCreationStatus');
  res.json(pendingUsers);
});

// Admin approves or rejects a request
app.post('/api/admin/approve-user', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Access Denied" });
  const { userId, approve } = req.body; // approve: true or false
  
  await User.findByIdAndUpdate(userId, {
    canCreateLevels: approve,
    levelCreationStatus: approve ? 'approved' : 'rejected'
  });

  res.json({ message: `User status updated to ${approve ? 'Approved' : 'Rejected'}` });
});

// --- QUIZ LEVEL ENDPOINTS ---

// Fetch all levels
app.get('/api/levels', async (req, res) => {
  const levels = await Level.find().populate('creator', 'email');
  res.json(levels);
});

// Creator adds a new level
app.post('/api/levels/create', authenticateToken, async (req, res) => {
  if (!req.user.canCreateLevels) return res.status(403).json({ error: "You do not have creator rights." });
  
  const { title, category, questions } = req.body;
  const newLevel = new Level({
    title,
    category,
    creator: req.user.id,
    questions
  });

  await newLevel.save();
  res.status(201).json({ message: "Level added successfully!" });
});

// Connect to MongoDB & Start
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp')
  .then(() => app.listen(5000, () => console.log("Server active on port 5000")));

  export default app;