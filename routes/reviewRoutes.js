const express = require("express");
const router = express.Router();
const Review = require("../models/reviews");
const depart = require("../models/department");
const jobTitle = require("../models/job_titles");
const authenticateJWT = require("../middleware/auth");
router.use(express.json());

async function checkAndInsertJobTitle(item) {
  try {
    const existingJobTitle = await jobTitle.findOne({ job_title: { $regex: new RegExp(`^${item}$`, 'i') } });

    if (!existingJobTitle){
      const newItem = item.toLowerCase();
      const newJobTitle = new jobTitle({ job_title: newItem });
      await newJobTitle.save();
      console.log('Job title inserted:', newItem);
      return newJobTitle;
    }
  } catch (error) {
    console.error('Error checking and inserting job title:', error);
    throw error;
  }
}
async function checkAndInsertDepartment(item) {
  try {
    const existingDep = await depart.findOne({ department: { $regex: new RegExp(`^${item}$`, 'i') } });

    if (!existingDep){
      const newItem = item.toLowerCase();
      const newDep = new depart({ department: newItem });
      await newDep.save();
      console.log('Department inserted:', newDep);
      return newDep;
    }
  } catch (error) {
    console.error('Error checking and inserting Department:', error);
    throw error;
  }
}

// checkAndInsertJobTitle("CTO");
// POST - Add a new review
router.post(
  "/protectedRoute/createReview",
  authenticateJWT,
  async (req, res) => {
    const {
      companyName,
      industry,
      positionTitle,
      startDate,
      endDate,
      department,
      companyOffice,
      employementStatus,
      currworking,
      firstPageTime

    } = req.body;
    console.log(companyName,
      industry,
      positionTitle,
      startDate,
      endDate,
      department,
      companyOffice,
      employementStatus,
      currworking,);
    const userId = req.user.id; // Corrected line

    // Check if the user has filled out the required fields
    if (
      !companyName ||
      !companyOffice ||
      !positionTitle ||
      !startDate ||
      // !endDate ||
      // !currworking ||
      !employementStatus ||
      !department ||
      !industry
    ) {
      return res
        .status(400)
        .json({ message: "Please fill out all required fields." });
    }
    checkAndInsertJobTitle(positionTitle);
    checkAndInsertDepartment(department)
    try {
      const initialReview = new Review({
        companyName,
        industry,
        positionTitle,
        startDate,
        endDate,
        department,
        companyOffice,
        employementStatus,
        currworking,
        user: userId, // Include user field in the Review object
        pageTimings: {
          firstPageTime: firstPageTime,
        },
      }
      // { $set: { 'pageTimings.firstPageTime': firstPageTime } }
      );



      const savedReview = await initialReview.save();

      if (savedReview) {
        // Return success message and review ID
        res.status(201).json({
          message: "Review successfully created.",
          reviewId: savedReview._id,
        });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

const mongoose = require("mongoose");
const User = require("../models/user");

// ...

// Your route handler
router.post("/updateRatings", authenticateJWT, async (req, res) => {
  const { ratings, reviewId,secondPageTime } = req.body;
  const user = req.user.id;

  // Validate reviewId
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(400).json({ message: "Invalid review ID" });
  }

  try {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, user: user },
      { $set: { ratings: ratings, 'pageTimings.secondPageTime': secondPageTime }, },
      { new: true }
    );

    if (updatedReview) {
      res.status(200).json({
        message: "Ratings updated successfully.",
        review: updatedReview,
      });
    } else {
      res.status(400).json({ message: "Review not found." });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.post('/jobTitleList', async (req, res) => {
  const {inputTitle} = req.body;

  try {
    const regex = new RegExp(`^${inputTitle}`, 'i'); 
    const matchingJobTitles = await jobTitle.find({ job_title: { $regex: regex } }).limit(5);;

    res.json({ matchingJobTitles });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/jobDepList', async (req, res) => {
  const {inputDep} = req.body;

  try {
    const regex = new RegExp(`^${inputDep}`, 'i'); 
    const matchingDep = await depart.find({ department: { $regex: regex } }).limit(5);;

    res.json({ matchingDep });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// route to get all the reviews
router.get('/getReviews', async (req, res) => {
  const {user} = req.body;

  try {
    const userReviews = await Review.find({ user: user });

    if(userReviews){
      res.json({ userReviews });
    }
    else{
      res.status(500).json({ message: 'No Review found!' });
    }

  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// route to increase/decrease count of likes
router.post('/reviewLike', async (req, res) => {
  const {reviewId,increase} = req.body; // increase = false : review disliked

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    increase ? review.engagement.likes += 1 : review.engagement.likes -= 1 ;

    const updatedReview = await review.save();

    res.status(200).json({ message: 'Review like count increased', review: updatedReview });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// route to increase/decrease count of review saved
router.post('/reviewSave', async (req, res) => {
  const {reviewId,saved} = req.body; // saved = false : review unsaved hence decrement with one

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    saved ? review.engagement.saveCount += 1 : review.engagement.saveCount -= 1 ;

    const updatedReview = await review.save();

    res.status(200).json({ message: 'Review Save count increased', review: updatedReview });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// route to save saved-review id's to user's database
router.post('/userSavedReview', async (req, res) => {
  const {reviewId,saved} = req.body; // saved = false : review unsaved hence decrement with one
  const user = req.user.id;

  try {
    const user = await User.findById(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (saved) {
      if (!user.reviewSaved.includes(reviewId)) {
        user.reviewSaved.push(reviewId);
      }
    } else {
      const index = user.reviewSaved.indexOf(reviewId);
      if (index !== -1) {
        user.reviewSaved.splice(index, 1);
      }
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({ message: 'Review saved for user', user: updatedUser });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post("/updateReviewDetails", authenticateJWT, async (req, res) => {
  const { reviewId, questionOne, questionTwo,thirdPageTime} = req.body;

  const user = req.user.id;

  try {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, user: user },
      {
        $set: {
          'question1.question': questionOne.question,
          'question1.answer': questionOne.answer,
          'question2.question': questionTwo.question,
          'question2.answer': questionTwo.answer,
          'pageTimings.thirdPageTime': thirdPageTime
        },
      },
      { new: true }
    );

    if (updatedReview) {
      res.status(200).json({
        message: "Review details updated successfully.",
        review: updatedReview,
      });
    } else {
      res.status(400).json({ message: "Review not found." });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.post("/updateFeatures", authenticateJWT, async (req, res) => {
  const { reviewId, features,fourthPageTime} = req.body;

  const user = req.user.id;

  try {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, user: user },
      {
        $set: {
          'features.firstOne': features.firstOne,
          'features.setTwo': features.setTwo,
          'pageTimings.fourthPageTime': fourthPageTime
        },
      },
      { new: true }
    );

    if (updatedReview) {
      res.status(200).json({
        message: "Review details updated successfully.",
        review: updatedReview,
      });
      // console.log(features);
    } else {
      res.status(400).json({ message: "Review not found." });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
