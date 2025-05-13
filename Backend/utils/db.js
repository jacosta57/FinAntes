const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;
let db;

const connectDB = async () => {
  if (db) return db;
  
  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 50,
      minPoolSize: 10,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 5000,
    });
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    db = client.db(process.env.MONGODB_NAME);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const getDB = () => {
  if (!db) throw new Error('Database not initialized. Call connectDB first.');
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = { connectDB, getDB, closeDB };