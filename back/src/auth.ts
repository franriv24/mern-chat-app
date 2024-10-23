import jwt from '@hapi/jwt';
import type { Server, ServerApplicationState } from '@hapi/hapi';

// Register plugin for JWT
const registerJwt = async (server: Server<ServerApplicationState>) => {
  await server.register(jwt);

  server.auth.strategy('my_jwt_strategy', 'jwt', {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: 'urn:audience:test',
      iss: 'urn:issuer:test',
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400, // 4 hours
      timeSkewSec: 15
    },
    validate: (artifacts: { decoded: { payload: any; }; }, request: any, h: any) => {
      return { isValid: true, credentials: { user: artifacts?.decoded?.payload?.user } };
    },
  });

  server.auth.default('my_jwt_strategy');
};

export { registerJwt };
