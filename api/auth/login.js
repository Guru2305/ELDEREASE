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
    const { email, password } = req.body;

    // Find user in both collections
    let user = users.elders.find(u => u.email === email);
    let role = 'elder';
    
    if (!user) {
      user = users.volunteers.find(u => u.email === email);
      role = 'volunteer';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d'
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
}
