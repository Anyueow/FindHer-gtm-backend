const express = require("express");
const router = express.Router();
const GuestProfile = require("../models/guestProfile");
const htmlSanitize = require("../middleware/htmlSanitize");

router.use(express.json());


router.post("/guestProfile", htmlSanitize, async (req, res) => {
  console.log("holaaa", req.body);
  const { email, phoneNumber, firstName, lastName, linkedinProfile } = req.body;

  // Check if the user has filled out everything

  if (!email || !phoneNumber  || !firstName || !lastName) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  try {
    const guest = new GuestProfile({
      email,
      phoneNumber,
      firstName,
      lastName,
      linkedinProfile
    });

    const guestReg = await guest.save();

    if (guestReg) {
        res.status(201).json({ message: "Guest profile created successfully" });
    } else {
      console.error("Error occurred:", error);
      res.status(500).json({ message: "Internal server error." });
    }
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
});



module.exports = router;
