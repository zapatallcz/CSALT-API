const express = require("express");
const router = express.Router();
const registerUserTemplateCopy = require("../models/RegisterUserModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { request, response } = require("express");
const FactorResponse = require("../models/FactorResponseModel");
const { model } = require("mongoose");

//this router will take care of users signing up for the app
router.post("/Register", async (request, response) => {
  //checking if the user is already in the database
  const emailExist = await registerUserTemplateCopy.findOne({
    email: request.body.email,
  });
  if (emailExist)
    return response
      .status(400)
      .send({ success: false, message: "Email already exists" });

  //Hash Passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(request.body.password, salt);

  //Create a new user
  const registeredUser = new registerUserTemplateCopy({
    fullName: request.body.fullName,
    email: request.body.email,
    password: hashedPassword,
    livesOnCampus: request.body.livesOnCampus,
  });
  registeredUser
    .save()
    .then((data) => {
      const token = jwt.sign({ _id: data._id }, process.env.TOKEN_SECRET);
      const user = data.toObject();
      delete user.password;
      response.json({
        token,
        user,
      });
    })
    .catch((error) => {
      response.json(error);
    });
});

router.post("/Login", async (request, response) => {
  //Checking if the email already exists
  let user = await registerUserTemplateCopy.findOne({
    email: request.body.email,
  });
  if (!user)
    return response
      .status(400)
      .json({ message: "Email/password is incorrect" });

  //Checking if password is correct
  const validPass = await bcrypt.compare(request.body.password, user.password);
  if (!validPass)
    return response
      .status(400)
      .json({ message: "Email/password is incorrect" });

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  user = user.toObject();
  delete user.password;
  response.json({
    token,
    user,
  });
});

router.post("/FactorResponse", async (request, response) => {
  const factorResponse = new FactorResponse({
    userId: request.body.userId,
    factor: request.body.factor,
    value: parseInt(request.body.value),
  });
  factorResponse
    .save()
    .then((data) => {
      console.log("works", data);
      response.json({
        success: true,
      });
    })
    .catch((error) => {
      console.error("error", error);
      response.json(error);
    });
});

router.get("/admin", async (request, response) => {
  const pipeline = [
    {
      $group: {
        _id: "$factor",
        value: { $sum: "$value" },
      },
    //   $match: {
    //       value: {$lte: 3}
    //   }
    },
  ];

  let factor = await FactorResponse.aggregate(pipeline);
  //  .then((result)=> {
  //      console.log(result)
  //  }).catch((err)=> {
  //      console.log(err)
  //  });
  // if(!factor) return response.status(400).json({message: 'no factors found'});

  // const factorResponseAggregation = FactorResponseModel.aggregate([
  //     { $group: {
  //         _id: '$factor',
  //         value: {$sum: '$value'}
  //     } },
  //   ]);

  //   FactorResponseModel.
  //     aggregate([{ $match: { value: { $lte: 3 }}}]).
  //     unwind('tags').
  //     exec(callback);

  // factor = factor.toObject()
  response.json(factor);
});

module.exports = router;
