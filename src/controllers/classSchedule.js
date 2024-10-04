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

// trainee privet
const bookClassSchedule = async (req, res) => {
  try {
    const { classId } = req.body;
    const loggedInUser = req.user;
    console.log(loggedInUser);

    // Ensure the logged-in user is a Trainee
    if (!loggedInUser || loggedInUser.role !== 'trainee') {
      return res.status(403).json({
        success: false,
        message: 'Only trainees can book a class',
      });
    }

    const classSchedule = await ClassSchedule.findById(classId);
    if (!classSchedule) {
      return res.status(404).json({
        success: false,
        message: 'Class schedule not found',
      });
    }

    console.log(classSchedule);
    // Check if the class is fully booked (max 10 trainees)
    if (classSchedule?.trainees?.length >= 10) {
      return res.status(400).json({
        success: false,
        message:
          'Class schedule is full. Maximum 10 trainees allowed per schedule.',
      });
    }

    // Ensure the trainee has not already booked the class
    const alreadyBooked = classSchedule.trainees.includes(loggedInUser.userId);
    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: 'You have already booked this class',
      });
    }
    classSchedule.trainees.push(loggedInUser.userId);

    // Save the updated class schedule
    await classSchedule.save();
    // Save the updated class schedule
    res.status(201).json({
      success: true,
      message: 'Class booked successfully',
      Data: classSchedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error booking class',
      error: error.message,
    });
  }
};

//  /api/trainer
const viewTrainerSchedules = async (req, res) => {
  try {
    const loggedInUser = req.user; // Assuming the logged-in user is set in req.user from authentication middleware

    // Ensure the logged-in user is a Trainer
    if (!loggedInUser || loggedInUser.role !== 'trainer') {
      return res.status(403).json({
        success: false,
        message: 'Only trainers can view their assigned class schedules',
      });
    }

    // Find all class schedules assigned to this trainer
    const assignedSchedules = await ClassSchedule.find({
      trainer: loggedInUser.userId,
    });

    if (!assignedSchedules || assignedSchedules.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No class schedules found',
      });
    }

    // Return the list of schedules assigned to the trainer
    res.status(200).json({
      success: true,
      message: 'Assigned class schedules retrieved successfully',
      schedules: assignedSchedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving class schedules',
      error: error.message,
    });
  }
};

// trainee privet
const cancelClassSchedule = async (req, res) => {
  try {
    const { classId } = req.body;
    const loggedInUser = req.user;
    /**
  
    if (!loggedInUser || loggedInUser.role !== 'trainee') {
      return res.status(403).json({
        success: false,
        message: 'Only trainees can cancel a class booking',
      });
    }
 */
    // Find the class schedule by classId
    const classSchedule = await ClassSchedule.findById(classId);
    if (!classSchedule) {
      return res.status(404).json({
        success: false,
        message: 'Class schedule not found',
      });
    }

    // Ensure the trainee has already booked the class
    const isBooked = classSchedule.trainees.includes(loggedInUser.userId);
    if (!isBooked) {
      return res.status(400).json({
        success: false,
        message: 'You have not booked this class',
      });
    }

    // Remove the trainee's ID from the class schedule
    classSchedule.trainees = classSchedule.trainees.filter(
      (traineeId) => traineeId.toString() !== loggedInUser.userId.toString()
    );

    // Save the updated class schedule
    await classSchedule.save();

    res.status(200).json({
      success: true,
      message: 'Class booking canceled successfully',
      classSchedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error canceling class booking',
      error: error.message,
    });
  }
};

module.exports = {
  createClassSchedule,
  bookClassSchedule,
  viewTrainerSchedules,
  cancelClassSchedule,
};
