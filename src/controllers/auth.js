const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const bmiModel = require('../models/bmiModel');
require('dotenv').config();

const userSchema = Joi.object({
  nama: Joi.string().required().messages({
    'string.empty': 'Nama is not allowed to be empty',
    'any.required': 'Nama is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is not allowed to be empty',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.empty': 'Password is not allowed to be empty',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match password',
    'any.required': 'Confirm password is required',
  }),
});

async function signupUser(request, h) {
  try {
    const {
      nama,
      email,
      password,
    } = await userSchema.validateAsync(request.payload, { abortEarly: false });

    await userModel.createUser(nama, email, password);
    return h.response({
      status: 'success',
      message: 'User created successfully',
    }).code(201);
  } catch (e) {
    if (e.isJoi) {
      return h.response({ status: 'fail', message: e.message }).code(400);
    }
    if (e.code === 'ER_DUP_ENTRY') {
      return h.response({ status: 'fail', message: 'User already exists' }).code(400);
    }
    console.error('Error creating user:', e.message); // eslint-disable-line no-console
    return h.response({ error: 'Failed to create user', details: e.message }).code(500);
  }
}

const signinSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is not allowed to be empty',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.empty': 'Password is not allowed to be empty',
    'any.required': 'Password is required',
  }),
});

async function signinUser(request, h) {
  try {
    const {
      email,
      password,
    } = await signinSchema.validateAsync(request.payload, { abortEarly: false });

    const user = await userModel.findUserByEmail(email);
    if (user.length === 0) {
      return h.response({ status: 'fail', message: 'Invalid credentials email' }).code(401);
    }

    const isValidPassword = await userModel.verifyPassword(password, user[0].password);
    if (!isValidPassword) {
      return h.response({ status: 'fail', message: 'Invalid credentials password' }).code(401);
    }

    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    h.state('token', token, {
      ttl: 3600 * 1000,
      isSecure: process.env.NODE_ENV === 'production',
      isHttpOnly: true,
      path: '/',
    });

    return h.response({
      status: 'success',
      message: 'Login successfully',
      data: {
        id: user[0].id,
        token,
      },
    }).code(200);
  } catch (e) {
    if (e.isJoi) {
      return h.response({ status: 'fail', message: e.message }).code(400);
    }
    console.error('Error login user:', e.message); // eslint-disable-line no-console
    return h.response({ error: 'Failed to login user', details: e.message }).code(500);
  }
}

async function currentUser(request, h) {
  try {
    const { user } = request;
    if (!user) {
      return h.response({
        status: 'fail',
        message: 'User not found',
      }).code(404);
    }

    const bmi = await bmiModel.getBmiByUserId(user.id);

    if (!bmi) {
      return h.response({
        status: 'success',
        message: 'Bmi not found',
        data: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          bmi: null,
        },
      }).code(200);
    }

    return h.response({
      status: 'success',
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        bmi: {
          dob: bmi.dob,
          gender: bmi.gender,
          age: bmi.age,
          weight: bmi.weight,
          height: bmi.height,
        },
      },
    }).code(200);
  } catch (error) {
    console.error('Error getting current user:', error.message); // eslint-disable-line no-console
    return h.response({
      status: 'fail',
      message: 'Failed to get current user',
      detail: error.message,
    }).code(500);
  }
}

async function logoutUser(request, h) {
  try {
    h.unstate('token');
    return h.response({
      status: 'success',
      message: 'Logout successfully',
      expires: new Date(Date.now(0)),
      httpOnly: true,
    }).code(200);
  } catch (error) {
    console.error('Error logout user:', error.message); // eslint-disable-line no-console
    return h.response({
      status: 'fail',
      message: 'Failed to logout user',
      default: error.message,
    }).code(500);
  }
}

module.exports = {
  signupUser,
  signinUser,
  currentUser,
  logoutUser,
};
