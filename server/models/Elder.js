import mongoose from 'mongoose';

const elderSchema = new mongoose.Schema({
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
    min: [60, 'Age must be 60 or above'],
    max: [120, 'Age cannot exceed 120']
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
  emergencyContacts: [{
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true, match: [/^[0-9]{10}$/, 'Phone number must be 10 digits'] }
  }],
  medicalConditions: [{
    condition: { type: String },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
    medications: [{ type: String }]
  }],
  preferences: {
    language: { type: String, default: 'English' },
    preferredVolunteerGender: { type: String, enum: ['male', 'female', 'any'], default: 'any' }
  },
  isActive: {
    type: Boolean,
    default: true
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
elderSchema.index({ email: 1 });
elderSchema.index({ 'address.coordinates': '2dsphere' });

// Virtual for full name
elderSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Middleware to update updatedAt on save
elderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Elder = mongoose.model('Elder', elderSchema);

export default Elder;
