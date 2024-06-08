const userModel = require('../models/userModel');
require('dotenv').config();

const verifyToken = async (decoded, request, h) => {
  try {
    const user = await userModel.findUserById(decoded.userId);
    if (user.length === 0) {
      return { isValid: false };
    }
    request.user = user[0];
    return { isValid: true };
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return { isValid: false };
  }
};

module.exports = { verifyToken };
