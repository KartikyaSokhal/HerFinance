const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Mock database
let users = [];

// JWT Secret
const JWT_SECRET = 'your_jwt_secret';

// Nodemailer setup (for sending emails)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password',
  },
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, name, email, password: hashedPassword };
  users.push(user);
  console.log('Registered Users:', users);

  res.status(201).json({ msg: 'User registered successfully' });
});
app.get('/api/auth/users', (req, res) => {
  res.json(users);
});
// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ msg: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ msg: 'Invalid password' });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Forgot password endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ msg: 'User not found' });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `http://localhost:3000/resetpassword.html?token=${token}`;

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ msg: 'Failed to send email' });
    }
    res.json({ msg: 'Password reset link sent to your email' });
  });
});

// Reset password endpoint
app.post('/api/auth/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(400).json({ msg: 'Invalid token' });

    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ msg: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Add these lines at the top of your backend server file
// const express = require('express');
// const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  next();
});

// Your existing backend code goes here