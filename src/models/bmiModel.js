const pool = require('../config/db');

async function saveBmiData(userId, bmiData) {
  const {
    bmi, category, weight, height, age, gender, healthyWeightRange,
  } = bmiData;

  try {
    const result = await pool.query(
      'INSERT INTO bmi (user_id, bmi, category, weight, height, age, gender, healthy_weight_range) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, bmi, category, weight, height, age, gender, healthyWeightRange],
    );

    const [rows] = result;
    return { success: true, insertId: rows.insertId };
  } catch (error) {
    console.error('Error saving BMI data:', error.message); // eslint-disable-line no-console
    return { success: false, message: error.message };
  }
}

module.exports = { saveBmiData };
