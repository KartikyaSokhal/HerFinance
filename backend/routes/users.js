const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming User model is in ../models/User

// POST route for user registration
router.post('/register', async (req, res) => {
    try {
      console.log('Register route hit');  // Check if the route is hit
  
      const { name, email, password } = req.body;
      console.log('Request body:', req.body);  // Check if you receive the expected body
  
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        console.log('User already exists');
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Create new user instance
      console.log('Creating new user');
      user = new User({
        name,
        email,
        password
      });
  
      // Save the user to the database
      console.log('Saving user to the database');
      await user.save();
  
      // Send success response
      console.log('User registered successfully');
      res.json({ msg: 'User registered successfully' });
  
    } catch (err) {
      console.error('Server error:', err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router; // Ensure the router is exported