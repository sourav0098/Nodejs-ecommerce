const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
} = require("../controllers/userController");
const validateUser = require("../middleware/validateUser");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", validateUser, createUser);
router.post("/login", loginUser);
router.post("/refresh", handleRefreshToken);
router.post("/logout", logout);

router.get("/users", authMiddleware, getAllUsers);
router.get("/user/:id", authMiddleware, isAdmin, getUserById);
router.put("/user/edit", authMiddleware, updateUser);
router.put("/user/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/user/unblock/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
