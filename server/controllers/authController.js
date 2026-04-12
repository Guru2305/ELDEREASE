import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
// import Elder from '../models/Elder.js';
// import Volunteer from '../models/Volunteer.js';

// In-memory storage for testing (fallback when MongoDB unavailable)
let users = {
  elders: [],
  volunteers: []
};

// MongoDB models (when connected)
let Elder, Volunteer;

// Try to load MongoDB models, fallback to in-memory
try {
  Elder = require('../models/Elder.js').default;
  Volunteer = require('../models/Volunteer.js').default;
} catch (error) {
  console.log('⚠️ MongoDB models not loaded, using in-memory storage');
}

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user (Elder or Volunteer)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { role, firstName, lastName, email, password, phone, ...otherFields } = req.body;

    // Check if user already exists
    let existingUser;
    if (Elder && Volunteer) {
      // Use MongoDB when available
      existingUser = await Elder.findOne({ email });
      if (!existingUser) {
        existingUser = await Volunteer.findOne({ email });
      }
    } else {
      // Fallback to in-memory
      existingUser = users.elders.find(user => user.email === email);
      if (!existingUser) {
        existingUser = users.volunteers.find(user => user.email === email);
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    const userId = Date.now().toString();
    
    if (role === 'elder') {
      // Validate elder-specific fields
      const { age, address, emergencyContacts } = otherFields;
      if (!age || !address) {
        return res.status(400).json({
          success: false,
          message: 'Age and address are required for elders'
        });
      }

      if (Elder && Volunteer) {
        // Use MongoDB
        user = new Elder({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
          age,
          address,
          emergencyContacts: emergencyContacts || [],
          ...otherFields
        });
        
        await user.save();
      } else {
        // Fallback to in-memory
        user = {
          _id: userId,
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
          age,
          address,
          emergencyContacts: emergencyContacts || [],
          role: 'elder',
          isActive: true,
          createdAt: new Date()
        };
        
        users.elders.push(user);
      }
    } else if (role === 'volunteer') {
      // Validate volunteer-specific fields
      const { age, address, skills } = otherFields;
      if (!age || !address || !skills) {
        return res.status(400).json({
          success: false,
          message: 'Age, address, and skills are required for volunteers'
        });
      }

      if (Elder && Volunteer) {
        // Use MongoDB
        user = new Volunteer({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
          age,
          address,
          skills,
          ...otherFields
        });
        
        await user.save();
      } else {
        // Fallback to in-memory
        user = {
          _id: userId,
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
          age,
          address,
          skills,
          role: 'volunteer',
          isActive: true,
          ratings: { average: 0, totalRatings: 0, reviews: [] },
          createdAt: new Date()
        };
        
        users.volunteers.push(user);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Generate token
    const token = generateToken(user._id, role);

    res.status(201).json({
      success: true,
      message: `${role === 'elder' ? 'Elder' : 'Volunteer'} registered successfully`,
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role
        }
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
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user in both collections
    let user = users.elders.find(u => u.email === email);
    let role = 'elder';
    
    if (!user) {
      user = users.volunteers.find(u => u.email === email);
      role = 'volunteer';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
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

    // Generate token
    const token = generateToken(user._id, role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role,
          // Add role-specific data
          ...(role === 'elder' && {
            age: user.age,
            address: user.address
          }),
          ...(role === 'volunteer' && {
            age: user.age,
            skills: user.skills,
            ratings: user.ratings
          })
        }
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
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    const role = req.userRole;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role,
          // Add role-specific data
          ...(role === 'elder' && {
            age: user.age,
            address: user.address,
            emergencyContacts: user.emergencyContacts,
            medicalConditions: user.medicalConditions,
            preferences: user.preferences
          }),
          ...(role === 'volunteer' && {
            age: user.age,
            address: user.address,
            skills: user.skills,
            availability: user.availability,
            experience: user.experience,
            ratings: user.ratings,
            backgroundCheck: user.backgroundCheck,
            isOnline: user.isOnline
          })
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const role = req.userRole;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.password;
    delete updates.isActive;
    delete updates.createdAt;
    delete updates.updatedAt;

    // Update user
    Object.assign(user, updates);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role,
          ...updates
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
