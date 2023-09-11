const express = require("express");
const router = express.Router();
const newsEmail = require("../models/NewsLetter");
router.use(express.json());

router.post("/newsletter", async (req, res) => {
    console.log("got the emmail");
  const { email } = req.body;
  try {
    const existingData = await newsEmail.findOne({ email: email });

    if (existingData) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    const newData = new newsEmail(req.body);
    await newData.save();
    console.log("email saved");
    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server down! please try again." });
  }
});

module.exports = router;