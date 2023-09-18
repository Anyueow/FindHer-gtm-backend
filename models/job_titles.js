const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const job_titles = new Schema({
    job_title: {
        type: String,
    }
})

const jobTitle = mongoose.model('job_titles', job_titles);
module.exports = jobTitle;