import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Plus, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Heart,
  Home,
  Settings
} from 'lucide-react';
import api from '../../services/api';

interface ElderProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContacts: Array<{
    name: string;
    relation: string;
    phone: string;
  }>;
}

interface Booking {
  id: string;
  serviceType: string;
  title: string;
  status: string;
  scheduledDate: string;
  volunteerId?: string;
}

const ElderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ElderProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile
      const profileResponse = await api.get('/elders/profile');
      setProfile(profileResponse.data.elder);

      // Fetch bookings
      const bookingsResponse = await api.get('/elders/bookings?limit=5');
      setBookings(bookingsResponse.data.bookings);

      // Fetch stats
      const statsResponse = await api.get('/elders/stats');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = () => {
    navigate('/elder/bookings');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'medical': return <Heart className="w-5 h-5" />;
      case 'transport': return <MapPin className="w-5 h-5" />;
      case 'grocery': return <Home className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load profile</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Elder Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/elder/profile')}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {profile.firstName} {profile.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.firstName}!
          </h2>
          <p className="text-gray-600">How can we help you today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={handleCreateBooking}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Create Booking</p>
              </button>
              
              <button
                onClick={() => navigate('/elder/bookings')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">View Bookings</p>
              </button>
              
              <button
                onClick={() => navigate('/elder/profile')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <User className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Edit Profile</p>
              </button>
              
              <button
                onClick={() => navigate('/elder/call-support')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
              >
                <Phone className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Emergency</p>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button
              onClick={() => navigate('/elder/bookings')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="divide-y">
            {bookings.length === 0 ? (
              <div className="p-6 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bookings yet</p>
                <button
                  onClick={handleCreateBooking}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Your First Booking
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getServiceIcon(booking.serviceType)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.title}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ElderDashboard;
