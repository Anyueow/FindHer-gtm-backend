const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const locationSchema = new Schema({

  HQ: {
    type: String,
  },
  otherLocations: [
    {
      type: String,
    },
  ],
});

// locationSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// });

// locationSchema.methods.comparePassword = async function (password) {
//   return bcrypt.compare(password, this.password);
// };

const businessSchema = new Schema({
  companyName: {
    type: String,
    unique: true,
  },
  personName: {
    type: String,
  },
  personEmail: {
    type: String,
  },
  websiteLink: {
    type: String,
  },
  employeesCount: {
    type: String,
  },
  industryType: {
    type: String,
  },
  aboutUs: {
    type: String,
  },
  requirements: {
    type: String,
  },
  lifeAtWork: {
    type: String,
  },
  whyUS: {
    type: String,
  },
  moreDetails: {
    type: String,
  },
  amenities: [
    {
      type: String,
    },
  ],
  programs: [
    {
      type: String,
    },
  ],
  locations: [locationSchema],
});

const Business = mongoose.model("BUSINESS", businessSchema);
module.exports = Business;
