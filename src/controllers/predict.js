/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
const axios = require('axios');
const predictModel = require('../models/predictModel');

async function addPredict(request, h) {
  const { nama_makanan, portion_size } = request.payload;
  const url = 'https://asia-southeast2-capstone-ch241-ps176.cloudfunctions.net/predict';

  try {
    const response = await axios.post(url, {
      nama_makanan,
      portion_size,
    });

    const { ENERGI, LEMAK, PROTEIN } = response.data;
    const formatResponse = {
      makanan: nama_makanan,
      energi: ENERGI,
      lemak: LEMAK,
      protein: PROTEIN,
    };

    // simpan hasil prediksi ke database
    const { userId } = request.auth.credentials;
    if (!userId) {
      return h.response({ status: 'fail', message: 'User not found' }).code(401);
    }
    const predictionData = {
      nama_makanan,
      portion_size,
      energi: ENERGI,
      lemak: LEMAK,
      protein: PROTEIN,
    };

    const saveResult = await predictModel.savePrediction(userId, predictionData);

    // Check if saving prediction data was successful
    if (!saveResult.success) {
      console.error('Failed to save prediction data to the database:', saveResult.message);
      return h.response({ status: 'fail', message: 'Failed to save prediction data.' }).code(500);
    }

    return h.response({
      status: 'success',
      dataprediksi: formatResponse,
    }).code(200);
  } catch (error) {
    return h.response({ status: 'fail', message: 'Failed to predict model' }).code(500);
  }
}

async function getPredictions(request, h) {
  try {
    const { user } = request;
    if (!user) {
      return h.response({ status: 'fail', message: 'User not found' }).code(404);
    }

    const predictions = await predictModel.getPredictionsByUserId(user.id);

    const formattedPredictions = predictions.map((prediction) => ({
      nama_makanan: prediction.nama_makanan,
      energi: prediction.energi,
      lemak: prediction.lemak,
      protein: prediction.protein,
    }));

    return h.response({
      status: 'success',
      datamakanan: formattedPredictions,
    }).code(200);
  } catch (error) {
    console.error('Error fetching predictions:', error.message); // eslint-disable-line no-console
    return h.response({ status: 'fail', message: 'Failed to fetch predictions' }).code(500);
  }
}

module.exports = { addPredict, getPredictions };
