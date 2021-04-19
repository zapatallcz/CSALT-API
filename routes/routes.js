const express = require('express')
const router = express.Router()
const registerUserTemplateCopy = require('../models/RegisterUserModels')

//this router will take care of users signing up for the app
router.post('/Register', (request, response) =>{
    const registeredUser = new registerUserTemplateCopy({
        fullName:request.body.fullName,
        email:request.body.email,
        password:request.body.password
    })
    registeredUser.save()
    .then(data =>{
        response.json(data)
    })
    .catch(error =>{
        response.json(error)
    })
})

module.exports = router