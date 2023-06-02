const generateToken = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateId = require("../utils/validateId");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

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
    const refreshToken = await generateRefreshToken(findUser._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      _id: findUser._id,
      fname: findUser.fname,
      lname: findUser.lname,
      email: findUser.email,
      mobile: findUser.mobile,
      role: findUser.role,
      isBlocked: findUser.isBlocked,
      accessToken: generateToken(findUser?._id),
    });
  } else {
    return res.status(401).json({ errors: ["Invalid email or password"] });
  }
});

// handle refresh token
const handleRefreshToken = async (req, res) => {
  try {
    // Get the refresh token from the request cookies
    const refreshToken = req?.cookies?.refreshToken;
    if (!refreshToken) {
      throw new Error("No refresh token in cookies");
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Find the user based on the decoded ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ errors: ["User not found"] });
    }

    // Generate a new access token for the user
    const accessToken = generateToken(user._id);

    // Send the new access token in the response
    res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    // Handle any errors that occurred during the token verification
    return res
      .status(401)
      .json({ errors: ["Invalid or expired refresh token"] });
  }
};

// logout user
const logout = asyncHandler(async (req, res) => {
  // Clear the refresh token cookie
  res.clearCookie("refreshToken",{
    httpOnly: true,
    secure: true
  });

  res.status(200).json({ message: "Logout successful" });
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const sortDir = req.query.sortDir || "asc";

  try {
    const totalUsers = await User.countDocuments(); // Get the total number of users

    const totalPages = Math.ceil(totalUsers / pageSize); // Calculate the total number of pages
    const lastPage = Math.max(totalPages, 1); // Determine the last page (minimum of 1)

    const users = await User.find()
      .sort({ [sortBy]: sortDir }) // Sort the users based on the provided sortBy and sortDir parameters
      .skip(page * pageSize) // Skip the appropriate number of documents based on the page and pageSize
      .limit(pageSize); // Limit the number of documents per page

    res.status(200).json({
      users,
      page,
      pageSize,
      totalPages,
      lastPage,
      totalUsers,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get single user
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Validate id if it is a valid ObjectId
  validateId(id);
  try {
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.sendStatus(404).json({ message: "User not found" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// update user
const updateUser = asyncHandler(async (req, res) => {
  // Get id of the user from the token
  const { _id } = req.user;

  // Validate id if it is a valid ObjectId
  validateId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        fname: req.body?.fname,
        lname: req.body?.lname,
        mobile: req.body?.mobile,
      },
      {
        new: true,
      }
    );

    if (updateUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(200).json({ message: "No user found" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Validate id if it is a valid ObjectId
  validateId(id);

  try {
    const blockedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );

    if (blockedUser) {
      res.status(200).json({ message: "User blocked" });
    } else {
      res.status(404).json({ message: "No user found" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Ublock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const unblockedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    if (unblockedUser) {
      res.status(200).json({ message: "User unblocked" });
    } else {
      res.status(404).json({ message: "No user found" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  handleRefreshToken,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  blockUser,
  unblockUser,
};
