const mongoose = require('mongoose')


const FactorResponseModel = new mongoose.Schema({
    //These are the details we need the user to enter when creating their acct
    userId: {type: mongoose.Schema.Types.ObjectId,ref:'User'},
    factor: String,
    value: Number,

},{timestamps: true})

module.exports = mongoose.model('FactorResponses', FactorResponseModel)