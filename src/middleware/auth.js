const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

async function verifyToken(request, h) {
  const { authorization } = request.headers;
  if (!authorization) {
    return h.response({ error: 'Missing authentication token' }).code(401).takeover();
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return h.response({ error: 'Token not provided' }).code(401).takeover();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findUserById(decoded.userId);
    if (!user) {
      return h.response({ error: 'User not found' }).code(401).takeover();
    }
    request.auth = { credentials: { id: decoded.userId } };
    return h.continue;
  } catch (error) {
    console.error('Token verification failed:', error); // eslint-disable-line no-console
    return h.response({ error: 'Invalid token' }).code(401).takeover();
  }
}

module.exports = { verifyToken };
