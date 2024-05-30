// const bcrypt = require('bcryptjs');
//
// async function login(request, h) {
//  // login firebase / email dan password
// }
//
// async function register(request, h) {
//  const { email, password } = request.payload;
//
//  // hash password
//  const hashedPassword = await bcrypt.hash(password, 10);
//
//  // save to database
//  const [rows] = await database.query('INSERT into users (email, password) VALUES (?, ?)', [email, hashedPassword]);
//
//  return h.response({ message: 'User created successfully' }).code(201);
// }
//
// module.exports = { login, register };
