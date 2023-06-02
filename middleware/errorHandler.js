// not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`); // Create a new error object with a message indicating the route was not found
  res.status(404); // Set the HTTP status code to 404 (Not Found)
  next(error); // Pass the error to the next middleware
};

const errorHandler = (err, req, res, next) => {
  const statusCode = 500; // Use a default status code for errors

  if (process.env.NODE_ENV === "development") {
    // Provide more detailed error information in development mode
    res.json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    // In production mode, provide only error message without exposing sensitive information
    res.json({ message: err.message });
  }
};

module.exports = { notFound, errorHandler };
