const mongoose = require('mongoose')


const registerUserTemplate = new mongoose.Schema({
    //These are the details we need the user to enter when creating their acct
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    livesOnCampus:{
        type: Boolean,
        required: true
    },
    date:{
        type:Date,
        default: Date.now
    },
    isAdmin:{
        type: Boolean,
        default: false,
        required: false
    }

})

module.exports = mongoose.model('User', registerUserTemplate)