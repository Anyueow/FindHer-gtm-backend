const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const signinSchema = new Schema({
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
  password: {
    type: String,
    required: true,
    validate: [
      {
      validator: function(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!%*^?&#])[A-Za-z\d@!%*^?&#]{8,16}$/.test(value);
      },
      message: 'Password must have 8 to 16 characters, at least one uppercase letter, and at least one special symbol (excluding $).',
      },
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
  otp: {
    type: String,
    required: true,
    validate: [
      {
      validator: function(value) {
        return /^\d+$/.test(value);
      },
      message: 'Only numbers are allowed',
      },
      {
      validator: function(value) {
        return value.length === 6;
      },
      message: 'Eaxctly 6 numbers are allowed',
    }
    ]
  },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Set TTL to 300 seconds (5 minutes)
  },
});


// Hashing password using bcrypt before saving user
signinSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  if (!this.isModified("otp")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(this.password)
    this.otp = await bcrypt.hash(this.otp, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Method to compare otp using bcrypt
signinSchema.methods.compareOTP = async function (otp) {
  return bcrypt.compare(String(otp), this.otp);
};
const SignIn = mongoose.model("signin", signinSchema);
module.exports = SignIn;
