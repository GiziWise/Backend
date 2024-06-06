const { signupUser, signinUser } = require('./controllers/auth');
const { calculateBmiHandler } = require('./controllers/bmi');
const { verifyToken } = require('./middleware/auth');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: () => 'API GiziWise v1.0.0 Ready',
  },
  {
    method: 'POST',
    path: '/signup',
    handler: signupUser,
  },
  {
    method: 'POST',
    path: '/signin',
    handler: signinUser,
  },
  {
    method: 'POST',
    path: '/bmi',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: calculateBmiHandler,
  },
];

module.exports = routes;
