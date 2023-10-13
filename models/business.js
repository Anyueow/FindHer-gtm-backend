const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  hq: {
    type: String,
  },
  offices: {
    type: [String],
  }
});

const businessSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  organizationSize: {
    type: String,
  },
  industry: {
    type: String,
  },
  overview: {
    type: String,
  },
  hiring: {
    type: String,
  },
  culture: {
    type: String,
  },
  topChoice: {
    type: String,
  },
  policies: {
    type: String,
  },
  addInfo: {
    type: String,
  },
  more: {
    type: String,
  },
  workplaceOffers:[],
  otherSpecify: {
    type: String,
  },
  locations: {
    type: locationSchema,
    _id: false, 
  },
});

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
