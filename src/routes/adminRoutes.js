const express = require('express');
const {
  createTrainer,
  updateTrainer,
  deleteTrainer,
} = require('../controllers/trainer');
const { createClassSchedule } = require('../controllers/classSchedule');
const { uploadProfilePicture } = require('../middlewares/uploadProfilePicture');

const adminRouter = express.Router();

adminRouter.post('/create-trainer', createTrainer);
adminRouter.delete('/delete-trainer/:trainerId', deleteTrainer);
adminRouter.post('/create-class-schedule', createClassSchedule);
adminRouter.put(
  '/update-trainer/:trainerId',
  uploadProfilePicture,
  updateTrainer
);
module.exports = adminRouter;
