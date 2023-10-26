const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BusinessJoinNowSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});




const BusinessJoinNow = mongoose.model("BusinessJoinNow", BusinessJoinNowSchema);
module.exports = BusinessJoinNow;
