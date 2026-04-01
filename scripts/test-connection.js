#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../server/.env') });

console.log('🔍 MongoDB Connection Test\n');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.log('Please set up your server/.env file first');
  process.exit(1);
}

// Check if it's using placeholder password
if (MONGODB_URI.includes('YOUR_PASSWORD_HERE')) {
  console.error('❌ Please replace YOUR_PASSWORD_HERE with your actual MongoDB password');
  console.log('Edit server/.env with your MongoDB Atlas credentials');
  process.exit(1);
}

const testConnection = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log(`📍 URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}\n`);
    
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🖥️  Host: ${conn.connection.host}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    
    // Test creating collections
    const db = conn.connection.db;
    
    // Test elders collection
    await db.createCollection('elders', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'phone', 'age'],
          properties: {
            firstName: { bsonType: 'string' },
            lastName: { bsonType: 'string' },
            email: { bsonType: 'string' },
            password: { bsonType: 'string' },
            phone: { bsonType: 'string' },
            age: { bsonType: 'number' }
          }
        }
      }
    });
    console.log('✅ Created/Validated elders collection');
    
    // Test volunteers collection
    await db.createCollection('volunteers', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'phone', 'age', 'skills'],
          properties: {
            firstName: { bsonType: 'string' },
            lastName: { bsonType: 'string' },
            email: { bsonType: 'string' },
            password: { bsonType: 'string' },
            phone: { bsonType: 'string' },
            age: { bsonType: 'number' },
            skills: { bsonType: 'array' }
          }
        }
      }
    });
    console.log('✅ Created/Validated volunteers collection');
    
    // Test bookings collection
    await db.createCollection('bookings', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['elderId', 'serviceType', 'title', 'description', 'scheduledDate', 'duration', 'location'],
          properties: {
            elderId: { bsonType: 'objectId' },
            serviceType: { bsonType: 'string' },
            title: { bsonType: 'string' },
            description: { bsonType: 'string' },
            scheduledDate: { bsonType: 'date' },
            duration: { bsonType: 'number' },
            location: { bsonType: 'object' }
          }
        }
      }
    });
    console.log('✅ Created/Validated bookings collection');
    
    // Insert test document
    const eldersCollection = db.collection('elders');
    const testElder = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@elderease.com',
      password: 'hashedpassword',
      phone: '1234567890',
      age: 70,
      address: {
        street: '123 Test Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      emergencyContacts: [{
        name: 'Test Contact',
        relation: 'family',
        phone: '9876543210'
      }],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await eldersCollection.insertOne(testElder);
    console.log('✅ Inserted test elder document');
    
    // Clean up test document
    await eldersCollection.deleteOne({ _id: result.insertedId });
    console.log('✅ Cleaned up test document');
    
    console.log('\n🎉 Database setup complete and working!');
    console.log('📈 Collections ready for ELDEREASE application');
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Possible solutions:');
      console.log('   • Check username and password in connection string');
      console.log('   • Ensure database user has correct permissions');
      console.log('   • Verify IP whitelist includes your IP address');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.log('\n💡 Possible solutions:');
      console.log('   • Check internet connection');
      console.log('   • Verify cluster name and region');
      console.log('   • Ensure MongoDB Atlas cluster is running');
    }
    
    process.exit(1);
  }
};

testConnection();
