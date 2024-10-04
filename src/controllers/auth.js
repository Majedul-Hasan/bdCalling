const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const { signJwt } = require('../middlewares/jwtMiddleware');
const AppError = require('../middlewares/AppError');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists', 400));
    }

    // Validate required fields
    if (!name || !email || !password) {
      return next(new AppError('Name, email, and password are required', 400));
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Validation error occurred.',
        errorDetails: {
          field: 'email',
          message: 'Invalid email format.',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'trainee',
    });

    const savedUser = await newUser.save();

    const token = signJwt(savedUser._id, savedUser.role);

    // Return token and user info
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        phone: savedUser.phone,
        profilePicture: savedUser.profilePicture,
      },
    });
  } catch (error) {
    next(error); // Forward any errors to the global error handler
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Validation error occurred.',
        errorDetails: {
          field: 'email',
          message: 'Invalid email format.',
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate JWT token
    const token = signJwt(user._id, user.role);

    // Return token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    next(error); // Forward any errors to the global error handler
  }
};

module.exports = { register, login };
