const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyOffice: {
    type: String,
    required: true,
  },

  positionTitle: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: false,
  },
  industry: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  employementStatus: {
    type: String,
    required: true,
  },
  currworking: {
    type: Boolean,
    required: true,
  },
  features: {
    firstOne: {
      type: [String],
    },
    setTwo: {
      type: [String],
    },
  },
  ratings: {
    flexibility: {
      type: Number,
    },
    management: {
      type: Number,
    },
    coworkers: {
      type: Number,
    },
    diversity: {
      type: Number,
    },
    safety: {
      type: Number,
    },
    compensation: {
      type: Number,
    },
  },
  question1: {
    question: {
      type: String,
      // required: true,
    },
    answer: {
      type: String,
      // required: true,
    },
  },
  question2: {
    question: {
      type: String,
      // required: true,
    },
    answer: {
      type: String,
      // required: true,
    },
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
