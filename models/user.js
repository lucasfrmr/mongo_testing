const mongoose = require('mongoose');


// User Schema
const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        required: false
    },
    isLoggedin:{
        type: Boolean,
        required: false
    },
    shift:{
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);
