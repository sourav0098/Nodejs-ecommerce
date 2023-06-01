const express = require("express");
const { createUser, loginUser } = require("../controllers/userController");
const validateUser = require("../middleware/validateUser");
const router = express.Router();

router.post("/register", validateUser, createUser);
router.post("/login", loginUser);

module.exports = router;
