const Joi = require("joi");

const reviewSchema = Joi.object({
  rating: Joi.number().required().min(0).max(5).messages({
    "number.base": `Please provide a valid rating`,
    "number.empty": `Please provide a rating`,
    "number.min": `Rating must be greater than 0`,
    "number.max": `Rating must be less than 5`,
    "any.required": `Please provide a rating`,
  }),
  review: Joi.string().required().messages({
    "string.base": `Please provide a valid review`,
    "string.empty": `Please provide a review`,
    "any.required": `Please provide a review`,
  }),
  postedBy: Joi.string().required().messages({
    "string.base": `Please provide a valid user id`,
    "string.empty": `Please provide a user id`,
    "any.required": `Please provide a user id`,
  }),
});

const productSchema = Joi.object({
  brand: Joi.string().required().messages({
    "string.base": `Please provide a valid brand name`,
    "string.empty": `Please provide a brand name`,
    "any.required": `Please provide a brand name`,
  }),
  title: Joi.string().required().messages({
    "string.base": `Please provide a valid product title`,
    "string.empty": `Please provide a product title`,
    "any.required": `Please provide a product title`,
  }),
  description: Joi.string().min(10).required().messages({
    "string.base": `Please provide a valid description`,
    "string.empty": `Please provide a description`,
    "string.min": `Description must be atleast 10 characters long`,
    "any.required": `Please provide a description`,
  }),
  unitPrice: Joi.number().required().min(0).messages({
    "number.base": `Please provide a valid unit price`,
    "number.empty": `Please provide a unit price`,
    "number.min": `Unit price must be greater than 0`,
    "any.required": `Please provide a unit price`,
  }),
  discountPrice: Joi.number().min(0).messages({
    "number.base": `Please provide a valid discount price`,
    "number.empty": `Please provide a discount price`,
    "number.min": `Discount price must be greater than 0`,
  }),
  color: Joi.string().messages({
    "string.base": `Please provide a valid color`,
    "string.empty": `Please provide a color`,
  }),
  quantity: Joi.number().required().min(0).messages({
    "number.base": `Please provide a valid quantity`,
    "number.empty": `Please provide a quantity`,
    "number.min": `Quantity must be greater than 0`,
    "any.required": `Please provide a quantity`,
  }),
  live: Joi.boolean().messages({
    "boolean.base": `Please provide a valid live status`,
    "boolean.empty": `Please provide a live status`,
  }),
  reviews: Joi.array().items(reviewSchema),
});

module.exports = productSchema;
