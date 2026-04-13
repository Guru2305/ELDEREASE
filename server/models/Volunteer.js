import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Age must be 18 or above'],
    max: [65, 'Age cannot exceed 65']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true, match: [/^[0-9]{6}$/, 'Pincode must be 6 digits'] },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  skills: [{
    type: String,
    enum: ['medical', 'transport', 'grocery', 'household', 'companion', 'emergency', 'technical']
  }],
  availability: {
    monday: { available: Boolean, hours: { start: String, end: String } },
    tuesday: { available: Boolean, hours: { start: String, end: String } },
    wednesday: { available: Boolean, hours: { start: String, end: String } },
    thursday: { available: Boolean, hours: { start: String, end: String } },
    friday: { available: Boolean, hours: { start: String, end: String } },
    saturday: { available: Boolean, hours: { start: String, end: String } },
    sunday: { available: Boolean, hours: { start: String, end: String } }
  },
  experience: {
    years: { type: Number, min: 0, max: 50 },
    previousWork: [{ type: String }],
    certifications: [{ name: String, issuedBy: String, issuedDate: Date, expiryDate: Date }]
  },
  ratings: {
    average: { type: Number, min: 0, max: 5, default: 0 },
    totalRatings: { type: Number, default: 0 },
    reviews: [{
      rating: { type: Number, min: 1, max: 5, required: true },
      review: { type: String, required: true },
      elderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Elder', required: true },
      bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  backgroundCheck: {
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    verifiedAt: Date,
    documents: [{
      type: { type: String, required: true },
      url: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    updatedAt: { type: Date, default: Date.now }
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
volunteerSchema.index({ email: 1 });
volunteerSchema.index({ 'address.coordinates': '2dsphere' });
volunteerSchema.index({ skills: 1 });
volunteerSchema.index({ 'ratings.average': -1 });
volunteerSchema.index({ isOnline: 1 });

// Virtual for full name
volunteerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to calculate average rating
volunteerSchema.methods.calculateAverageRating = function() {
  if (this.ratings.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.totalRatings = 0;
  } else {
    const sum = this.ratings.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.ratings.average = sum / this.ratings.reviews.length;
    this.ratings.totalRatings = this.ratings.reviews.length;
  }
  return this.save();
};

// Middleware to update updatedAt on save
volunteerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;
