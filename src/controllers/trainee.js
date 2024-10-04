const ClassSchedule = require('../models/ClassSchedule.module');

const fs = require('fs');
const path = require('path');
const User = require('../models/User.model');

const getTraineeClasses = async (req, res) => {
  try {
    const loggedInUser = req.user;
    // Find all class schedules where the trainee has booked the class
    const traineeClasses = await ClassSchedule.find({
      trainees: loggedInUser.userId,
    }).select('-trainees'); // trainees should not send

    if (traineeClasses.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'No classes booked',
        data: [],
      });
    }

    // Return the list of classes
    res.status(200).json({
      success: true,
      message: 'Classes fetched successfully',
      data: traineeClasses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trainee classes',
      error: error.message,
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const loggedInUser = req.user; // Assuming req.user is populated with authenticated user details

    // Fetch the user's profile by their ID
    const traineeProfile = await User.findById(loggedInUser.userId).select(
      '-password'
    );

    if (!traineeProfile) {
      return res.status(404).json({
        success: false,
        message: 'profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'profile fetched successfully',
      profile: traineeProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

const updateMyProfile2 = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { name, phone } = req.body;

    // If there's a profile picture uploaded, use only its file name
    let profilePicture = req.file ? req.file.filename : undefined;

    // Create an object to hold the updates
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profilePicture) updateData.profilePicture = profilePicture;

    // Update the trainee's profile
    const updatedProfile = await User.findByIdAndUpdate(
      loggedInUser.userId,
      updateData,
      { new: true, runValidators: true, select: '-password' }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { name, phone } = req.body;

    // Find the user's existing profile
    const existingUser = await User.findById(loggedInUser.userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If there's a new profile picture uploaded, delete the previous one
    let profilePicture = req.file ? req.file.filename : undefined;

    if (profilePicture && existingUser.profilePicture) {
      // Construct the file path for the old profile picture
      const oldProfilePicPath = path.join(
        __dirname,
        '..',
        '..',
        'public',
        'uploads',
        existingUser.profilePicture
      );

      //   console.log('first', oldProfilePicPath);

      // Check if the old file exists and delete it
      if (fs.existsSync(oldProfilePicPath)) {
        fs.unlink(oldProfilePicPath, (err) => {
          if (err) {
            console.error('Error deleting old profile picture:', err);
          }
        });
      }
    }

    // Create an object to hold the updates
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profilePicture) updateData.profilePicture = profilePicture;

    // Update the trainee's profile
    const updatedProfile = await User.findByIdAndUpdate(
      loggedInUser.userId,
      updateData,
      { new: true, runValidators: true, select: '-password' }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

module.exports = { getTraineeClasses, getMyProfile, updateMyProfile };
