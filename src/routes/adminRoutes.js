const express = require('express');
const { createTrainer } = require('../controllers/trainer');
const { createClassSchedule } = require('../controllers/classSchedule');

const adminRouter = express.Router();

adminRouter.post('/create-trainer', createTrainer);
adminRouter.post('/create-class-schedule', createClassSchedule);

module.exports = adminRouter;
