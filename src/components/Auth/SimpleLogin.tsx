import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Phone, Mail, UserPlus, Eye, EyeOff, Home } from 'lucide-react';
import api from '../../services/api';

const SimpleLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('elder');
  const [formData, setFormData] = useState({
    username: '', // Can be email or phone
    password: '',
    // Registration fields
    email: '',
    fullName: '',
    phone: '',
    age: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    skills: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login validation
        if (!formData.username || !formData.password) {
          setError('Username/Phone and password are required');
          setLoading(false);
          return;
        }

        const response = await api.post('/auth/login', {
          email: formData.username, // Backend expects email field
          password: formData.password
        });

        if (response.data.token) {
          api.setToken(response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Redirect based on role
          if (response.data.user.role === 'elder') {
            navigate('/elder');
          } else {
            navigate('/volunteer');
          }
        } else {
          setError('Invalid login credentials');
        }
      } else {
        // Registration validation
        if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.age) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        if (formData.age && (parseInt(formData.age) < 18 || parseInt(formData.age) > 120)) {
          setError('Age must be between 18 and 120');
          setLoading(false);
          return;
        }

        const registerData = {
          firstName: formData.fullName.split(' ')[0] || formData.fullName,
          lastName: formData.fullName.split(' ').slice(1).join(' ') || 'User',
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          age: parseInt(formData.age),
          role: role,
          address: {
            street: formData.address.street || '123 Main Street',
            city: formData.address.city || 'Chennai',
            state: formData.address.state || 'Tamil Nadu',
            pincode: formData.address.pincode || '600001'
          },
          ...(role === 'volunteer' ? { skills: formData.skills.length > 0 ? formData.skills : ['companion'] } : { emergencyContacts: [{ name: 'Family Member', relation: 'Spouse', phone: '9876543210' }] })
        };

        const response = await api.post('/auth/register', registerData);
        
        if (response.data.token) {
          api.setToken(response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Redirect based on role
          if (role === 'elder') {
            navigate('/elder');
          } else {
            navigate('/volunteer');
          }
        } else {
          setError('Registration failed');
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      const error = err as any;
      setError(error.response?.data?.message || error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const volunteerSkills = [
    'medical', 'transport', 'grocery', 'household', 'companion', 'emergency', 'technical'
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Join our community'}
          </p>
        </div>

        {/* Role Selection */}
        {!isLogin && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('elder')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === 'elder'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <span className="block font-medium">Elder</span>
                <span className="text-sm text-gray-500">Need assistance</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('volunteer')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === 'volunteer'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <span className="block font-medium">Volunteer</span>
                <span className="text-sm text-gray-500">Want to help</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Login Fields */}
          {isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Username / Phone Number
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter email or phone number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </>
          )}

          {/* Registration Fields */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <UserPlus className="w-4 h-4 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  required
                  min="18"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Home className="w-4 h-4 inline mr-1" />
                  Street Address
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="Enter 6-digit pincode"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {role === 'volunteer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {volunteerSkills.map(skill => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="mr-2"
                        />
                        <span className="capitalize text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
