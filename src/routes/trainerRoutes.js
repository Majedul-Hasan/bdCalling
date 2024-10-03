const express = require('express');
const { viewTrainerSchedules } = require('../controllers/classSchedule');

const trainerRouter = express.Router();
// **/api/trainer
trainerRouter.get('/my-schedule', viewTrainerSchedules);

module.exports = trainerRouter;
