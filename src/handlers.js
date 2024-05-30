const pool = require('./database');
const bcrypt = require('bcryptjs');

async function connectDatabase(request, h) {
  try {
    const [rows] = await pool.query('SELECT 1');
    return { message: 'Database connection successful!' };
  } catch (error) {
    console.error('Database connection error:', error);
    return h.response({ message: 'Database connection failed!' }).code(500);
  }
}

const user = {
    id: null,
    email: '',
    password: '',
    name: '',
    age: '',
    gender: '',
};

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function signupUser(request, h) {
    const { email, password, name, age, gender } = request.payload;
  
    const hashedPassword = await hashPassword(password);
  
    const [rows] = await pool.query('INSERT INTO users (email, password, name, age, gender) VALUES (?, ?, ?, ?, ?)', [email, hashedPassword, name, age, gender]);
  
    return h.response({ message: 'User created successfully', userId: rows.insertId }).code(201);
}

module.exports = {
  connectDatabase,
  signupUser,
};
