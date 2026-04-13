import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory storage for testing
let users = {
  elders: [],
  volunteers: []
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { role, firstName, lastName, email, password, phone, ...otherFields } = req.body;

    // Check if user already exists
    let existingUser = users.elders.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists as an elder'
      });
    }

    existingUser = users.volunteers.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists as a volunteer'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    const userId = Date.now().toString();
    
    if (role === 'elder') {
      user = {
        _id: userId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        age: otherFields.age,
        address: otherFields.address,
        emergencyContacts: otherFields.emergencyContacts || [],
        role: 'elder',
        isActive: true,
        createdAt: new Date()
      };
      
      users.elders.push(user);
    } else if (role === 'volunteer') {
      user = {
        _id: userId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        age: otherFields.age,
        address: otherFields.address,
        skills: otherFields.skills,
        role: 'volunteer',
        isActive: true,
        ratings: { average: 0, totalRatings: 0, reviews: [] },
        createdAt: new Date()
      };
      
      users.volunteers.push(user);
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      message: `${role === 'elder' ? 'Elder' : 'Volunteer'} registered successfully`,
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
}
