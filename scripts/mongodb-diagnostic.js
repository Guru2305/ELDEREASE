#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 MongoDB Atlas Diagnostic Tool\n');

// Read current .env file
const envPath = path.join(__dirname, '../server/.env');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found server/.env file');
} catch (error) {
  console.error('❌ Could not read server/.env file');
  process.exit(1);
}

// Extract connection details
const lines = envContent.split('\n');
const mongoLine = lines.find(line => line.startsWith('MONGODB_URI='));

if (!mongoLine) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

const connectionString = mongoLine.split('=')[1];

console.log('📋 Current Connection Analysis:');
console.log('• Connection String:', connectionString.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

// Parse connection string
const match = connectionString.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)/);

if (match) {
  const [, username, password, host] = match;
  console.log('• Username:', username);
  console.log('• Password:', password);
  console.log('• Host:', host);
  console.log('• Database:', connectionString.includes('/elderease') ? 'elderease' : 'default');
  
  console.log('\n🔧 Troubleshooting Steps:');
  console.log('1. Check MongoDB Atlas Dashboard:');
  console.log('   • Go to: https://cloud.mongodb.com/');
  console.log('   • Navigate to your cluster: elderease-cluster');
  console.log('   • Check under "Database Access"');
  console.log(`   • Verify user exists: "${username}"`);
  console.log('   • Check password matches: "' + password.replace(/%40/, '@') + '"');
  
  console.log('\n2. Check Network Access:');
  console.log('   • Go to "Network Access" in Atlas');
  console.log('   • Ensure "Allow Access from Anywhere" (0.0.0.0/0) is enabled');
  console.log('   • Or add your current IP address');
  
  console.log('\n3. Check Cluster Status:');
  console.log('   • Ensure cluster is running and not paused');
  console.log('   • Check cluster region and name');
  
  console.log('\n4. Common Issues:');
  console.log('   • Password contains special characters that need encoding');
  console.log('   • User doesn\'t have permissions for the specified database');
  console.log('   • Cluster name or region mismatch');
  
  // Generate corrected connection strings to try
  console.log('\n🔄 Alternative Connection Strings to Try:');
  
  const alternatives = [
    `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority`,
    `mongodb+srv://${username}:${encodeURIComponent(password.replace(/%40/, '@'))}@${host}/elderease?retryWrites=true&w=majority`,
    `mongodb+srv://${username}:${password}@${host}/admin?retryWrites=true&w=majority`
  ];
  
  alternatives.forEach((alt, index) => {
    console.log(`${index + 1}. ${alt.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
  });
  
  // Create test configurations
  const testConfigs = alternatives.map((alt, index) => ({
    name: `Alternative ${index + 1}`,
    uri: alt
  }));
  
  // Write test script
  const testScript = `#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnections = ${JSON.stringify(testConfigs, null, 2)};

async function testConnection(config, index) {
  try {
    console.log(\`\\n🔄 Testing \${config.name}...\`);
    await mongoose.connect(config.uri, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log(\`✅ \${config.name} - Connected Successfully!\`);
    console.log(\`   Database: \${mongoose.connection.name}\`);
    console.log(\`   Host: \${mongoose.connection.host}\`);
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.log(\`❌ \${config.name} - Failed: \${error.message}\`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Alternative Connection Strings\\n');
  
  for (let i = 0; i < testConnections.length; i++) {
    const success = await testConnection(testConnections[i], i);
    if (success) {
      console.log(\`\\n🎉 Found working connection: \${testConnections[i].name}\`);
      console.log('Update your server/.env with:');
      console.log(\`MONGODB_URI=\${testConnections[i].uri}\`);
      process.exit(0);
    }
  }
  
  console.log('\\n❌ No connection strings worked. Please check MongoDB Atlas settings.');
}

runTests();
`;
  
  fs.writeFileSync(path.join(__dirname, '../server/test-alternatives.js'), testScript);
  console.log('\n📝 Created test script: server/test-alternatives.js');
  console.log('Run: cd server && node test-alternatives.js');
  
} else {
  console.error('❌ Could not parse connection string');
}

console.log('\n📞 Next Steps:');
console.log('1. Verify MongoDB Atlas user and permissions');
console.log('2. Check network access settings');
console.log('3. Run alternative test: cd server && node test-alternatives.js');
console.log('4. Update .env with working connection string');
