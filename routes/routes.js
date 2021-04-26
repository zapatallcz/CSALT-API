const express = require('express')
const router = express.Router()
const registerUserTemplateCopy = require('../models/RegisterUserModels')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { request } = require('express');

//this router will take care of users signing up for the app
router.post('/Register', async (request, response) => {

    //checking if the user is already in the database
    const emailExist = await registerUserTemplateCopy.findOne({email: request.body.email});
    if(emailExist) return response.status(400).send({success: false, message: 'Email already exists'});


    //Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(request.body.password, salt);


    //Create a new user
    const registeredUser = new registerUserTemplateCopy({
        fullName:request.body.fullName,
        email:request.body.email,
        password:hashedPassword,
        livesOnCampus:request.body.livesOnCampus
    })
    registeredUser.save()
    .then(data =>{
        const token = jwt.sign({_id: data._id}, process.env.TOKEN_SECRET);
        delete data.password
        response.json({
            token,
            user: data
        })
    })
    .catch(error =>{
        response.json(error)
    })
});

router.post('/Login', async (request, response) => {
    //Checking if the email already exists
    const user = await registerUserTemplateCopy.findOne({email: request.body.email});
    if(!user) return response.status(400).send('Email is not found');

    //Checking if password is correct
    const validPass = await bcrypt.compare(request.body.password, user.password)
    if(!validPass) return response.status(400).send('Invalid password')

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    response.header('auth-token', token).send(token);

    response.send('Logged in!');
});

module.exports = router