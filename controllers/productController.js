const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const validateId = require("../utils/validateId");
const { query } = require("express");

// Get product by id
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const product = await Product.findById(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  // Retrieve query parameters
  const page = parseInt(req.query.page) || 0;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const sortDir = req.query.sortDir || "asc";

  // Create filter object
  const filter = {};

  // Apply price range filter if priceMin and priceMax are provided
  if (req.query.priceMin && req.query.priceMax) {
    filter.unitPrice = {
      $gte: parseFloat(req.query.priceMin),
      $lte: parseFloat(req.query.priceMax),
    };
  }

  // Apply brand filter if brand is provided
  if (req.query.brand) {
    filter.brand = req.query.brand;
  }

  // Apply color filter if color is provided
  if (req.query.color) {
    filter.color = req.query.color;
  }

  try {
    // Count the total number of products with the applied filter
    const countQuery = Product.find(filter).countDocuments();
    const totalElements = await countQuery;

    const totalPages = Math.ceil(totalElements / pageSize);
    const lastPage = Math.max(totalPages, 1);

    let productsQuery = Product.find(filter);

    // Apply field limiting if fields parameter is provided
    const fields = req.query.fields;
    if (fields) {
      const fieldList = fields.split(",").join(" "); // Convert comma-separated fields to space-separated
      productsQuery = productsQuery.select(fieldList);
    } else {
      productsQuery = productsQuery.select("-__v"); // Exclude the __v field by default
    }

    // Sort, skip, and limit the products based on pagination parameters
    productsQuery = productsQuery
      .sort({ [sortBy]: sortDir })
      .skip(page * pageSize)
      .limit(pageSize);

    const products = await productsQuery;

    res.status(200).json({
      products,
      page,
      pageSize,
      totalPages,
      lastPage,
      totalElements,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Create a product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedProduct) {
      return res.status(200).json(updatedProduct);
    } else {
      return res.sendStatus(204);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      return res.status(200).json({ message: "Product deleted successfully" });
    } else {
      return res.sendStatus(204);
    }
  } catch (error) {}
});

module.exports = {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
