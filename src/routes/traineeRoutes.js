const express = require('express');
const {
  bookClassSchedule,
  cancelClassSchedule,
} = require('../controllers/classSchedule');
const { getTraineeClasses } = require('../controllers/trainee');

const traineeRouter = express.Router();

// ** /api/trainee
traineeRouter.get('/my-class', getTraineeClasses);
traineeRouter.post('/book-class-schedule', bookClassSchedule);
traineeRouter.post('/cancel-class-schedule', cancelClassSchedule);

module.exports = traineeRouter;
