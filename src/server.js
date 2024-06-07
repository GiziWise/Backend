const Hapi = require('@hapi/hapi');
const hapiAuthJwt2 = require('hapi-auth-jwt2');
const routes = require('./routes');
const { verifyToken } = require('./middleware/auth');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  await server.register(hapiAuthJwt2);

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate: verifyToken,
    verifyOptions: { algorithms: ['HS256'] },
  });

  // server.auth.default('jwt');

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`); // eslint-disable-line no-console
};

process.on('unhandledRejection', (err) => {
  console.log(err); // eslint-disable-line no-console
  process.exit(1);
});

init();
