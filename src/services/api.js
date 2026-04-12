// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://elderease-backend-a8v3.onrender.com/api';

// Generic API helper
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Get headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // HTTP methods
  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API instance
const api = new ApiService(API_BASE_URL);

// Export API service
export default api;

// Export specific API methods
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
};

export const elderAPI = {
  getProfile: () => api.get('/elders/profile'),
  updateProfile: (data) => api.put('/elders/profile', data),
  getBookings: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/elders/bookings?${query}`);
  },
  getStats: () => api.get('/elders/stats'),
};

export const volunteerAPI = {
  getProfile: () => api.get('/volunteers/profile'),
  updateProfile: (data) => api.put('/volunteers/profile', data),
  updateOnlineStatus: (data) => api.put('/volunteers/online-status', data),
  getBookings: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/volunteers/bookings?${query}`);
  },
  getStats: () => api.get('/volunteers/stats'),
  getNearbyBookings: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/volunteers/nearby-bookings?${query}`);
  },
  submitFeedback: (bookingId, feedback) => 
    api.post(`/volunteers/feedback/${bookingId}`, feedback),
};

export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/bookings?${query}`);
  },
  getById: (id) => api.get(`/bookings/${id}`),
  accept: (id) => api.put(`/bookings/${id}/accept`),
  reject: (id) => api.put(`/bookings/${id}/reject`),
  complete: (id) => api.put(`/bookings/${id}/complete`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
  updateTracking: (id, location) => api.put(`/bookings/${id}/tracking`, location),
  getAvailable: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/bookings/available?${query}`);
  },
};
