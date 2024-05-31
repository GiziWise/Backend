const Joi = require('joi');
const userModel = require('../models/userModel');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().required(),
  age: Joi.number().integer().required(),
  gender: Joi.string().valid('male', 'female').required(),
});

async function signupUser(request, h) {
  const { error, value } = userSchema.validate(request.payload);
  if (error) {
    return h.response({ error: 'Invalid payload', details: error.details }).code(400);
  }

  const {
    email, password, name, age, gender,
  } = value;

  try {
    await userModel.createUser(email, password, name, age, gender);
    return h.response({
      status: 'success',
      message: 'User registration successful',
      data: {
        name,
        gender,
        age,
        email,
      },
    }).code(201);
  } catch (e) {
    console.error('Error creating user:', e.message); // eslint-disable-line no-console
    return h.response({ error: 'Failed to create user', details: e.message }).code(500);
  }
}

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

async function signinUser(request, h) {
  const { error, value } = signinSchema.validate(request.payload);
  if (error) {
    return h.response({ error: 'Invalid payload', details: error.details }).code(400);
  }

  const { email, password } = value;

  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return h.response({ status: 'fail', message: 'Invalid email or password' }).code(401);
    }

    const isValidPassword = await userModel.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return h.response({ status: 'fail', message: 'Invalid email or password' }).code(401);
    }

    return h.response({
      status: 'success',
      message: 'User signin successful',
      data: {
        name: user.name,
        gender: user.gender,
        age: user.age,
        email: user.email,
      },
    }).code(200);
  } catch (e) {
    console.error('Error logging in user:', e.message); // eslint-disable-line no-console
    return h.response({ error: 'Failed to signin user', details: e.message }).code(500);
  }
}

module.exports = {
  signupUser,
  signinUser,
};
