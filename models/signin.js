const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const signinSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
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
