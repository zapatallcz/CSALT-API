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
    }

})

module.exports = mongoose.model('mytable', registerUserTemplate)