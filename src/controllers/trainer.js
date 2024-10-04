const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const Trainer = require('../models/Trainer.model');

const fs = require('fs');
const path = require('path');

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

// update Trainer Controller ADMIN private
const updateTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
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

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    // If email is being updated, check if it's already in use by another user
    if (email && email !== trainer.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use',
        });
      }
    }

    // If there's a profile picture uploaded, delete the old one and update with the new file name
    let profilePicture = req.file ? req.file.filename : undefined;
    if (profilePicture && trainer.profilePicture) {
      const oldProfilePicPath = path.join(
        __dirname,
        '..',
        '..',
        'public',
        'uploads',
        trainer.profilePicture
      );
      if (fs.existsSync(oldProfilePicPath)) {
        fs.unlink(oldProfilePicPath, (err) => {
          if (err) {
            console.error('Error deleting old profile picture:', err);
          }
        });
      }
    }

    // If password is provided, hash it before updating
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the trainer's details (only fields that are provided)
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (hashedPassword) updateData.password = hashedPassword;
    if (phone) updateData.phone = phone;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (expertise) updateData.expertise = expertise;
    if (certifications) updateData.certifications = certifications; //previous with new array of certificates
    if (yearsOfExperience) updateData.yearsOfExperience = yearsOfExperience;
    if (availableDays) updateData.availableDays = availableDays;

    // Save the updated trainer details
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      trainerId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Trainer updated successfully',
      data: updatedTrainer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating trainer',
      error: error.message,
    });
  }
};

module.exports = { createTrainer, updateTrainer };
