const express = require('express');
const {
  bookClassSchedule,
  cancelClassSchedule,
} = require('../controllers/classSchedule');

const traineeRouter = express.Router();

// ** /api/trainee
traineeRouter.post('/book-class-schedule', bookClassSchedule);
traineeRouter.post('/cancel-class-schedule', cancelClassSchedule);

module.exports = traineeRouter;
