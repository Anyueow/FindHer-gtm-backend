const express = require("express");
const router = express.Router();
const User = require("../models/user");
const SignIn = require("../models/signin");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const dotenv = require("dotenv");

const client = twilio(
  process.env.accountSid_twilio,
  process.env.authToken_twilio
);
router.use(express.json());

// POST - Add a new user
router.post("/register", async (req, res) => {
  console.log("holaaa", req.body);


  const { email, phoneNumber, password, otp } = req.body;
  // Check if the user has filled out everything
  if (!email || !phoneNumber || !password) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  try {
    const existingUserPhone = await SignIn.findOne({
      phoneNumber: phoneNumber,
    });
    if (existingUserPhone) {
      if (await bcrypt.compare(otp, existingUserPhone.otp )) {
        // Create new user
        const newUser = new User({
          email: existingUserPhone.email,
          phoneNumber: existingUserPhone.phoneNumber,
          password: existingUserPhone.password,
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
      }
    } else {
      return res.status(400).json({ message: "Please singin again" });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/verify", async (req, res) => {
  console.log("holaaa", req.body);
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

    const otp = generateNumericOTP(6);
    // Create new signin
    const newSignin = new SignIn({
      email,
      phoneNumber,
      password,
      otp,
    });

    const signinReg = await newSignin.save();

    if (signinReg) {
      // Return success message
      client.messages
        .create({
          body: `Your FindHer signin verification code is: ${otp} `, // Your message
          from: "+19523146358", // Your Twilio phone number
          to: "+91" + phoneNumber,
        })
        .then((message) =>
          console.log("Message sent. Message SID:", message.sid)
        )
        .catch((error) => console.error("Error sending message:", error));
      res.status(201).json({ message: "Signin successfully registered." });
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
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
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

function generateNumericOTP(length) {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits.charAt(randomIndex);
  }

  return otp;
}

module.exports = router;
