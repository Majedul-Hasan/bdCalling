const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const Trainer = require('../models/Trainer.model');

// Create Trainer Controller
const createTrainer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,

      expertise,
      certifications,
      yearsOfExperience,
      availableDays,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' });
    }

    // Validate required fields
    if (!name || !email || !password || !expertise || !yearsOfExperience) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Trainer (inherits from User)
    const newTrainer = new Trainer({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'trainer', // Setting the role to Trainer
      expertise,
      certifications,
      yearsOfExperience,
      availableDays,
    });

    // Save the trainer in the database
    const savedTrainer = await newTrainer.save();

    // Return success response
    res.status(201).json({
      message: 'Trainer created successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating trainer', error: error.message });
  }
};

module.exports = { createTrainer };
