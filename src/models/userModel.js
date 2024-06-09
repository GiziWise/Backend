/* eslint-disable no-return-await */
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
}

async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return result.length > 0 ? result[0] : undefined;
}

async function findUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return result.length > 0 ? result[0] : undefined;
}

async function verifyPassword(inputPassword, storedPassword) {
  return await bcrypt.compare(inputPassword, storedPassword);
}

module.exports = {
  createUser,
  findUserByEmail,
  verifyPassword,
  findUserById,
};
