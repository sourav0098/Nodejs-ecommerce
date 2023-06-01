const { exist } = require("joi");
const generateToken = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Register a new user
const createUser = asyncHandler(async (req, res) => {
  const { email, mobile } = req.body;
  const errors = [];

  // Check if email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    errors.push("Email is already registered");
  }

  // Check if mobile number already exists
  const existingMobile = await User.findOne({ mobile });
  if (existingMobile) {
    errors.push("Mobile number is already registered");
  }

  // Return error if email or mobile number already exists
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Create new user
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if user exists for email
  const findUser = await User.findOne({ email: email });

  // check if password matches and user is found
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.status(200).json({
      _id: findUser._id,
      fname: findUser.fname,
      lname: findUser.lname,
      email: findUser.email,
      mobile: findUser.mobile,
      accessToken: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

module.exports = { createUser, loginUser };
