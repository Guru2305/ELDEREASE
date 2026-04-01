import express from 'express';
import { authenticate, elderOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and elder role
router.use(authenticate);
router.use(elderOnly);

// @desc    Get elder profile
// @route   GET /api/elders/profile
// @access  Private (Elder only)
router.get('/profile', async (req, res) => {
  try {
    const elder = req.user;
    
    res.status(200).json({
      success: true,
      data: {
        elder: {
          id: elder._id,
          firstName: elder.firstName,
          lastName: elder.lastName,
          email: elder.email,
          phone: elder.phone,
          age: elder.age,
          address: elder.address,
          emergencyContacts: elder.emergencyContacts,
          medicalConditions: elder.medicalConditions,
          preferences: elder.preferences,
          isActive: elder.isActive,
          createdAt: elder.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get elder profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update elder profile
// @route   PUT /api/elders/profile
// @access  Private (Elder only)
router.put('/profile', async (req, res) => {
  try {
    const elder = req.user;
    const allowedUpdates = [
      'phone',
      'address',
      'emergencyContacts',
      'medicalConditions',
      'preferences'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    Object.assign(elder, updates);
    await elder.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        elder: {
          id: elder._id,
          firstName: elder.firstName,
          lastName: elder.lastName,
          email: elder.email,
          phone: elder.phone,
          age: elder.age,
          address: elder.address,
          emergencyContacts: elder.emergencyContacts,
          medicalConditions: elder.medicalConditions,
          preferences: elder.preferences,
          isActive: elder.isActive
        }
      }
    });
  } catch (error) {
    console.error('Update elder profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get elder's booking history
// @route   GET /api/elders/bookings
// @access  Private (Elder only)
router.get('/bookings', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const Booking = (await import('../models/Booking.js')).default;
    
    let query = { elderId: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('volunteerId', 'firstName lastName phone ratings skills')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get elder bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get elder statistics
// @route   GET /api/elders/stats
// @access  Private (Elder only)
router.get('/stats', async (req, res) => {
  try {
    const Booking = (await import('../models/Booking.js')).default;
    
    const stats = await Booking.aggregate([
      { $match: { elderId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments({ elderId: req.user._id });
    
    const completedBookings = await Booking.countDocuments({ 
      elderId: req.user._id, 
      status: 'completed' 
    });

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        completedBookings,
        stats: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get elder stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
