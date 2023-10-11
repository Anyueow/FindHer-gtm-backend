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
    default:""
  },
  companyOffice: {
    type: String,
    default:""
  },

  positionTitle: {
    type: String,
    default:""
  },
  startDate: {
    type: String,
    default:""
  },
  endDate: {
    type: String,
    default:""
  },
  industry: {
    type: String,
    default:""
  },
  department: {
    type: String,
    default:""
  },
  employementStatus: {
    type: String,
    default:""
  },
  currworking: {
    type: Boolean,
    default:""
  },
  features: {
    firstOne: {
      type: [String], 
       default:""
    },
    setTwo: {
      type: [String],
       default:""
    },
  },
  ratings: {
    flexibility: {
      type: Number,
       default:""
    },
    management: {
      type: Number,
       default:""
    },
    coworkers: {
      type: Number,
       default:""
    },
    diversity: {
      type: Number,
       default:""
    },
    safety: {
      type: Number,
       default:""
    },
    compensation: {
      type: Number,
       default:""
    },
  },
  question1: {
    question: {
      type: String,
       default:""
      // required: true,
    },
    answer: {
      type: String,
       default:""
      // required: true,
    },
  },
  question2: {
    question: {
      type: String,
       default:""
      // required: true,
    },
    answer: {
      type: String,
       default:""
      // required: true,
    },
  },
  pageTimings: {
    firstPageTime: {
      type: String,
       default:""
    },
    secondPageTime: {
      type: String,
       default:""
    },
    thirdPageTime: {
      type: String,
       default:""
    },
    fourthPageTime: {
      type: String,
       default:""
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
    pastlike:{
      type: Number,
      default: 0,
    },
    pastsavecount:{
      type: Number,
      default: 0,
    }
  },
  addInfo:{
    type:String,
    default:""
  }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
