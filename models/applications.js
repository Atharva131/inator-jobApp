const mongoose = require("mongoose");
const schema = mongoose.Schema;



const ApplicationSchema = new schema({
    firstName : String,
    lastName : String,
    email : String,
    degree : String,
    skills : String,
    experience : String,
    achievements : String
});

module.exports = mongoose.model('Application', ApplicationSchema );
