import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI ?? '';

// Connect to MongoDB
const connectDb = async () => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error', err);
    }
  };

export { connectDb };