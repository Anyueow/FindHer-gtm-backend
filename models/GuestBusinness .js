const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuestBusinnessSchema = new Schema({
  email: {
    type: String,
    required: true,
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




const GuestBusinness  = mongoose.model("GuestBusinness ", GuestBusinnessSchema );
module.exports = GuestBusinness;
