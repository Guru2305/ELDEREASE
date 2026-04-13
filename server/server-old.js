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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/elders', elderRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ELDEREASE Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ELDEREASE Backend API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await connectToDatabase();
    console.log('Database connection established');
    
    app.listen(PORT, () => {
      console.log(`\n\ud83d\ude80 ELDEREASE Backend running on port ${PORT}`);
      console.log(`\ud83d\udccd Health: http://localhost:${PORT}/api/health`);
      console.log(`\ud83d\udc65 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5175'}`);
      console.log(`\ud83d\udcda Database: MongoDB Atlas`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
