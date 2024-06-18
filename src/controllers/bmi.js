/* eslint-disable no-console */
const Joi = require('joi');
const bmiModel = require('../models/bmiModel');

// data validation request bmi
const bmiSchema = Joi.object({
  weight: Joi.number().positive().required().messages({
    'number.positive': 'Must be a positive number',
    'any.required': 'Weight is required',
  }),
  height: Joi.number().positive().required().messages({
    'number.positive': 'Must be a positive number',
    'any.required': 'Height is required',
  }),
  gender: Joi.string().valid('male', 'female').required().messages({
    'any.only': 'Must be male or female',
    'any.required': 'Gender is required',
  }),
  dob: Joi.date().required().messages({
    'date.format': 'Must be a valid date of birth',
    'any.required': 'Date of birth is required',
  }),
});

// Function calculate BMI
async function calculateBmi(request, h) {
  try {
    const {
      weight, height, gender, dob,
    } = await bmiSchema.validateAsync(request.payload, { abortEarly: false });

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

    // Save BMI data to the database with token cookie
    const { userId } = request.auth.credentials;
    if (!userId) {
      return h.response({ status: 'fail', message: 'User not authenticated.' }).code(401);
    }
    const bmiData = {
      bmi: bmiResult,
      category,
      weight,
      height,
      dob,
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
      return h.response({ status: 'fail', message: 'Failed to save BMI data.' }).code(500);
    }

    // Return success response
    return h.response({
      status: 'success',
      message: 'BMI data saved successfully',
    }).code(200);
  } catch (e) {
    if (e.isJoi) {
      return h.response({ status: 'fail', message: e.message }).code(400);
    }
    console.error('Error calculating BMI', e.message);
    return h.response({ status: 'fail', message: 'Failed to calculate BMI' }).code(500);
  }
}

// Get id data BMI
async function getIdBmiData(request, h) {
  try {
    const { user } = request;
    if (!user) {
      return h.response({ status: 'fail', message: 'User not found' }).code(404);
    }
    const bmi = await bmiModel.getBmiByUserId(user.id);
    if (!bmi) {
      return h.respose({
        status: 'success',
        message: 'BMI data not found',
        bmi: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          bmi: null,
        },
      }).code(200);
    }
    return h.response({
      status: 'success',
      databmi: {
        bmi: bmi.bmi,
        category: bmi.category,
        weight: bmi.weight,
        height: bmi.height,
        age: bmi.age,
        gender: bmi.gender,
        healthyWeightRange: bmi.healthy_weight_range,
        calory: bmi.calory,
      },
    }).code(200);
  } catch (error) {
    console.error('Error getting BMI data by token', error.message);
    return h.response({ status: 'fail', message: 'Failed to get BMI data' }).code(500);
  }
}

module.exports = {
  calculateBmi,
  getIdBmiData,
};
