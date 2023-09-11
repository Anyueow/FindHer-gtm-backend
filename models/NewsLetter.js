const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsLetter= new Schema({
    email:{
        type: String,
        required: true,
    },
})

const newsEmail = mongoose.model('NewsLetter', NewsLetter);
module.exports = newsEmail;