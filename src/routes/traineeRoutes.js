const express = require('express');
const { bookClassSchedule } = require('../controllers/classSchedule');

const traineeRouter = express.Router();

// ** /api/trainee
traineeRouter.post('/book-class-schedule', bookClassSchedule);

module.exports = traineeRouter;
