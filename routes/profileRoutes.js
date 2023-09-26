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
const { sendMail } = require("../controller/SendMail");

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
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Please fill out all fields." });
    }

    const userDetails = await User.findOne({ phoneNumber: phoneNumber });

    if(userDetails){
      return res.status(400).json({ message: "Phone Number already in use." });
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
      { phoneNumber: userDetails.tempPhoneNumber },
      { new: true } // This option returns the updated document
    );
    res.status(201).json({ message: "Phone Number updated successfully." });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


router.post(
  "/profile/email/otp/request",
  authenticateJWT,
  async (req, res) => {
    console.log("otp email request");
    console.log(req.body);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please fill out all fields." });
    }

    const userDetails = await User.findOne({ email: email });

    if(userDetails){
      return res.status(400).json({ message: "Email already in use." });
    }

    const otp = generateNumericOTP(6);
    console.log("otp-----",otp);

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(otp, salt);
      
      await User.findByIdAndUpdate(
        req.user.id,
        {
          tempEmail: email,
          otp: hashedOtp,
        },
        { new: true }
      );

      const content = `
      <h4>Hi there,</h4>
      <p>Your OTP is: ${otp}</p>
      <p><b>Regards</b>,</p>
      <P>FindHer</p>
    `;
    
      let result = await sendMail(email, "Email change request - OTP", content);
      if (result) {
        console.log("SUCCESS");
        console.log(result);
        res
        .status(201)
        .json({ message: "OTP successfully send to your email." });
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

router.post("/profile/email/change", authenticateJWT, async (req, res) => {
  console.log("change/email");
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
      { email: userDetails.tempEmail },
      { new: true } // This option returns the updated document
    );
    res.status(201).json({ message: "Email updated successfully." });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/profile/work", authenticateJWT, async (req, res) => {
  console.log("work");
  console.log(req.body);
  const { companyName, positionTitle, companyOffice, department } = req.body;

  if ( !companyName || !positionTitle || !companyOffice ||  !department) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  const userDetails = await User.findOne({ _id: req.user.id });
if(userDetails){
  try {
    let result = await Review.findOneAndUpdate(
      { user: req.user.id },
      {
        companyName: companyName,
        positionTitle: positionTitle,
        companyOffice: companyOffice,
        department: department
      },
      { new: true }
    );
    console.log(result)
    res.status(201).json({ message: "Work details updated successfully." });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
else{
  console.log("Invalid user");
    res.status(500).json({ message: "Invalid user." });
}
});
router.get('/profile/notifications',authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  // console.log("hello",userId);
  try {

    const reviews = await Review.find({
      user: userId,
      $or: [
        {
          $expr: { $gt: ['$engagement.likes', '$engagement.pastlike'] },
        },
        {
          $expr: { $gt: ['$engagement.saveCount', '$engagement.pastsavecount'] },
        },
      ],
    });

    const notifications = [];

    reviews.forEach((review) => {
      const { _id, engagement } = review;

      const newLikes = engagement.likes - engagement.pastlike;
      review.engagement.pastlike = engagement.likes;

      const newSaveCount = engagement.saveCount - engagement.pastsavecount;
      review.engagement.pastsavecount = engagement.saveCount;

      review.save();

      if (newLikes > 0 || newSaveCount > 0) {
        notifications.push({
          reviewId: _id,
          newLikes,
          newSaveCount,
        });
      }
    });
    const notifCount = reviews.reduce((total, review) => {
      const newLikes = review.engagement.likes - review.engagement.pastlike;
      const newSaveCount = review.engagement.saveCount - review.engagement.pastsavecount;
      return total + newLikes + newSaveCount;
    }, 0);
    const responseData = {
      notifCount,
      notifications,
    };
    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
