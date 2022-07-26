const mongoose = require("mongoose");
const config = require("config");
module.exports = async function () {
  //await mongoose.connect(config.get("dbConfig"), {
  await mongoose.connect(
    "mongodb+srv://dbadmin:12345@cluster0.jbhnw.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("Successfully connected to the mongoDB..");
};
