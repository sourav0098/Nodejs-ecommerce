const { default: mongoose } = require("mongoose");

// Connect to MongoDB
const dbConnect = () => {
  const uri = process.env.MONGO_URI;
  const db = process.env.MONGO_DB;

  mongoose
    .connect(uri, {
      // dbName: db,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connection successful");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB", error);
    });
};

module.exports = dbConnect;
