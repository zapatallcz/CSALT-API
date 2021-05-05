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

  const factors = await FactorResponse.find({ userId: user._id });

  response.json({
    token,
    user,
    factors,
  });
});

router.post("/FactorResponse", async (request, response) => {
  const filter = {
    userId: request.body.userId,
    factor: request.body.factor,
  };
  // this option instructs the method to create a document if no documents match the filter
  const options = { upsert: true };
  // create a document that sets the value to the update value
  const updateDoc = {
    $set: {
      value: parseInt(request.body.value),
    },
  };
  const result = await FactorResponse.updateOne(filter, updateDoc, options);
  console.log(
    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
  );

  if (!result) {
    response.json("error found");
    return;
  }
  response.json(result);
});

router.get("/admin", async (request, response) => {
  const pipeline = [
    {
      $group: {
        _id: "$factor",
        value: { $sum: "$value" },
      },
    },
  ];

  let factor = await FactorResponse.aggregate(pipeline);

  response.json(factor);
});

router.post("/resources", async (request, response) => {
  const factors = await FactorResponse.find({
    userId: request.body.userId,
    value: { $lte: 3 },
  });
  response.json(factors);
});

module.exports = router;
