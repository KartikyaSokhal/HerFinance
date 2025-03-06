const Survey = require('../models/Survey');
const jwt = require('jsonwebtoken');

exports.submitSurvey = async (req, res) => {
  try {
    // Extract user ID from token
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    // Extract survey data from request body
    const {
      fullName,
      ageGroup,
      investmentKnowledge,
      monthlyIncome,
      monthlySavings,
      financialGoals,
      investmentInterest,
      financialAdvice,
      appSource
    } = req.body;

    // Create new survey
    const survey = new Survey({
      user: userId,
      fullName,
      ageGroup,
      investmentKnowledge,
      monthlyIncome,
      monthlySavings,
      financialGoals,
      investmentInterest,
      financialAdvice,
      appSource
    });

    // Save survey
    await survey.save();

    res.status(201).json({ 
      message: 'Survey submitted successfully',
      surveyId: survey._id 
    });
  } catch (error) {
    console.error('Survey submission error:', error);
    res.status(500).json({ message: 'Error submitting survey' });
  }
};

// Optional: Get user's survey
exports.getUserSurvey = async (req, res) => {
  try {
    // Extract user ID from token
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    // Find survey for this user
    const survey = await Survey.findOne({ user: userId });

    if (!survey) {
      return res.status(404).json({ message: 'No survey found for this user' });
    }

    res.json(survey);
  } catch (error) {
    console.error('Get survey error:', error);
    res.status(500).json({ message: 'Error retrieving survey' });
  }
};