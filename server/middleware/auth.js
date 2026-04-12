import jwt from 'jsonwebtoken';
import { findUserById } from '../utils/sharedStorage.js';
// import Elder from '../models/Elder.js';
// import Volunteer from '../models/Volunteer.js';

// MongoDB models (when connected)
let Elder, Volunteer;

// Try to load MongoDB models, fallback to in-memory
try {
  Elder = require('../models/Elder.js').default;
  Volunteer = require('../models/Volunteer.js').default;
} catch (error) {
  console.log('Using in-memory storage for authentication');
}

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Try to find user in both collections (MongoDB when available)
    let user;
    if (typeof Elder !== 'undefined' && typeof Volunteer !== 'undefined') {
      // Use MongoDB when available
      user = await Elder.findById(decoded.id).select('-password');
      if (!user) {
        user = await Volunteer.findById(decoded.id).select('-password');
      }
    } else {
      // Fallback to shared in-memory storage
      user = findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

export const elderOnly = authorize('elder');
export const volunteerOnly = authorize('volunteer');
