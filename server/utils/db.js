import { MongoClient, ObjectId } from 'mongodb';

// Singleton pattern for database connection
let cachedClient = null;
let cachedDb = null;
let cachedDbName = null;

export async function connectToDatabase() {
  // If we have a connection, return it
  if (cachedClient && cachedDb && cachedDbName) {
    return { client: cachedClient, db: cachedDb, dbName: cachedDbName };
  }

  // Create new connection
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10, // Maximum number of connections in the pool
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server
    socketTimeoutMS: 45000, // How long a send or receive on a socket can take
  });

  try {
    await client.connect();
    
    // Extract database name from URI or use default
    const dbName = process.env.MONGODB_DB_NAME || 'elderease';
    const db = client.db(dbName);

    // Cache the connection
    cachedClient = client;
    cachedDb = db;
    cachedDbName = dbName;

    console.log('Connected to MongoDB successfully');
    return { client, db, dbName };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Helper function to convert string to ObjectId
export function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (error) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
}

// Helper function to close connection (useful for testing)
export async function closeDatabaseConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    cachedDbName = null;
  }
}
