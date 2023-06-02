const productSchema = require("../schema/productSchema");

const validateProduct = (req, res, next) => {
    const { error, value } = productSchema.validate(req.body, {
      abortEarly: false,
    });
  
    if (error) {
      // Extract the error messages from the validation error object
      const errorMessages = error.details.map((detail) => detail.message);
  
      // Return an error response with the array of error messages
      return res.status(400).json({ errors: errorMessages });
    }
  
    // If the validation is successful, move to the next middleware or route handler
    next();
  };
  
  module.exports = validateProduct;
  