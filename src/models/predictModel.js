/* eslint-disable camelcase */
const pool = require('../config/db');

async function savePrediction(userId, predictionData) {
  const {
    nama_makanan,
    portion_size,
    energi,
    lemak,
    protein,
  } = predictionData;

  try {
    const result = await pool.query(
      'INSERT INTO predictions (user_id, nama_makanan, portion_size, energi, lemak, protein) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, nama_makanan, portion_size, energi, lemak, protein],
    );

    const [rows] = result;
    return { success: true, insertId: rows.insertId };
  } catch (error) {
    console.error('Error saving prediction data:', error.message); // eslint-disable-line no-console
    return { status: 'fail', message: error.message };
  }
}

async function getPredictionsByUserId(userId) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM predictions WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching predictions by user ID:', error.message); // eslint-disable-line no-console
    return { status: 'fail', message: error.message };
  }
}

module.exports = {
  savePrediction,
  getPredictionsByUserId,
};
