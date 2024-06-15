/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
const axios = require('axios');

async function predictModel(request, h) {
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
    return h.response({
      status: 'success',
      data: formatResponse,
    }).code(200);
  } catch (error) {
    return h.response({ status: 'fail', message: 'Failed to predict model' }).code(500);
  }
}

module.exports = { predictModel };
