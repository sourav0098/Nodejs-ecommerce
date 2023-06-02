const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req?.headers?.authorization &&
    req?.headers?.authorization?.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized, token expired please login again");
    }
  } else {
    throw new Error("Not authorized, no token attached in header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const adminUser = await User.findById(_id);
  if (adminUser?.role !== "admin") {
    throw new Error("Not authorized, only admin can access this route");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
