// not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`); // Create a new error object with a message indicating the route was not found
  res.status(404); // Set the HTTP status code to 404 (Not Found)
  next(error); // Pass the error to the next middleware
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // If the response status code is 200 (OK), set the status code to 500 (Internal Server Error), otherwise use the existing status code
  res.status(statusCode); // Set the HTTP status code to the determined status code
  res.json({
    message: err?.message,
    stack: err?.stack,
  });
};

module.exports = { notFound, errorHandler };
