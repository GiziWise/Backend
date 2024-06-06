const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (request, h) => {
  const { authorization } = request.headers;
  if (!authorization) {
    return h.respone({ error: 'Missing authentication token' }).code(401).takeover();
  }

  const token = authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.auth = { credentials: { id: decoded.userId } };
    return h.continue;
  } catch (error) {
    return h.respone({ error: 'Invalid token' }).code(401).takeover();
  }
};
// const verifyToken = async (decoded, request, h) => {
//   try {
//     const user = await userModel.findUserById(decoded.userId);
//     if (!user) {
//       return { isValid: false };
//     }
//     return { isValid: true };
//   } catch (error) {
//     console.error('Error in verifyToken:', error);
//     return { isValid: false };
//   }
// };

module.exports = { verifyToken };
