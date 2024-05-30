const { 
    connectDatabase,
    signupUser,
} = require('./handlers');

const routes = [
  {
    method: 'GET',
    path: '/test',
    handler: connectDatabase,
  },
  {
    method: 'POST',
    path: '/signup',
    handler: signupUser,
  },
];

module.exports = routes;
