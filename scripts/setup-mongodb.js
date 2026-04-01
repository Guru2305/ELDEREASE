#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🗄️  MongoDB Atlas Setup Script for ELDEREASE\n');

console.log('📋 Follow these steps to set up MongoDB Atlas:\n');

console.log('1️⃣  Create Account & Cluster:');
console.log('   • Go to: https://cloud.mongodb.com/');
console.log('   • Sign up for free account');
console.log('   • Create M0 Sandbox cluster (FREE)');
console.log('   • Choose region closest to your users\n');

console.log('2️⃣  Configure Security:');
console.log('   • Database User: elderease_user');
console.log('   • Network Access: Allow from anywhere (0.0.0.0/0)\n');

console.log('3️⃣  Get Connection String:');
console.log('   • Go to Database → Connect → Drivers');
console.log('   • Copy the MongoDB connection string\n');

console.log('4️⃣  Update Environment Variables:');
console.log('   • Create server/.env file');
console.log('   • Replace YOUR_PASSWORD_HERE with actual password\n');

// Generate .env template
const envTemplate = `# Environment Variables
PORT=5000
MONGODB_URI=mongodb+srv://elderease_user:YOUR_PASSWORD_HERE@elderease-cluster.xxxxx.mongodb.net/elderease?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d

# CORS Settings
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_VOLUNTEER=http://localhost:3001

# MongoDB Atlas Configuration
MONGODB_DB_NAME=elderease
MONGODB_COLLECTION_ELDERS=elders
MONGODB_COLLECTION_VOLUNTEERS=volunteers
MONGODB_COLLECTION_BOOKINGS=bookings
`;

const envPath = path.join(__dirname, '../server/.env');
const envExamplePath = path.join(__dirname, '../server/.env.example');

// Write .env.example if it doesn't exist
if (!fs.existsSync(envExamplePath)) {
  fs.writeFileSync(envExamplePath, envTemplate);
  console.log('✅ Created server/.env.example template');
}

// Check if .env exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  server/.env already exists');
  console.log('   Please update it manually with your MongoDB credentials');
} else {
  console.log('📝 Create server/.env with the following content:\n');
  console.log('─'.repeat(60));
  console.log(envTemplate);
  console.log('─'.repeat(60));
}

console.log('\n5️⃣  Test Connection:');
console.log('   • Run: npm run server');
console.log('   • Check for "✅ MongoDB Connected" message\n');

console.log('🔗 Useful Links:');
console.log('   • Atlas Dashboard: https://cloud.mongodb.com/');
console.log('   • Connection Guide: https://docs.mongodb.com/manual/reference/connection-string/');
console.log('   • Free Tier Limits: https://www.mongodb.com/cloud/atlas/pricing\n');

console.log('⚠️  Important Notes:');
console.log('   • Replace YOUR_PASSWORD_HERE with actual password');
console.log('   • Keep your connection string secure');
console.log('   • Never commit .env file to git');
console.log('   • Free tier: 512MB storage, suitable for development\n');

console.log('🚀 Once configured, your database will be accessible from anywhere!');
