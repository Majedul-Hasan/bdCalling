const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    phone: {
      required: false,
      type: String,
    },

    role: {
      type: String,
      enum: ['admin', 'trainer', 'trainee'],
      default: 'user',
      required: true,
    },
    profilePicture: {
      required: false,
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model('User', userSchema);

module.exports = User;
