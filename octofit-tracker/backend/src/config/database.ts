import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
const db = mongoose.connection;

db.on('error', (error) => console.error('connection error:', error));

export async function connectDatabase() {
  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`Connected to ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    console.warn('MongoDB connection unavailable. Continuing without a database connection.', error);
    return mongoose.connection;
  }
}

export default db;
