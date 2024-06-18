const pool = require('../config/db');

async function saveBmiData(userId, bmiData) {
  const {
    bmi, category, weight, height, dob, age, gender, healthyWeightRange, calory,
  } = bmiData;

  try {
    const result = await pool.query(
      'INSERT INTO bmi (user_id, bmi, category, weight, height, dob, age, gender, healthy_weight_range, calory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, bmi, category, weight, height, dob, age, gender, healthyWeightRange, calory],
    );

    const [rows] = result;
    return { success: true, insertId: rows.insertId };
  } catch (error) {
    console.error('Error saving BMI data:', error.message); // eslint-disable-line no-console
    return { status: 'fail', message: error.message };
  }
}

async function getAllBmiData() {
  try {
    const result = await pool.query('SELECT * FROM bmi');
    return result[0];
  } catch (error) {
    return { status: 'fail', message: error.message };
  }
}

async function getIdBmiData(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM bmi WHERE id = ?', [id]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching BMI data by ID:', error); // eslint-disable-line no-console
    return { status: 'fail', message: error.message };
  }
}

async function getBmiByUserId(userId) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM bmi WHERE user_id = ? ORDER BY id DESC LIMIT 1',
      [userId],
    );
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching BMI data by user ID:', error); // eslint-disable-line no-console
    return { status: 'fail', message: error.message };
  }
}

module.exports = {
  saveBmiData, getAllBmiData, getIdBmiData, getBmiByUserId,
};
