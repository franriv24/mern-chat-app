import User from './models/User.js';
import bcrypt from 'bcrypt';
import jwt from '@hapi/jwt';
import type { Server, ServerApplicationState } from '@hapi/hapi';

type RequestPayload = {
  username?: string | null,
  password?: string | null
};

const JWT_SECRET = process.env.JWT_SECRET ?? '';

const registerRoutes = async (server: Server<ServerApplicationState>) => {
  // Public routes (no auth)
  server.route([
    {
      method: 'POST',
      path: '/register',
      handler: async (request, h) => {
        const { username, password } = (request?.payload ?? {}) as RequestPayload;

        if (!username || !password) {
          return h
            .response({
              error: 'Username and password are required',
            })
            .code(422);
        }

        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = new User({ username, password: hashedPassword });
          await user.save();
          return h.response({ message: 'User was registered!' }).code(201);
        } catch (error) {
          return h.response({ error: 'User registration failed' }).code(500);
        }
      },
      options: { auth: false },
    },
    {
      method: 'POST',
      path: '/login',
      handler: async (request, h) => {
        const { username, password } = (request?.payload ?? {}) as RequestPayload;
      
        if (!username || !password) {
          return h
            .response({
              error: 'Username and password are required',
            })
            .code(422);
        }

        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return h.response({ error: 'Invalid credentials' }).code(401);
        }
      
        const payload = { userId: user._id, aud: 'urn:audience:test', iss: 'urn:issuer:test' };
        const token = jwt.token.generate(payload, { key: JWT_SECRET, algorithm: 'HS256' });
        return h.response({ token });
      },
      options: { auth: false },
    },
  ]);

  // Authenticated routes
  server.route({
    method: 'GET',
    path: '/users',
    handler: async(request, h) => {
      const users = await User.find();
      return h.response({ message: users });
    },
  });
};
  
  export { registerRoutes };