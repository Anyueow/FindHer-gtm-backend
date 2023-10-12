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
  reviews: [
    {
      companyName: {
        type: String,
        default: "",
      },
      companyOffice: {
        type: String,
        default: "",
      },
      positionTitle: {
        type: String,
        default: "",
      },
      startDate: {
        type: String,
        default: "",
      },
      endDate: {
        type: String,
        default: "",
      },
      industry: {
        type: String,
        default: "",
      },
      department: {
        type: String,
        default: "",
      },
      employmentStatus: {
        type: String,
        default: "",
      },
      currworking: {
        type: Boolean,
        default: false,
      },
      features: {
        firstOne: [String],
        setTwo: [String],
      },
      ratings: {
        flexibility: {
          type: Number,
          default: 0,
        },
        management: {
          type: Number,
          default: 0,
        },
        coworkers: {
          type: Number,
          default: 0,
        },
        diversity: {
          type: Number,
          default: 0,
        },
        safety: {
          type: Number,
          default: 0,
        },
        compensation: {
          type: Number,
          default: 0,
        },
      },
      question1: {
        question: {
          type: String,
          default: "",
        },
        answer: {
          type: String,
          default: "",
        },
      },
      question2: {
        question: {
          type: String,
          default: "",
        },
        answer: {
          type: String,
          default: "",
        },
      },
      pageTimings: {
        firstPageTime: {
          type: String,
          default: "",
        },
        secondPageTime: {
          type: String,
          default: "",
        },
        thirdPageTime: {
          type: String,
          default: "",
        },
        fourthPageTime: {
          type: String,
          default: "",
        },
      },
      engagement: {
        likes: {
          type: Number,
          default: 0,
        },
        saveCount: {
          type: Number,
          default: 0,
        },
        pastlike: {
          type: Number,
          default: 0,
        },
        pastsavecount: {
          type: Number,
          default: 0,
        },
      },
      addInfo: {
        type: String,
        default: "",
      },
    },
  ],
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
