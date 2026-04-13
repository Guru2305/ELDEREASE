import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, Calendar, MapPin, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('elder');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    age: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    // Elder specific
    emergencyContacts: [{
      name: '',
      relation: '',
      phone: ''
    }],
    // Volunteer specific
    skills: [],
    availability: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index][field] = value;
    setFormData(prev => ({
      ...prev,
      emergencyContacts: newContacts
    }));
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', relation: '', phone: '' }]
    }));
  };

  const removeEmergencyContact = (index) => {
    const newContacts = formData.emergencyContacts.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      emergencyContacts: newContacts
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Form validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!isLogin) {
      // Registration validation
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.age) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Phone validation
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError('Please enter a valid 10-digit phone number');
        setLoading(false);
        return;
      }

      if (role === 'elder' && (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.pincode)) {
        setError('Please complete your address');
        setLoading(false);
        return;
      }

      if (role === 'elder' && formData.emergencyContacts.some(contact => !contact.name || !contact.phone)) {
        setError('Please complete all emergency contact information');
        setLoading(false);
        return;
      }

      if (role === 'volunteer' && formData.skills.length === 0) {
        setError('Please select at least one skill');
        setLoading(false);
        return;
      }

      if (role === 'elder' && (parseInt(formData.age) < 60 || parseInt(formData.age) > 120)) {
        setError('Age must be between 60 and 120 for elders');
        setLoading(false);
        return;
      }

      if (role === 'volunteer' && (parseInt(formData.age) < 18 || parseInt(formData.age) > 65)) {
        setError('Age must be between 18 and 65 for volunteers');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        // Login
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });

        api.setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect based on role
        if (response.data.user.role === 'elder') {
          navigate('/elder-dashboard');
        } else {
          navigate('/volunteer-dashboard');
        }
      } else {
        // Register
        const registerData = {
          ...formData,
          role,
          age: parseInt(formData.age)
        };

        const response = await api.post('/auth/register', registerData);
        api.setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect based on role
        if (role === 'elder') {
          navigate('/elder-dashboard');
        } else {
          navigate('/volunteer-dashboard');
        }
      }
    } catch (err) {
      console.error('Login/Register Error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const volunteerSkills = [
    'medical', 'transport', 'grocery', 'household', 'companion', 'emergency', 'technical'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Registration Fields */}
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min={role === 'elder' ? '60' : '18'}
                    max={role === 'elder' ? '120' : '65'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street Address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Role-specific fields */}
              {role === 'elder' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contacts
                  </label>
                  {formData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 mb-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={contact.name}
                          onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Relation"
                          value={contact.relation}
                          onChange={(e) => handleEmergencyContactChange(index, 'relation', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex gap-1">
                          <input
                            type="tel"
                            placeholder="Phone"
                            value={contact.phone}
                            onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          {formData.emergencyContacts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEmergencyContact(index)}
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEmergencyContact}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add Emergency Contact
                  </button>
                </div>
              )}

              {role === 'volunteer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (select all that apply)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {volunteerSkills.map(skill => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="mr-2"
                        />
                        <span className="capitalize">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Common Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="w-4 h-4 inline mr-1" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

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

export default Login;
