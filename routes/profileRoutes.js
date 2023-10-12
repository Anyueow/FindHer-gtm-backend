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
const htmlSanitize = require("../middleware/htmlSanitize");
const { uploadAndCheckFileType } = require('../middleware/imageUpload');

const textflow = require("textflow.js");

textflow.useKey(process.env.TextFlow_Key);

router.get("/profile/view", authenticateJWT, async (req, res) => {
  console.log("View");
  try {
    const userDetails = await User.findOne({ _id: req.user.id });

    res.status(200).json({
      phoneNumber: userDetails.phoneNumber,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      profilePic: userDetails?.profilePic,
      companyName: userDetails.companyInfo?.companyName,
      positionTitle: userDetails.companyInfo?.jobTitle,
      department: userDetails.companyInfo?.department,
      companyOffice: userDetails.companyInfo?.officeLocation,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/profile/upload",htmlSanitize, uploadAndCheckFileType, authenticateJWT, async (req, res) => {
  console.log("upload");
  console.log(req.body);
  const { profilePic } = req.body;

    if (!profilePic) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  
  try {
    await User.findByIdAndUpdate(req.user.id, { profilePic: profilePic });
    res.status(201).json({ message: "Profile uploaded successfully." });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/profile/number/otp/request", htmlSanitize, authenticateJWT, async (req, res) => {
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

router.post("/profile/number/change",htmlSanitize, authenticateJWT, async (req, res) => {
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


router.post("/profile/email/otp/request", htmlSanitize, authenticateJWT, async (req, res) => {
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
    <!DOCTYPE html>
    <html>
      <head>  <style>
          body {
            font-family: Poppins;
            font-size: 16px;
          }
          .footer{
            background-color: black;
            color: white;
            align-items: center;
            text-align: center;
            font-size: 16px;
          }
          .menu a {
            color: white;      
            text-decoration: none; 
            font-family: Poppins;
            font-size: 21px;
            font-weight: 500;
        }
        </style>
      </head>
       <body>  <p>Hello ${user.firstName},</p>
      <p>Thank you for signing up at <b>FindHer</b>! We're thrilled to have you onboard. Please verify your email address using the code below.</p>
      <p><b>Your Verification Code:</b> ${otp}</p>
      <hr>
      <p>But that's not all! You're now part of a growing community eagerly waiting for the launch of FindHer. Here's why you should be excited:</p>
      <ul>
          <li>🚀 <b>Exclusive Early Access:</b> Being on our waitlist means you'll be among the first to experience all that our platform has to offer.</li>
          <li>💌 <b>Regular Updates:</b> We'll keep you in the loop with the latest news, updates, and features we're adding.</li>
          <li>🔓 <b>Unlock Insights:</b> With FindHer, you're on your way to unlocking exclusive information about unique opportunities tailored just for you.</li>
          <li>💡 <b>Stay Engaged:</b> Engage with our community on <a href="https://www.instagram.com/findher.work/" target="_blank">social media</a>, join discussions, share your thoughts, and even get sneak peeks of what's coming.</li>
      </ul>
      <p>Have questions or need assistance? Don't hesitate to reach out. We're here to help.</p>
      <p><b>See you soon on FindHer!</b></p>
      <p >Warm regards,</p>
      <p style="margin-bottom: 0">Anjali & Ananya</p>
      <p style="margin-top: 0;">Founders</p>
      </body>
      <div class="footer" style="padding: 30px;">
      <p>Stay Connected</p>
      <div class="icons">
      <a href="#"><img src="https://myawsbucket8870.s3.eu-north-1.amazonaws.com/facebook12.png" alt="Facebook" style="width: 36px; padding: 14px;"/></a>
      <a href="#" ><img src="https://myawsbucket8870.s3.eu-north-1.amazonaws.com/insta-black2.jpg" alt="Instagram" style="width: 45px; padding: 7px;"/></a>
          <a href="#" ><img src="https://myawsbucket8870.s3.eu-north-1.amazonaws.com/twitter.jpg" alt="twitter" style="width: 45px; padding: 10px;" /></a>
          <a href="#" ><img src="https://myawsbucket8870.s3.eu-north-1.amazonaws.com/youtube.png" alt="Youtube" style="width: 40px; padding: 18px;"/></a>
      </div>
      <div class="menu">
          <a href="#" style="padding: 10px;">FindHer</a> | 
          <a href="#" style="padding: 10px;">About</a> | 
          <a href="#" style="padding: 10px;">Terms of Use</a> | 
          <a href="#" style="padding: 10px;">Privacy</a>
      </div>
      <div class="address">
      <p  style="margin-bottom: 0;">123 Main Street, City, Country</p>
      <p style="margin-top: 0;">© 2023 FindHer.All rights reserved</p>
  </div>
  </div>
      </html>
      `;

    let result = await sendMail(
      email,
      "Your Verification Code from FindHer! 🎉",
      content
    );
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

router.post("/profile/email/change",htmlSanitize, authenticateJWT, async (req, res) => {
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

router.post("/profile/update", htmlSanitize, authenticateJWT, async (req, res) => {
  console.log("work");
  console.log(req.body);
  const { companyName, positionTitle, companyOffice, department } = req.body;

  if ( !companyName || !positionTitle || !companyOffice ||  !department) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  const userDetails = await User.findOne({ _id: req.user.id });
if(userDetails){
  try {
    userDetails.companyInfo.companyName=companyName;
    userDetails.companyInfo.jobTitle=positionTitle;
    userDetails.companyInfo.department=department;
    userDetails.companyInfo.officeLocation=companyOffice;
    await userDetails.save();
    console.log(result)
    res.status(201).json({ message: "Work details updated successfully." });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map(
        (error) => error.message
      );
      console.error("Validation errors occurred:", validationErrors[0]);
      res.status(400).json({ message: validationErrors[0] });
    } else {
      // Other types of errors
      console.error("Error occurred:", error.message);
      res.status(500).json({ message: error.message });
    }
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
    let notifCount=0;
    reviews.forEach((review) => {
      const { _id, engagement } = review;

      const newLikes = engagement.likes - engagement.pastlike;
      review.engagement.pastlike = engagement.likes;

      const newSaveCount = engagement.saveCount - engagement.pastsavecount;
      review.engagement.pastsavecount = engagement.saveCount;

      review.save();
      notifCount=notifCount+newLikes+newSaveCount;
      if (newLikes > 0 || newSaveCount > 0) {
        notifications.push({
          reviewId: _id,
          newLikes,
          newSaveCount,
        });
      }
    });
    // const notifCount = reviews.reduce((ini, item) => {
    //   const newLikes = item.engagement.likes - item.engagement.pastlike;
    //   const newSaveCount = item.engagement.saveCount - item.engagement.pastsavecount;
    //   return ini + newLikes + newSaveCount;
    // }, 0);
    const responseData = {
      notifCount,
      notifications,
    };
    // console.log(responseData);
    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
