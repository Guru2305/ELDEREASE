import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  elderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Elder',
    required: [true, 'Elder ID is required']
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    default: null
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['medical', 'transport', 'grocery', 'household', 'companion', 'emergency', 'technical']
  },
  title: {
    type: String,
    required: [true, 'Booking title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  urgency: {
    type: String,
    required: [true, 'Urgency level is required'],
    enum: ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'],
    default: 'MEDIUM'
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Scheduled date must be in the future'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [480, 'Duration cannot exceed 8 hours (480 minutes)']
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    additionalInfo: { type: String }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedVolunteer: {
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer',
      default: null
    },
    assignedAt: { type: Date },
    acceptedAt: { type: Date },
    completedAt: { type: Date },
    notes: { type: String }
  },
  payment: {
    amount: { type: Number, min: 0 },
    status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    method: { type: String, enum: ['cash', 'online', 'card'], default: 'cash' },
    paidAt: { type: Date }
  },
  tracking: {
    volunteerLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      updatedAt: { type: Date }
    },
    estimatedArrival: { type: Date },
    volunteerPhone: { type: String }
  },
  feedback: {
    elderRating: { type: Number, min: 1, max: 5 },
    elderReview: { type: String },
    volunteerRating: { type: Number, min: 1, max: 5 },
    volunteerReview: { type: String },
    submittedAt: { type: Date }
  },
  emergencyDetails: {
    medicalEmergency: { type: Boolean, default: false },
    immediateAttention: { type: Boolean, default: false },
    contactEmergency: { type: Boolean, default: false },
    details: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better performance
bookingSchema.index({ elderId: 1 });
bookingSchema.index({ volunteerId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ serviceType: 1 });
bookingSchema.index({ urgency: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for time remaining
bookingSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const scheduled = new Date(this.scheduledDate);
  const diff = scheduled - now;
  return Math.max(0, Math.floor(diff / (1000 * 60))); // minutes
});

// Method to assign volunteer
bookingSchema.methods.assignVolunteer = function(volunteerId) {
  this.assignedVolunteer.volunteerId = volunteerId;
  this.assignedVolunteer.assignedAt = new Date();
  this.status = 'accepted';
  return this.save();
};

// Method to complete booking
bookingSchema.methods.completeBooking = function() {
  this.status = 'completed';
  this.assignedVolunteer.completedAt = new Date();
  return this.save();
};

// Method to cancel booking
bookingSchema.methods.cancelBooking = function(reason) {
  this.status = 'cancelled';
  this.assignedVolunteer.notes = reason;
  return this.save();
};

// Middleware to update updatedAt on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
