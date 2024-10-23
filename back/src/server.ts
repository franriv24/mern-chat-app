import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import { registerJwt } from './auth.js';
import { registerRoutes } from './routes.js';
import mongoose from 'mongoose';
import { connectRedis } from './redis.js';

// Load environment variables
dotenv.config();

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

// Create Hapi server
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: '0.0.0.0',
  });

  await registerJwt(server);

  registerRoutes(server);

  await connectDb();
  await connectRedis();

  await server.start();

  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
