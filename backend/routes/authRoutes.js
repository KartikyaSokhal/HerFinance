const express = require('express');
const { 
  registerUser, 
  loginUser,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password/:token', resetPassword);

module.exports = router;