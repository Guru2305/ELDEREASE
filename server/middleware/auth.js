import jwt from 'jsonwebtoken';
// import Elder from '../models/Elder.js';
// import Volunteer from '../models/Volunteer.js';

// In-memory storage (same as in authController)
let users = {
  elders: [],
  volunteers: []
};

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
    
    // Try to find user in both collections (in-memory)
    let user = users.elders.find(u => u._id === decoded.id);
    if (!user) {
      user = users.volunteers.find(u => u._id === decoded.id);
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
