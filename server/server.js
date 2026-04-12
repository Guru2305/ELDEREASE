import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import elderRoutes from './routes/elders.js';
import volunteerRoutes from './routes/volunteers.js';
import bookingRoutes from './routes/bookings.js';

// Configure environment
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins temporarily for debugging
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/elders', elderRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ELDEREASE Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection
const connectDB = async () => {
  try {
    // For now, we'll skip MongoDB connection and use in-memory storage
    console.log(`⚠️ MongoDB connection skipped - using in-memory storage for testing`);
    console.log(`📝 To enable database storage, set up MongoDB Atlas and update .env file`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    // Don't exit, continue with in-memory storage
    console.log('⚠️ Continuing with in-memory storage');
    return true;
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Elder UI: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`👥 Volunteer UI: ${process.env.FRONTEND_URL_VOLUNTEER || 'http://localhost:3001'}`);
  });
};

startServer();

export default app;
