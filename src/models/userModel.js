/* eslint-disable no-return-await */
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// async function createUser(email, password, name, age, gender) {
async function createUser(email, password) {
  const hashedPassword = await hashPassword(password);
  const result = await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
  const [rows] = result;
  return rows.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

// async function findUserById(userId) {
//   const [rows] = await pool.query('SELECT * FORM users WHERE id = ?', [userId]);
//   return rows[0];
// }

async function verifyPassword(inputPassword, storedPassword) {
  return await bcrypt.compare(inputPassword, storedPassword);
}

// async function setHasBMIEntry(userId) {
//   try {
//     await pool.query('UPDATE users SET has_bmi_entry = true WHERE id = ?', userId);
//     console.log('User marked as having BMI entry');
//   } catch (error) {
//     console.error('Error making user as having BMI entry', error);
//   }
// }

module.exports = {
  createUser,
  findUserByEmail,
  // findUserById,
  verifyPassword,
  // setHasBMIEntry,
};
