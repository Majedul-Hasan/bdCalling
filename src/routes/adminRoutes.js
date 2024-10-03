const express = require('express');
const { createTrainer } = require('../controllers/trainer');

const adminRouter = express.Router();

adminRouter.post('/create-trainer', createTrainer);

module.exports = adminRouter;
