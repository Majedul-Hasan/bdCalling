const express = require('express');
const { createTrainer, updateTrainer } = require('../controllers/trainer');
const { createClassSchedule } = require('../controllers/classSchedule');
const { uploadProfilePicture } = require('../middlewares/uploadProfilePicture');

const adminRouter = express.Router();

adminRouter.post('/create-trainer', createTrainer);
adminRouter.post('/create-class-schedule', createClassSchedule);
adminRouter.put(
  '/update-trainer/:trainerId',
  uploadProfilePicture,
  updateTrainer
);
module.exports = adminRouter;
