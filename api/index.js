const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_me';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// ==========================================
// 🧠 USERS (sirf uid aur password)
// ==========================================
const USERS = {
  '4372714908': {
    uid: '4372714908',
    passwordHash: bcrypt.hashSync(
      '08CF817C0BCEBB3B4D168E06D5CD4F63B9844DA8E807FC5CEB945BAF2E36AED9',
      10
    )
  }
};

// ==========================================
// 🏠 API Info
// ==========================================
app.get('/api', (req, res) => {
  res.json({
    status: true,
    message: '🚀 JWT API is running',
    version: '1.0.0',
    endpoints: {
      token: 'POST /token   body: { uid, password }',
      verify: 'POST /verify  body: { token }',
      profile: 'GET  /profile header: Authorization: Bearer <token>'
    }
  });
});

// ==========================================
// 🔐 TOKEN GENERATE
// ==========================================
app.post('/token', async (req, res) => {
  try {
    const uid = req.body?.uid || req.query?.uid;
    const password = req.body?.password || req.query?.password;

    if (!uid || !password) {
      return res.status(400).json({
        status: false,
        message: 'Missing uid or password'
      });
    }

    const user = USERS[uid];
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: 'Invalid password'
      });
    }

    // ✅ Sirf uid token me jaayega, koi naam nahi
    const token = jwt.sign(
      { uid: user.uid },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      status: true,
      message: 'Token generated successfully',
      token,
      expiresIn: JWT_EXPIRES
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
});

// ==========================================
// 🔎 VERIFY TOKEN
// ==========================================
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

// ==========================================
// 🛡️ AUTH MIDDLEWARE
// ==========================================
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
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: 'Invalid token',
      error: err.message
    });
  }
}

// ==========================================
// 👤 PROTECTED ROUTE
// ==========================================
app.get('/profile', authMiddleware, (req, res) => {
  res.json({
    status: true,
    message: 'Welcome to protected route',
    user: req.user
  });
});

// ==========================================
// 🚀 LOCAL SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server: http://localhost:${PORT}`);
  });
}

module.exports = app;
