const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
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
      email,
      password,
    } = await userSchema.validateAsync(request.payload, { abortEarly: false });

    await userModel.createUser(email, password);
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
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
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
      throw new Error('User not found');
    }
    return h.response({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
      },
    }).code(200);
  } catch (error) {
    console.error('Error getting current user:', error.message); // eslint-disable-line no-console
    return h.response({
      status: 'fail',
      message: 'Failed to get current user',
      default: error.message,
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
