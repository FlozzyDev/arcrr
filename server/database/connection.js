import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    const db = connection.connection.db;
    if (!db) {
      throw new Error('Failed to connect to MongoDB');
    }
    console.log(`MongoDB connected: ${db.databaseName}`);
    return db;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
