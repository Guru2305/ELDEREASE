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
          emergencyContacts: elder.emergencyContacts || [],
          medicalConditions: elder.medicalConditions || [],
          preferences: elder.preferences || {},
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
    
    // Mock bookings data for testing (using real elder ID)
    const mockBookings = [
      {
        _id: '1',
        elderId: req.user._id,
        volunteerId: {
          _id: 'v1',
          firstName: req.user.firstName, // Use real elder's first name
          lastName: req.user.lastName,   // Use real elder's last name
          phone: req.user.phone,
          ratings: { average: 4.5 },
          skills: ['companion', 'medical']
        },
        service: 'Companionship',
        status: status || 'pending',
        scheduledDate: new Date(),
        createdAt: new Date()
      }
    ];
    
    const filteredBookings = status 
      ? mockBookings.filter(b => b.status === status)
      : mockBookings;

    const paginatedBookings = filteredBookings.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      data: {
        bookings: paginatedBookings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredBookings.length / limit),
          total: filteredBookings.length
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
    // Mock stats data for testing
    const mockStats = {
      totalBookings: 5,
      completedBookings: 3,
      pendingBookings: 2,
      cancelledBookings: 0,
      averageRating: 4.5,
      totalSpend: 2500
    };

    res.status(200).json({
      success: true,
      data: mockStats
    });
  } catch (error) {
    console.error('Get elder stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
