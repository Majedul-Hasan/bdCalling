const ClassSchedule = require('../models/ClassSchedule.module');
const User = require('../models/User.model');

const createClassSchedule = async (req, res) => {
  try {
    const { trainerId, classDate, timeSlot } = req.body;

    // Check if the provided trainerId belongs to a user with the "Trainer" role
    const trainer = await User.findById(trainerId);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(400).json({
        success: false,
        message: 'Invalid trainer.',
        errorDetails: 'The user must be a Trainer.',
      });
    }

    // Ensure the timeSlot is valid and not already taken for the day
    const existingSchedule = await ClassSchedule.findOne({
      classDate,
      timeSlot,
    });
    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: 'Class already scheduled for this time slot',
      });
    }

    // Create the new class schedule
    const newClassSchedule = new ClassSchedule({
      trainer: trainerId,
      classDate,
      timeSlot,
    });

    const savedClassSchedule = await newClassSchedule.save();

    res.status(201).json({
      message: 'Class scheduled successfully',
      classSchedule: savedClassSchedule,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error scheduling class', error: error.message });
  }
};
module.exports = { createClassSchedule };
