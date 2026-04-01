import express from 'express';
import { authenticate, volunteerOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and volunteer role
router.use(authenticate);
router.use(volunteerOnly);

// @desc    Get volunteer profile
// @route   GET /api/volunteers/profile
// @access  Private (Volunteer only)
router.get('/profile', async (req, res) => {
  try {
    const volunteer = req.user;
    
    res.status(200).json({
      success: true,
      data: {
        volunteer: {
          id: volunteer._id,
          firstName: volunteer.firstName,
          lastName: volunteer.lastName,
          email: volunteer.email,
          phone: volunteer.phone,
          age: volunteer.age,
          address: volunteer.address,
          skills: volunteer.skills,
          availability: volunteer.availability,
          experience: volunteer.experience,
          ratings: volunteer.ratings,
          backgroundCheck: volunteer.backgroundCheck,
          isOnline: volunteer.isOnline,
          currentLocation: volunteer.currentLocation,
          isActive: volunteer.isActive,
          createdAt: volunteer.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get volunteer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update volunteer profile
// @route   PUT /api/volunteers/profile
// @access  Private (Volunteer only)
router.put('/profile', async (req, res) => {
  try {
    const volunteer = req.user;
    const allowedUpdates = [
      'phone',
      'address',
      'skills',
      'availability',
      'experience'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    Object.assign(volunteer, updates);
    await volunteer.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        volunteer: {
          id: volunteer._id,
          firstName: volunteer.firstName,
          lastName: volunteer.lastName,
          email: volunteer.email,
          phone: volunteer.phone,
          age: volunteer.age,
          address: volunteer.address,
          skills: volunteer.skills,
          availability: volunteer.availability,
          experience: volunteer.experience,
          ratings: volunteer.ratings,
          backgroundCheck: volunteer.backgroundCheck,
          isOnline: volunteer.isOnline,
          currentLocation: volunteer.currentLocation,
          isActive: volunteer.isActive
        }
      }
    });
  } catch (error) {
    console.error('Update volunteer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update volunteer online status
// @route   PUT /api/volunteers/online-status
// @access  Private (Volunteer only)
router.put('/online-status', async (req, res) => {
  try {
    const { isOnline, latitude, longitude } = req.body;
    const volunteer = req.user;

    volunteer.isOnline = isOnline;
    
    if (isOnline && latitude && longitude) {
      volunteer.currentLocation = {
        latitude,
        longitude,
        updatedAt: new Date()
      };
    }

    await volunteer.save();

    res.status(200).json({
      success: true,
      message: 'Online status updated successfully',
      data: {
        isOnline: volunteer.isOnline,
        currentLocation: volunteer.currentLocation
      }
    });
  } catch (error) {
    console.error('Update online status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating online status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get volunteer's booking history
// @route   GET /api/volunteers/bookings
// @access  Private (Volunteer only)
router.get('/bookings', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const Booking = (await import('../models/Booking.js')).default;
    
    let query = { volunteerId: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('elderId', 'firstName lastName phone address emergencyContacts')
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
    console.error('Get volunteer bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get volunteer statistics
// @route   GET /api/volunteers/stats
// @access  Private (Volunteer only)
router.get('/stats', async (req, res) => {
  try {
    const Booking = (await import('../models/Booking.js')).default;
    
    const stats = await Booking.aggregate([
      { $match: { volunteerId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments({ volunteerId: req.user._id });
    
    const completedBookings = await Booking.countDocuments({ 
      volunteerId: req.user._id, 
      status: 'completed' 
    });

    const totalEarnings = await Booking.aggregate([
      { $match: { volunteerId: req.user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        completedBookings,
        totalEarnings: totalEarnings[0]?.total || 0,
        averageRating: req.user.ratings.average,
        stats: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get volunteer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get nearby available bookings
// @route   GET /api/volunteers/nearby-bookings
// @access  Private (Volunteer only)
router.get('/nearby-bookings', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query; // radius in meters
    const Booking = (await import('../models/Booking.js')).default;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Current location coordinates are required'
      });
    }

    const bookings = await Booking.find({
      status: 'pending',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      },
      serviceType: { $in: req.user.skills }
    })
    .populate('elderId', 'firstName lastName phone address')
    .limit(20)
    .sort({ urgency: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        bookings,
        count: bookings.length
      }
    });
  } catch (error) {
    console.error('Get nearby bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching nearby bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Add feedback to completed booking
// @route   POST /api/volunteers/feedback/:bookingId
// @access  Private (Volunteer only)
router.post('/feedback/:bookingId', async (req, res) => {
  try {
    const { rating, review } = req.body;
    const bookingId = req.params.bookingId;
    const Booking = (await import('../models/Booking.js')).default;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.volunteerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be added to completed bookings'
      });
    }

    // Add feedback to booking
    booking.feedback.volunteerRating = rating;
    booking.feedback.volunteerReview = review;
    booking.feedback.submittedAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
