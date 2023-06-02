const mongoose = require("mongoose");

// Function to validate id
const validateId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("Invalid Id or not found");
};

module.exports = validateId;