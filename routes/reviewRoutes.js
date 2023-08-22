const express = require("express");
const router = express.Router();
const Review = require("../models/reviews");
const authenticateJWT = require("../middleware/auth");
router.use(express.json());
// POST - Add a new review
router.post(
  "/protectedRoute/createReview",
  authenticateJWT,
  async (req, res) => {
    const { companyName, companyOffice, positionTitle, startDate, endDate } =
      req.body;

    const userId = req.user.id; // Corrected line

    // Check if the user has filled out the required fields
    if (
      !companyName ||
      !companyOffice ||
      !positionTitle ||
      !startDate ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ message: "Please fill out all required fields." });
    }

    try {
      const initialReview = new Review({
        companyName,
        companyOffice,
        positionTitle,
        startDate,
        endDate,
        user: userId, // Include user field in the Review object
      });

      const savedReview = await initialReview.save();

      if (savedReview) {
        // Return success message and review ID
        res
          .status(201)
          .json({
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

// ...

// Your route handler
router.post("/updateRatings", authenticateJWT, async (req, res) => {
  const { ratings, reviewId } = req.body;
  const user = req.user.id;

  // Validate reviewId
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(400).json({ message: "Invalid review ID" });
  }

  try {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, user: user },
      { $set: { ratings: ratings } },
      { new: true }
    );

    if (updatedReview) {
      res
        .status(200)
        .json({
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

// Update the review with the additional fields:
router.post("/updateReviewDetails", authenticateJWT, async (req, res) => {
  const { reviewId, goodThings, badThings, amenities, benefits } = req.body;

  const user = req.user.id;

  try {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, user: user },
      {
        $set: {
          goodThings: goodThings,
          badThings: badThings,
          amenities: amenities,
          benefits: benefits,
        },
      },
      { new: true }
    );

    if (updatedReview) {
      res
        .status(200)
        .json({
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

module.exports = router;
