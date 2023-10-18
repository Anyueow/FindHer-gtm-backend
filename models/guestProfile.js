const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guestSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: [
      {
      validator: function(value) {
        return /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}/g.test(value);
      },
      message: 'Invalid email format',
      },
    ]
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: [
      {
      validator: function(value) {
        return /^\d+$/.test(value);
      },
      message: 'Only numbers are allowed in phone number',
      },
      {
      validator: function(value) {
        return value.length === 10;
      },
      message: 'Eaxctly 10 numbers are allowed in phone number',
    }
    ]
  },
  firstName: {
    type: String,
    required: true,
    validate: [{
      validator: function(value) {
        return /^[a-zA-Z]+$/.test(value);
      },
      message: 'Only alphabets are allowed in first name',
    },
    {
    validator: function(value) {
      return value.length <= 15;
    },
    message: 'Maximum 15 characters is allowed in first name',
  }
  ]
  },
  lastName: {
    type: String,
    required: true,
    validate: [{
      validator: function(value) {
        return /^[a-zA-Z]+$/.test(value);
      },
      message: 'Only alphabets are allowed in last name',
    },
    {
    validator: function(value) {
      return value.length <= 15;
    },
    message: 'Maximum 15 characters is allowed in last name',
  }
  ]
  },
  linkedinProfile: {
    type: String,
  },
});



const GuestProfile = mongoose.model("guest", guestSchema);
module.exports = GuestProfile;
