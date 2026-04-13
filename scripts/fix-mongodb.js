#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing MongoDB Atlas Connection\n');

// Fixed connection string - properly encoded password
const correctedConnectionString = 'mongodb+srv://lepto-tech:lepto%402026@elderease-cluster.hzjanff.mongodb.net/elderease?retryWrites=true&w=majority';

// Environment configuration
const envContent = `# Environment Variables
PORT=5000
MONGODB_URI=mongodb+srv://lepto-tech:lepto%402026@elderease-cluster.hzjanff.mongodb.net/elderease?retryWrites=true&w=majority
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
  console.log('✅ Server .env file updated with fixed connection string!');
  console.log(`📍 Location: ${envPath}`);
  
  console.log('\n🔧 Fix Applied:');
  console.log('• Password properly URL-encoded: lepto%402026');
  console.log('• Database name specified: elderease');
  console.log('• Connection options included');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Test connection: cd server && node test-connection.js');
  console.log('2. Start server: npm run server');
  console.log('3. Start frontend: npm run dev');
  console.log('4. Full start: npm start');
  
  console.log('\n📝 Connection String Details:');
  console.log('• Username: lepto-tech');
  console.log('• Password: lepto@2026 (encoded as lepto%402026)');
  console.log('• Cluster: elderease-cluster.hzjanff.mongodb.net');
  console.log('• Database: elderease');
  
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
}

console.log('\n🎯 MongoDB Atlas connection should now work!');
