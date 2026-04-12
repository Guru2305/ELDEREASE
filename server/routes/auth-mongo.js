import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase, toObjectId } from '../utils/db.js';

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, age, role, address, skills, emergencyContacts } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !phone || !age || !role || !address) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    if (!['elder', 'volunteer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either elder or volunteer'
      });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user document
    const userDoc = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      age: parseInt(age),
      role,
      address,
      createdAt: new Date(),
      isActive: true
    };

    // Add role-specific fields
    if (role === 'elder') {
      userDoc.emergencyContacts = emergencyContacts || [];
    } else if (role === 'volunteer') {
      userDoc.skills = skills || [];
      userDoc.ratings = { average: 0, totalRatings: 0, reviews: [] };
    }

    // Insert user
    const result = await db.collection('users').insertOne(userDoc);
    const userId = result.insertedId;

    // Generate JWT token
    const token = jwt.sign(
      { id: userId.toString(), role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Return user data without password
    const userResponse = {
      _id: userId,
      firstName,
      lastName,
      email,
      phone,
      age: parseInt(age),
      role,
      address,
      isActive: true,
      createdAt: userDoc.createdAt
    };

    if (role === 'elder') {
      userResponse.emergencyContacts = emergencyContacts || [];
    } else if (role === 'volunteer') {
      userResponse.skills = skills || [];
      userResponse.ratings = { average: 0, totalRatings: 0, reviews: [] };
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Return user data without password
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      age: user.age,
      role: user.role,
      address: user.address,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    if (user.role === 'elder') {
      userResponse.emergencyContacts = user.emergencyContacts || [];
    } else if (user.role === 'volunteer') {
      userResponse.skills = user.skills || [];
      userResponse.ratings = user.ratings || { average: 0, totalRatings: 0, reviews: [] };
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find user
    const user = await db.collection('users').findOne({ _id: toObjectId(decoded.id) });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Return user data without password
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      age: user.age,
      role: user.role,
      address: user.address,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    if (user.role === 'elder') {
      userResponse.emergencyContacts = user.emergencyContacts || [];
    } else if (user.role === 'volunteer') {
      userResponse.skills = user.skills || [];
      userResponse.ratings = user.ratings || { average: 0, totalRatings: 0, reviews: [] };
    }

    res.status(200).json({
      success: true,
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

export default router;
