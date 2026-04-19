import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/db.js';

// Import routes
import authRoutes from './routes/auth-mongo.js';
import taskRoutes from './routes/tasks.js';
import elderRoutes from './routes/elders.js';

// Load environment variables FIRST
dotenv.config();

// Check for required environment variables
if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI environment variable is not defined');
  console.error('Please add MONGODB_URI to your Render environment variables');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not defined');
  console.error('Please add JWT_SECRET to your Render environment variables');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5175',
    'https://elderease-hz89ur5u1-thashhs-projects.vercel.app',
    'https://elderease-gtmqzyjgu-thashhs-projects.vercel.app',
    'https://elderease-3pev4wqb0-thashhs-projects.vercel.app',
    'https://elderease-7vw61vdhg-thashhs-projects.vercel.app',
    'https://elderease-jycqx0cba-thashhs-projects.vercel.app',
    'https://elderease-f1xyukox0-thashhs-projects.vercel.app',
    'https://elderease-enqu1l51m-thashhs-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Handle preflight requests
app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/elders', elderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ELDEREASE Backend is running',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas'
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
      elders: '/api/elders',
      health: '/api/health'
    },
    database: 'MongoDB Atlas'
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

// Start server ONLY after successful database connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Starting ELDEREASE Backend...');
    console.log('Checking environment variables...');
    
    // Test database connection FIRST
    console.log('Connecting to MongoDB Atlas...');
    const { db, dbName } = await connectToDatabase();
    
    // Test database access
    await db.admin().ping();
    console.log(`Database connection verified: ${dbName}`);
    
    // Only start server after successful database connection
    app.listen(PORT, () => {
      console.log(`\n\ud83d\ude80 ELDEREASE Backend running successfully!`);
      console.log(`\ud83d\udccd Port: ${PORT}`);
      console.log(`\ud83d\udccd Health: http://localhost:${PORT}/api/health`);
      console.log(`\ud83d\udc65 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5175'}`);
      console.log(`\ud83d\udcda Database: MongoDB Atlas (${dbName})`);
      console.log(`\u2705 All systems operational!`);
    });
    
  } catch (error) {
    console.error('\n\ud83d\udc94 FAILED TO START SERVER:');
    console.error('Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. MONGODB_URI is correct in Render environment variables');
    console.error('2. MongoDB Atlas cluster is accessible');
    console.error('3. Network connectivity is working');
    console.error('4. Database user has proper permissions');
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();

export default app;
