const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the available time slots for the classes
const availableTimeSlots = [
  '08:15 AM - 10:15 AM',
  '10:30 AM - 12:30 PM',
  '01:30 PM - 03:30 PM', // 60-minute lunch break
  '03:45 PM - 05:45 PM',
  '06:00 PM - 08:00 PM',
];

// Class Schedule Schema
const classScheduleSchema = new Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  trainees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  classDate: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    enum: availableTimeSlots, // Restrict to predefined time slots
    required: true,
  },
  maxTrainees: {
    type: Number,
    default: 10, // Maximum of 10 trainees per class
  },
});

module.exports = mongoose.model('ClassSchedule', classScheduleSchema);
