const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    admin:{
        type: Number
    },
    resetLink:{
        type: String,
        default: ''
    }
});

var user = module.exports = mongoose.model('user' , userSchema);
