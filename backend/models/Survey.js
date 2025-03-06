const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  ageGroup: {
    type: String,
    enum: ['18-25', '26-35', '36-45', '46+'],
    required: true
  },
  investmentKnowledge: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  monthlyIncome: {
    type: Number,
    required: true
  },
  monthlySavings: {
    type: Number,
    required: true
  },
  financialGoals: {
    type: String,
    required: true
  },
  investmentInterest: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  financialAdvice: {
    type: String,
    required: true
  },
  appSource: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Survey', SurveySchema);