const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dept = new Schema({
    department: {
        type: String,
    }
})

const department = mongoose.model('department', dept);
module.exports = department;