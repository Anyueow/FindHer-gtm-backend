const express = require("express");
const router = express.Router();
const Review = require("../models/reviews");
const depart = require("../models/department");
const jobTitle = require("../models/job_titles");
const authenticateJWT = require("../middleware/auth");
const htmlSanitize = require("../middleware/htmlSanitize");
const mongoose = require("mongoose");
const User = require("../models/user");

router.use(express.json());

async function checkAndInsertJobTitle(item) {
  try {
    const item1 = item.slice(0, 100); 
    const existingJobTitle = await jobTitle.findOne({ job_title: { $regex: new RegExp(`^${item1}$`, 'i') } });

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
    const item1 = item.slice(0, 100); 
    const existingDep = await depart.findOne({ department: { $regex: new RegExp(`^${item1}$`, 'i') } });

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
router.post("/createReview", htmlSanitize, authenticateJWT, async (req, res) => {
  const { companyName, industry, positionTitle, startDate, endDate, department, companyOffice, employementStatus, 
    currworking, firstPageTime} = req.body;

    console.log("review")
  
  const userId = req.user.id; // Retrieve the user ID from the request

  // Check if the user has filled out the required fields
  if (!companyName || !companyOffice || !positionTitle || !startDate || !employementStatus || !department || !industry) 
  {
    console.log( "Please fill out all required fields.")
    return res.status(400).json({ message: "Please fill out all required fields." });
  }
  try {
  // Create a new review object
  const newReview = {
    companyName: companyName,
    industry: industry,
    positionTitle: positionTitle,
    startDate: startDate,
    endDate: endDate, 
    department: department,
    companyOffice: companyOffice,
    employementStatus: employementStatus,
    currworking: currworking,
    pageTimings: {
      firstPageTime: firstPageTime,
    },
  };

   
    const checkLength = await Review.findOne({ user: userId });
    const reviewLength = checkLength.reviews.length;

    const updatedUser = await User.findById(userId);
    if (reviewLength === 0) {
      updatedUser.companyInfo.companyName = companyName;
      updatedUser.companyInfo.jobTitle = positionTitle;
      updatedUser.companyInfo.department = department;
      updatedUser.companyInfo.officeLocation = companyOffice;
      // Save the updated user document
      await updatedUser.save();
    }

 // Find the user by their user ID and push the new review into their reviews array
    const updatedReview = await Review.findOneAndUpdate(
      { user: userId },
      { $push: { reviews: newReview } },
      { new: true }
    );
    console.log(updatedReview.reviews[updatedUser.reviews.length ]._id)
    if (updatedReview) {
      const reviewId = updatedReview.reviews[updatedUser.reviews.length ]._id;

    
      console.log(reviewId)
      res.status(201).json({
        message: "Review successfully created.",
        reviewId: reviewId,
      });
    } else {
      console.log(updatedReview)
      console.error("Error occurred while updating", );
      res.status(500).json({ message: "Internal server error." });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



// ...

// Your route handler
router.post("/updateRatings", htmlSanitize, authenticateJWT, async (req, res) => {
  const { ratings, reviewId,secondPageTime } = req.body;
  const userId = req.user.id;
console.log(userId, "ratings")
  // Validate reviewId
  // if (!mongoose.Types.ObjectId.isValid(reviewId)) {
  //   return res.status(400).json({ message: "Invalid review ID" });
  // }

  try {
    const updatedReview = await Review.findOne({ user: userId });
    if (updatedReview) {
      // Find the index of the review within the reviews array based on the _id
      const reviewIndex = updatedReview.reviews.findIndex(review => review._id.toString() === reviewId);
    
      if (reviewIndex !== -1) {
        // Update the fields of the specific review
        updatedReview.reviews[reviewIndex].ratings = ratings;
        updatedReview.reviews[reviewIndex].pageTimings.secondPageTime = secondPageTime;
    
        // Save the updated user object
        const update = await updatedReview.save();
        res.status(200).json({message: "Ratings updated successfully."});
      } else {
        console.error('Review not found.');
      }
    } else {
      console.error('User not found.');
    }
    
    // const updatedReview = await Review.findOneAndUpdate(
    //   { _id: reviewId, user: userId },
    //   { $set: { ratings: ratings, 'pageTimings.secondPageTime': secondPageTime }, },
    //   { new: true }
    // );

    // if (updatedReview) {
    //   res.status(200).json({
    //     message: "Ratings updated successfully.",
    //     review: updatedReview,
    //   });
    // } else {
    //   res.status(400).json({ message: "Review not found." });
    // }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.post('/jobTitleList', htmlSanitize, async (req, res) => {
  const {inputTitle} = req.body;

  try {
    const item1 = inputTitle.slice(0, 100); 
    const regex = new RegExp(`^${item1}`, 'i'); 
    const matchingJobTitles = await jobTitle.find({ job_title: { $regex: regex } }).limit(5);;

    res.json({ matchingJobTitles });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/jobDepList', htmlSanitize, async (req, res) => {
  const {inputDep} = req.body;

  try {
    const item1 = inputDep.slice(0, 100); 
    const regex = new RegExp(`^${item1}`, 'i'); 
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
router.post('/reviewLike', htmlSanitize, async (req, res) => {
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
router.post('/reviewSave', htmlSanitize, async (req, res) => {
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
router.post('/userSavedReview', htmlSanitize, async (req, res) => {
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
router.post("/updateReviewDetails",htmlSanitize, authenticateJWT, async (req, res) => {
  const { reviewId, questionOne, questionTwo,thirdPageTime} = req.body;

  const userId = req.user.id;

  try {
    const updatedReview = await Review.findOne({ user: userId });
    if (updatedReview) {
      // Find the index of the review within the reviews array based on the _id
      const reviewIndex = updatedReview.reviews.findIndex(review => review._id.toString() === reviewId);
    
      if (reviewIndex !== -1) {
        // Update the fields of the specific review
        updatedReview.reviews[reviewIndex].question1.question =  questionOne.question;
        updatedReview.reviews[reviewIndex].question1.answer =  questionOne.answer;
        updatedReview.reviews[reviewIndex].question2.question =  questionTwo.question;
        updatedReview.reviews[reviewIndex].question2.answer =  questionTwo.answer;
        updatedReview.reviews[reviewIndex].pageTimings.thirdPageTime =  thirdPageTime;
        // Save the updated user object
        const update = await updatedReview.save();
        res.status(200).json({message: "Review details updated successfully."});
      } else {
        console.error('Review not found.');
      }
    } else {
      console.error('User not found.');
      res.status(200).json({message: "Invalid user credentials"});
    }
    // const updatedReview = await Review.findOneAndUpdate(
    //   {  user: user },
    //   {
    //     $set: {
    //       'question1.question': questionOne.question,
    //       'question1.answer': questionOne.answer,
    //       'question2.question': questionTwo.question,
    //       'question2.answer': questionTwo.answer,
    //       'pageTimings.thirdPageTime': thirdPageTime
    //     },
    //   },
    //   { new: true }
    // );

    // if (updatedReview) {
    //   res.status(200).json({
    //     message: "Review details updated successfully.",
    //     review: updatedReview,
    //   });
    // } else {
    //   res.status(400).json({ message: "Review not found." });
    // }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.post("/updateFeatures",htmlSanitize, authenticateJWT, async (req, res) => {
  const { reviewId, features,fourthPageTime,addInfo} = req.body;

  const userId = req.user.id;

  try {
    const updatedReview = await Review.findOne({ user: userId });
    if (updatedReview) {
      // Find the index of the review within the reviews array based on the _id
      const reviewIndex = updatedReview.reviews.findIndex(review => review._id.toString() === reviewId);
    
      if (reviewIndex !== -1) {
        // Update the fields of the specific review
        updatedReview.reviews[reviewIndex].features.firstOne =  features.firstOne;
        updatedReview.reviews[reviewIndex].features.setTwo =  features.setTwo;
        updatedReview.reviews[reviewIndex].addInfo =  addInfo;
        updatedReview.reviews[reviewIndex].pageTimings.fourthPageTime =  fourthPageTime;
        // Save the updated user object
        const update = await updatedReview.save();
        res.status(200).json({message: "Review details updated successfully."});
      } else {
        console.error('Review not found.');
      }
    } else {
      console.error('User not found.');
      res.status(200).json({message: "Invalid user credentials"});
    }
    // const updatedReview = await Review.findOneAndUpdate(
    //   { _id: reviewId, user: user , addInfo:addInfo},
    //   {
    //     $set: {
    //       'features.firstOne': features.firstOne,
    //       'features.setTwo': features.setTwo,
    //       'pageTimings.fourthPageTime': fourthPageTime
    //     },
    //   },
    //   { new: true }
    // );

    // if (updatedReview) {
    //   res.status(200).json({
    //     message: "Review details updated successfully.",
    //     review: updatedReview,
    //   });
    //   // console.log(features);
    // } else {
    //   res.status(400).json({ message: "Review not found." });
    // }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
