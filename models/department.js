const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dept = new Schema({
    department: {
        type: String,
    }
})

const depart = mongoose.model('departments', dept);
module.exports = depart;