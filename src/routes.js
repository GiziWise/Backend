const {
  signupUser, signinUser, currentUser, logoutUser,
} = require('./controllers/auth');
const { calculateBmi, getAllBmiData, getIdBmiData } = require('./controllers/bmi');
// const { verifyToken } = require('./middleware/auth');

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
    options: {
      auth: false,
    },
    handler: signinUser,
  },
  {
    method: 'POST',
    path: '/bmi',
    options: {
      auth: 'jwt',
    },
    handler: calculateBmi,
  },
  {
    method: 'GET',
    path: '/bmi',
    options: {
      auth: 'jwt',
    },
    handler: getAllBmiData,
  },
  {
    method: 'GET',
    path: '/bmi/{id}',
    options: {
      auth: 'jwt',
    },
    handler: getIdBmiData,
  },
  {
    method: 'GET',
    path: '/me',
    options: {
      auth: 'jwt',
    },
    handler: currentUser,
  },
  {
    method: 'POST',
    path: '/logout',
    options: {
      auth: 'jwt',
    },
    handler: logoutUser,
  },
];

module.exports = routes;
