import express from 'express';
import { body } from 'express-validator';
import {
  createBooking,
  getBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
  updateTracking,
  getAvailableBookings
} from '../controllers/bookingController.js';
import { authenticate, elderOnly, volunteerOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const createBookingValidation = [
  body('serviceType')
    .isIn(['medical', 'transport', 'grocery', 'household', 'companion', 'emergency', 'technical'])
    .withMessage('Invalid service type'),
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('urgency')
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'])
    .withMessage('Invalid urgency level'),
  body('scheduledDate')
    .isISO8601()
    .withMessage('Invalid scheduled date'),
  body('duration')
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  body('location.address')
    .notEmpty()
    .withMessage('Location address is required'),
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude')
];

const trackingValidation = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude')
];

// Routes
router.post('/', elderOnly, createBookingValidation, createBooking);
router.get('/', getBookings);
router.get('/available', volunteerOnly, getAvailableBookings);
router.get('/:id', getBookingById);
router.put('/:id/accept', volunteerOnly, acceptBooking);
router.put('/:id/reject', volunteerOnly, rejectBooking);
router.put('/:id/complete', volunteerOnly, completeBooking);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/tracking', volunteerOnly, trackingValidation, updateTracking);

export default router;
