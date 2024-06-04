const pool = require('../config/db');

async function saveBmiData(userId, bmiData) {
  const {
    bmi, category, age, gender, healthyWeightRange,
  } = bmiData;

  try {
    const query = `
      INSERT INTO bmi (user_id, bmi, category, age, gender, healthy_weight_range)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [userId, bmi, category, age, gender, healthyWeightRange];
    await pool.query(query, values);
    return { success: true, message: 'BMI data saved successfully.' };
  } catch (error) {
    console.error('Error saving BMI data:', error);
    return { success: false, message: 'Failed to save BMI data.' };
  }
}

module.exports = {
  saveBmiData,
};
