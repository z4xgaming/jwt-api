const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// 🧠 Demo users (baad me database se replace karna)
const USERS = {
  '4372714908': {
    uid: '4372714908',
    password: '08CF817C0BCEBB3B4D168E06D5CD4F63B9844DA8E807FC5CEB945BAF2E36AED9',
    name: 'priya1234'
  }
};

// ✅ Root route
app.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'JWT API is running 🚀',
    endpoints: {
      token: 'POST /token  { uid, password }',
      verify: 'POST /verify { token }',
      profile: 'GET  /profile (Bearer token)'
    }
  });
});

// 🔐 TOKEN GENERATE
app.post('/token', (req, res) => {
  const { uid, password } = req.body || {};

  // Query se bhi support (GET ke liye)
  const finalUid = uid || req.query.uid;
  const finalPassword = password || req.query.password;

  if (!finalUid || !finalPassword) {
    return res.status(400).json({
      status: false,
      message: 'Missing uid or password'
    });
  }

  const user = USERS[finalUid];

  if (!user) {
    return res.status(404).json({
      status: false,
      message: 'User not found'
    });
  }

  if (user.password !== finalPassword) {
    return res.status(401).json({
      status: false,
      message: 'Invalid password'
    });
  }

  const token = jwt.sign(
    { uid: user.uid, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  res.json({
    status: true,
    message: 'Token generated successfully',
    token,
    expiresIn: JWT_EXPIRES
  });
});

// 🔎 VERIFY TOKEN
app.post('/verify', (req, res) => {
  const { token } = req.body || {};

  if (!token) {
    return res.status(400).json({
      status: false,
      message: 'Token required'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      status: true,
      message: 'Token is valid',
      data: decoded
    });
  } catch (err) {
    res.status(401).json({
      status: false,
      message: 'Invalid or expired token',
      error: err.message
    });
  }
});

// 🛡️ Middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({
      status: false,
      message: 'Authorization header missing'
    });
  }

  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: 'Invalid token',
      error: err.message
    });
  }
}

// 👤 PROTECTED ROUTE
app.get('/profile', authMiddleware, (req, res) => {
  res.json({
    status: true,
    message: 'Welcome to protected route',
    user: req.user
  });
});

// 🚀 Local run
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
