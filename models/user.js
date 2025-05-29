const { required } = require("joi");
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMonggose = require("passport-local-mongoose")

const userSchema = new Schema({
    email: {
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMonggose);

module.exports = mongoose.model('User', userSchema);  