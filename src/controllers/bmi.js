/* eslint-disable no-console */
const Joi = require('joi');
const bmiModel = require('../models/bmiModel');

// data validation request bmi
const bmiSchema = Joi.object({
  weight: Joi.number().positive().required(),
  height: Joi.number().positive().required(),
  gender: Joi.string().valid('male', 'female').required(),
  dob: Joi.date().iso().required(),
});

// Function calculate BMI
async function calculateBmi(request, h) {
  const { error } = bmiSchema.validate(request.payload);

  if (error) {
    return h.response({ error: error.details[0].message }).code(400);
  }

  // Take data request
  const {
    weight, height, gender, dob,
  } = request.payload;

  // Formula BMI
  const heightInMeters = height / 100; // assuming height is provided in cm
  const bmi = weight / (heightInMeters * heightInMeters);
  const bmiResult = Math.round(bmi * 10) / 10;

  // Calculate age
  const birthDate = new Date(dob);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  // Determine BMI category
  let category;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    category = 'Normal';
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  // Calculate healthy weight range
  const minHealthyWeight = 18.5 * (heightInMeters * heightInMeters);
  const maxHealthyWeight = 24.9 * (heightInMeters * heightInMeters);
  const roundedMinHealthyWeight = Math.round(minHealthyWeight * 10) / 10;
  const roundedMaxHealthyWeight = Math.round(maxHealthyWeight * 10) / 10;

  // Format healthy weight range as a string
  const healthyWeightRange = `${roundedMinHealthyWeight} kg - ${roundedMaxHealthyWeight} kg`;

  // Calculate BMR calory
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // Total Daily Energy Expenditure harian, minimal bergerak atau kerja
  const tee = bmr * 1.2;
  const calory = Math.round(tee * 10) / 10;

  // Save BMI data to the database
  const userId = request.auth.credentials ? request.auth.credentials.id : null;
  if (!userId) {
    return h.response({ error: 'User not authenticated.' }).code(401);
  }
  const bmiData = {
    bmi: bmiResult,
    category,
    weight,
    height,
    age,
    gender,
    healthyWeightRange,
    calory,
  };
  const saveResult = await bmiModel.saveBmiData(userId, bmiData);

  // Check if saving BMI data was successful
  if (!saveResult.success) {
    console.error('Failed to save BMI data to the database:', saveResult.message);
    // Handle error response
    return h.response({ error: 'Failed to save BMI data.' }).code(500);
  }

  // Return success response
  return h.response({
    status: 'success',
    message: 'BMI data saved successfully',
    bmi: bmiResult,
    category,
    weight,
    height,
    age,
    gender,
    healthyWeightRange,
    calory,
  }).code(200);
}

async function getAllBmiData(request, h) {
  try {
    const allBmiData = await bmiModel.getAllBmiData();
    return h.response(allBmiData).code(200);
  } catch (error) {
    console.error('Error fetching BMI data:', error);
    return h.response({ error: 'Failed to fetch BMI data.' }).code(500);
  }
}

async function getIdBmiData(request, h) {
  const { id } = request.params;
  try {
    const bmiData = await bmiModel.getIdBmiData(id);

    if (!bmiData) {
      return h.response({ error: 'BMI data not found.' }).code(404);
    }

    const responseData = {
      bmi: bmiData.bmi,
      category: bmiData.category,
      weight: bmiData.weight,
      height: bmiData.height,
      age: bmiData.age,
      gender: bmiData.gender,
      healthyWeightRange: bmiData.healthy_weight_range,
      calory: bmiData.calory,
    };

    return h.response(responseData).code(200);
  } catch (error) {
    console.error('Error fetching BMI data:', error);
    return h.response({ error: 'Failed to fetch BMI data' }).code(500);
  }
}

module.exports = {
  calculateBmi,
  getAllBmiData,
  getIdBmiData,
};
