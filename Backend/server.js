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

// SERVERLESS MONGOOSE CONNECTION BUFFER
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully! 🔌");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
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
    await connectDB(); // Ensure DB is connected before query running
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const isAdmin = email.toLowerCase() === 'luka.chitidze2109@gmail.com';

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin,
      canCreateLevels: isAdmin 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed. Email might already exist." });
  }
});

// Login

app.post('/api/auth/login', async (req, res) => {
  try {
    await connectDB(); 
    const { email, password } = req.body;
    
    // 1. Check if input fields are missing entirely
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Missing credentials", 
        message: "Please provide both an email and a password." 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: "Authentication failed", 
        message: "User not found." 
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ 
        success: false,
        error: "Authentication failed", 
        message: "Invalid password." 
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin, canCreateLevels: user.canCreateLevels },
      process.env.JWT_SECRET || 'SUPERSECRETKEY'
    );

    res.json({ 
      success: true,
      token, 
      user: { 
        email: user.email, 
        isAdmin: user.isAdmin, 
        canCreateLevels: user.canCreateLevels, 
        status: user.levelCreationStatus || 'none' 
      } 
    });

  } catch (error) {
    // Log the full error into your server terminal/Vercel logs for your eyes only
    console.error("🔥 CRITICAL LOGIN ERROR:", error);

    // 2. Custom check for Database Connection Issues
    if (error.name === 'MongooseServerSelectionError' || error.message.includes('buffering timed out')) {
      return res.status(503).json({
        success: false,
        error: "Database offline",
        message: "Unable to connect to the database. Please verify your MongoDB network access permissions.",
        technicalDetails: error.message
      });
    }

    // 3. Custom check for JWT configuration problems
    if (error.message.includes('secret or private key must have a value')) {
      return res.status(500).json({
        success: false,
        error: "Configuration Error",
        message: "The backend server is missing its JWT_SECRET environment key.",
        technicalDetails: error.message
      });
    }

    // 4. Catch-all for any other unexpected failures
    res.status(500).json({ 
      success: false,
      error: "Internal Server Login crash.", 
      message: "An unexpected error occurred during login handling.",
      technicalDetails: error.message // Exposes the raw engine error (e.g., bcrypt crash, type errors)
    });
  }
});

// --- ADMIN & CREATION PERMISSION ENDPOINTS ---

app.post('/api/user/request-creator', authenticateToken, async (req, res) => {
  await connectDB();
  await User.findByIdAndUpdate(req.user.id, { levelCreationStatus: 'requested' });
  res.json({ message: "Request sent to Admin successfully!" });
});

app.get('/api/admin/requests', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Access Denied" });
  await connectDB();
  const pendingUsers = await User.find({ levelCreationStatus: 'requested' }, 'email levelCreationStatus');
  res.json(pendingUsers);
});

app.post('/api/admin/approve-user', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Access Denied" });
  await connectDB();
  const { userId, approve } = req.body;
  
  await User.findByIdAndUpdate(userId, {
    canCreateLevels: approve,
    levelCreationStatus: approve ? 'approved' : 'rejected'
  });

  res.json({ message: `User status updated to ${approve ? 'Approved' : 'Rejected'}` });
});

// --- QUIZ LEVEL ENDPOINTS ---

app.get('/api/levels', async (req, res) => {
  try {
    await connectDB();
    const levels = await Level.find().populate('creator', 'email');
    res.json(levels);
  } catch (error) {
    res.status(500).json([]);
  }
});

app.post('/api/levels/create', authenticateToken, async (req, res) => {
  if (!req.user.canCreateLevels) return res.status(403).json({ error: "You do not have creator rights." });
  await connectDB();
  
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

connectDB();

// Only listen on a port if running locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Local Server active on port ${PORT} 🚀`));
}

export default app;

