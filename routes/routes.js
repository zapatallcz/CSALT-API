const { response } = require('express')
const express = require('express')
const router = express.Router()
const userTemplate = require('../models/UserModels')

//this router will take care of users signing up for the app
router.post('/Register', (request, response) => {
    // check for required fields before you save and return error if data missing
    const { fullName, email, password } = request.body
    console.log(`${fullName} ${email} ${password}`)
    
    if(fullName && email && password) {
        const registeredUser = new userTemplate({
            fullName,
            email,
            password,
        })
        registeredUser.save()
        .then(data =>{
            response.json(data)
        })
        .catch(error =>{
            response.json(error)
        })
    } else {
        response.json({
            response: 200,
            msgCode: -1,
            reason: 'missing required field'
        })
    }
})

router.post('/Login', (request, response) => {
    const { email, password } = request.body;

    if (email && password) {
        userTemplate.findOne({ 'email': email }, (err, user) => {
            if (err) {
                response.json({
                    response:  200,
                    msgCode: -1,
                    reason: `error while searching for record ${email}`
                })
            }
            response.json(user);
        })
    } else {
        response.json({
            response: 200,
            msgCode: -1,
            reason: 'missing required field'
        })
    }
}
)

module.exports = router