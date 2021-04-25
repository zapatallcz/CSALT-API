const mongoose = require('mongoose')


const userTemplate = new mongoose.Schema({
    //These are the details we need the user to enter when creating their acct
    fullName:{
        type:String,
    },
    email:{
        type:String,
        unique: true,
        dropDups: true
    },
    password:{
        type:String,
    },
    answer1: {
        type:Number,
    },
    answer2: {
        type:Number,
    },
    answer3: {
        type:Number,
    },
    answer4: {
        type:Number,
    },
    answer5: {
        type:Number,
    },
    answer6: {
        type:Number,
    },
    answer7: {
        type:Number,
    },
    answer8: {
        type:Number,
    },
    date:{
        type:Date,
        default: Date.now
    }

})

module.exports = mongoose.model('mytable', userTemplate)