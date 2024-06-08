const userModel = require('../models/userModel');
require('dotenv').config();

const verifyToken = async (decoded, request) => {
  try {
    const [user] = await userModel.findUserById(decoded.userId);
    if (!user) {
      return { isValid: false };
    }
    request.user = user;
    return { isValid: true };
  } catch (error) {
    console.error('Error verifying token:', error.message); // eslint-disable-line no-console
    return { isValid: false };
  }
};

module.exports = { verifyToken };
