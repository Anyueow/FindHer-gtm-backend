const express = require('express');
const router = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.use(express.json());

// POST - Add a new user
router.post("/register", async (req, res) => {
    console.log("holaaa",req.body);

  const { email, phoneNumber, password } = req.body;

  // Check if the user has filled out everything
  if (!email || !phoneNumber || !password) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  try {
    // Check if there is already an existing user with the same email or phone number
    const existingUserEmail = await User.findOne({ email: email });
    if (existingUserEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const existingUserPhone = await User.findOne({ phoneNumber: phoneNumber });
    if (existingUserPhone) {
      return res.status(400).json({ message: "Phone number already in use." });
    }

    // Create new user
    const newUser = new User({
      email,
      phoneNumber,
      password,
    });

    const userReg = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    if (userReg) {
      // Return success message
      res
        .status(201)
        .json({ message: "User successfully registered.", token: token });
    } else {
      console.error("Error occurred:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// POST - Login an existing user
router.post("/login", async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  // Check if the user has filled out everything
  if (!((email || phoneNumber) && password)) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  try {
    // Check if there is an existing user with the same email or phone number
    const existingUser = await User.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });

    // If the user does not exist or the password does not match, send an error response
    if (
      !existingUser || !(await bcrypt.compare(password, existingUser.password))
    ) {
      return res
        .status(400)
        .json({ message: "Invalid email, phone number or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Return success message with token
    res.status(200).json({
      message: "User successfully logged in.",
      token: token,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
