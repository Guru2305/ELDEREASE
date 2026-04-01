#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 MongoDB Atlas Configuration\n');

// Your provided connection string
const connectionString = 'mongodb+srv://lepto-tech:<lepto@2026>@elderease-cluster.hzjanff.mongodb.net/?appName=Elderease-cluster';

// Environment configuration
const envContent = `# Environment Variables
PORT=5000
MONGODB_URI=mongodb+srv://lepto-tech:lepto@2026@elderease-cluster.hzjanff.mongodb.net/elderease?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars-elderease-2026
JWT_EXPIRE=7d

# CORS Settings
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_VOLUNTEER=http://localhost:3001

# MongoDB Atlas Configuration
MONGODB_DB_NAME=elderease
MONGODB_COLLECTION_ELDERS=elders
MONGODB_COLLECTION_VOLUNTEERS=volunteers
MONGODB_COLLECTION_BOOKINGS=bookings

# Node Environment
NODE_ENV=development
`;

const envPath = path.join(__dirname, '../server/.env');

try {
  // Write the .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Server .env file created successfully!');
  console.log(`📍 Location: ${envPath}`);
  
  console.log('\n📋 Configuration Summary:');
  console.log('• MongoDB Atlas: elderease-cluster.hzjanff.mongodb.net');
  console.log('• Database: elderease');
  console.log('• Port: 5000');
  console.log('• JWT Secret: Configured (change for production)');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Test connection: npm run test:db');
  console.log('2. Start server: npm run server');
  console.log('3. Start frontend: npm run dev');
  console.log('4. Full start: npm start');
  
  console.log('\n🔐 Security Notes:');
  console.log('• Connection string configured with your credentials');
  console.log('• JWT secret set - change for production');
  console.log('• CORS configured for localhost development');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📝 Manual Setup Required:');
  console.log('1. Create server/.env file');
  console.log('2. Add the following content:');
  console.log(envContent);
}

console.log('\n🎯 Your MongoDB Atlas is ready for ELDEREASE!');
