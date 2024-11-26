import express from 'express';
import passport from 'passport';
import { generateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || 'Invalid credentials'
      });
    }

    const token = generateToken(user);
    
    // Remove sensitive data
    user.password = undefined;

    res.json({
      success: true,
      token,
      user
    });
  })(req, res, next);
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, surname, phoneNumber, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      surname,
      phoneNumber,
      role: role || 'customer'
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    // Remove sensitive data
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// Get current user
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;