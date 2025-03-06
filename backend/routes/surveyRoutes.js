const express = require('express');
const { submitSurvey, getUserSurvey } = require('../controllers/surveyController');
const router = express.Router();

// Middleware to protect routes
const authMiddleware = require('../middleware/auth');

// Submit survey route
router.post('/submit', authMiddleware, submitSurvey);

// Get user's survey route
router.get('/my-survey', authMiddleware, getUserSurvey);

module.exports = router;