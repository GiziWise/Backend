/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const hapiAuthJwt2 = require('hapi-auth-jwt2');
const Cookie = require('@hapi/cookie');
const routes = require('./routes');
const { verifyToken } = require('./middleware/auth');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
      },
    },
  });

  await server.register([hapiAuthJwt2, Cookie]);

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate: verifyToken,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'session-cookie',
      password: process.env.COOKIE_SECRET,
      isSecure: process.env.NODE_ENV === 'production',
      isHttpOnly: true,
      path: '/',
    },
    redirectTo: false,
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`); // eslint-disable-line no-console
};

process.on('unhandledRejection', (err) => {
  console.log(err); // eslint-disable-line no-console
  process.exit(1);
});

init();
