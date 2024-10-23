import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import { registerJwt } from './auth.js';
import { registerRoutes } from './routes.js';
import { connectRedis } from './redis.js';
import { connectDb } from './db.js';

// Load environment variables
dotenv.config();

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
