const mongoose = require('mongoose');
const User = require('./User.model');
const { Schema } = mongoose;

// Trainer Schema (inherits from User)
const trainerSchema = new Schema({
  expertise: {
    type: String,
    required: true,
  },
  certifications: [
    {
      type: String,
      required: false,
    },
  ],
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  availableDays: {
    type: [String],
  },
});

const Trainer = User.discriminator('Trainer', trainerSchema);

module.exports = Trainer;
