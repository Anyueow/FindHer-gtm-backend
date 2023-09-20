const express = require("express");
const router = express.Router();
router.use(express.json({ limit: "50mb" }));
const User = require("../models/user");
const Review = require("../models/reviews");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const authenticateJWT = require("../middleware/auth");
const { generateNumericOTP } = require("../controller/otpGenerator");

const textflow = require("textflow.js");

textflow.useKey(process.env.TextFlow_Key);

router.get("/profile/view", authenticateJWT, async (req, res) => {
  console.log("View");
  try {
    const userDetails = await User.findOne({ _id: req.user.id });

    const workDetails = await Review.findOne({ user: req.user.id });
    res.status(200).json({
      phoneNumber: userDetails.phoneNumber,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      profilePic: userDetails.profilePic,
      companyName: workDetails.companyName,
      positionTitle: workDetails.positionTitle,
      department: workDetails.department,
      companyOffice: workDetails.companyOffice,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/profile/upload", authenticateJWT, async (req, res) => {
  console.log("upload");
  console.log(req.body);
  const { profilePic } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, { profilePic: profilePic });
    res.status(201).json({ message: "Profile uploaded successfully." });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post(
  "/profile/number/otp/request",
  authenticateJWT,
  async (req, res) => {
    console.log("otp request");
    console.log(req.body);
    const { phoneNumber, email } = req.body;

    if (!phoneNumber || !email) {
      return res.status(400).json({ message: "Please fill out all fields." });
    }
    const otp = generateNumericOTP(6);
    console.log("otp-----",otp);

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(otp, salt);
      
      await User.findByIdAndUpdate(
        req.user.id,
        {
          tempPhoneNumber: phoneNumber,
          tempEmail: email,
          otp: hashedOtp,
        },
        { new: true }
      );
      let result = await textflow.sendSMS(
        `+91${phoneNumber}`,
        `Your FindHer signin verification code is: ${otp}`
      );
      if (result.ok) {
        console.log("SUCCESS");
        console.log(result);
        res
        .status(201)
        .json({ message: "OTP send to registered mobile number." });
      } else {
        console.log(result);
        console.log("OTP failed");
        res
        .status(400)
        .json({ message: "OTP failed." });
      }
    
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

router.post("/profile/number/change", authenticateJWT, async (req, res) => {
  console.log("change/number");
  console.log(req.body);
  const { otp } = req.body;

  if ( !otp) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  const userDetails = await User.findOne({ _id: req.user.id });

  if (!userDetails || !(await bcrypt.compare(otp, userDetails.otp))
  ) {
    return res
      .status(400)
      .json({ message: "Invalid otp." });
  }

  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { phoneNumber: userDetails.tempPhoneNumber, email: userDetails.tempEmail, otp: otp },
      { new: true } // This option returns the updated document
    );
    res.status(201).json({ message: "Phone Number updated successfully." });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
