const ClassSchedule = require('../models/ClassSchedule.module');

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

module.exports = { getTraineeClasses };
