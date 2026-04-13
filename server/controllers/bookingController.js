import { validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Elder from '../models/Elder.js';
import Volunteer from '../models/Volunteer.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Elder only)
export const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      serviceType,
      title,
      description,
      urgency,
      scheduledDate,
      duration,
      location,
      emergencyDetails
    } = req.body;

    // Create booking
    const booking = new Booking({
      elderId: req.user._id,
      serviceType,
      title,
      description,
      urgency,
      scheduledDate,
      duration,
      location,
      emergencyDetails: emergencyDetails || {}
    });

    await booking.save();

    // Find nearby volunteers (within 5km)
    const nearbyVolunteers = await Volunteer.find({
      isActive: true,
      isOnline: true,
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.coordinates.longitude, location.coordinates.latitude]
          },
          $maxDistance: 5000 // 5km in meters
        }
      },
      skills: serviceType
    }).limit(10);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking,
        nearbyVolunteers: nearbyVolunteers.map(v => ({
          id: v._id,
          name: `${v.firstName} ${v.lastName}`,
          rating: v.ratings.average,
          skills: v.skills,
          distance: 'Nearby' // You can calculate actual distance
        }))
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const role = req.userRole;
    const userId = req.user._id;

    let query = {};
    
    if (role === 'elder') {
      query.elderId = userId;
    } else if (role === 'volunteer') {
      query.volunteerId = userId;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('elderId', 'firstName lastName phone')
      .populate('volunteerId', 'firstName lastName phone ratings')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('elderId', 'firstName lastName phone address emergencyContacts')
      .populate('volunteerId', 'firstName lastName phone ratings skills');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has access to this booking
    const role = req.userRole;
    const userId = req.user._id;

    if (role === 'elder' && booking.elderId._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (role === 'volunteer' && booking.volunteerId?._id?.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Accept booking (Volunteer only)
// @route   PUT /api/bookings/:id/accept
// @access  Private (Volunteer only)
export const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking is no longer available'
      });
    }

    // Assign volunteer to booking
    await booking.assignVolunteer(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Booking accepted successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error accepting booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Reject booking (Volunteer only)
// @route   PUT /api/bookings/:id/reject
// @access  Private (Volunteer only)
export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking is no longer available'
      });
    }

    booking.status = 'rejected';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking rejected successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error rejecting booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Complete booking (Volunteer only)
// @route   PUT /api/bookings/:id/complete
// @access  Private (Volunteer only)
export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Booking must be accepted before completion'
      });
    }

    if (booking.volunteerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await booking.completeBooking();

    res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const role = req.userRole;
    const userId = req.user._id;

    // Check permissions
    if (role === 'elder' && booking.elderId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (role === 'volunteer' && booking.volunteerId?.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    await booking.cancelBooking(reason || 'Cancelled by user');

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update booking location tracking
// @route   PUT /api/bookings/:id/tracking
// @access  Private (Volunteer only)
export const updateTracking = async (req, res) => {
  try {
    const { latitude, longitude, estimatedArrival } = req.body;
    const booking = await Booking.findById(req.params.id);

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

    booking.tracking.volunteerLocation = {
      latitude,
      longitude,
      updatedAt: new Date()
    };

    if (estimatedArrival) {
      booking.tracking.estimatedArrival = new Date(estimatedArrival);
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Tracking updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Update tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating tracking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get available bookings for volunteers
// @route   GET /api/bookings/available
// @access  Private (Volunteer only)
export const getAvailableBookings = async (req, res) => {
  try {
    const { serviceType, urgency, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'pending' };
    
    if (serviceType) {
      query.serviceType = serviceType;
    }
    
    if (urgency) {
      query.urgency = urgency;
    }

    const bookings = await Booking.find(query)
      .populate('elderId', 'firstName lastName phone address')
      .sort({ urgency: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get available bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching available bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
