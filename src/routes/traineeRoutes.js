const express = require('express');

const {
  bookClassSchedule,
  cancelClassSchedule,
} = require('../controllers/classSchedule');
const {
  getTraineeClasses,
  getMyProfile,
  updateMyProfile,
} = require('../controllers/trainee');
const { uploadProfilePicture } = require('../middlewares/uploadProfilePicture');

const traineeRouter = express.Router();

// ** /api/trainee
traineeRouter.put('/update-my-profile', uploadProfilePicture, updateMyProfile);
traineeRouter.get('/my-profile', getMyProfile);
traineeRouter.get('/my-class', getTraineeClasses);
traineeRouter.post('/book-class-schedule', bookClassSchedule);
traineeRouter.post('/cancel-class-schedule', cancelClassSchedule);

module.exports = traineeRouter;
