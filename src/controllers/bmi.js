/* eslint-disable no-console */
const Joi = require('joi');
const bmiModel = require('../models/bmiModel');

const bmiSchema = Joi.object({
  weight: Joi.number().positive().required(),
  height: Joi.number().positive().required(),
  gender: Joi.string().valid('male', 'female').required(),
  dob: Joi.date().iso().required(),
});

const calculateBmiHandler = async (request, h) => {
  const { error } = bmiSchema.validate(request.payload);

  if (error) {
    return h.response({ error: error.details[0].message }).code(400);
  }

  const {
    weight, height, gender, dob,
  } = request.payload;

  // Calculate BMI
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
    bmi: bmiResult,
    category,
    weight,
    height,
    age,
    gender,
    healthyWeightRange,
  }).code(200);
};

module.exports = {
  calculateBmiHandler,
};
