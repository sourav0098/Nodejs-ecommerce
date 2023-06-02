const express = require("express");
const {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const validateProduct = require("../middleware/validateProduct");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");

router.get("/:id", getProductById);
router.get("/", getAllProducts);
router.post("/", authMiddleware, isAdmin, validateProduct, createProduct);
router.put("/:id", authMiddleware, isAdmin, validateProduct, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
