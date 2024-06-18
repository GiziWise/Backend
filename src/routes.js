const {
  signupUser, signinUser, currentUser, logoutUser,
} = require('./controllers/auth');
const { calculateBmi, getIdBmiData } = require('./controllers/bmi');
const { addPredict, getPredictions } = require('./controllers/predict');

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
    handler: getIdBmiData,
  },
  {
    method: 'POST',
    path: '/predict',
    options: {
      auth: 'jwt',
    },
    handler: addPredict,
  },
  {
    method: 'GET',
    path: '/predict',
    options: {
      auth: 'jwt',
    },
    handler: getPredictions,
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
