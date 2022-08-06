const mongoose = require("mongoose");
const config = require("config");
module.exports = async function () {
  //await mongoose.connect(config.get("dbConfig"), {
  await mongoose.connect(config.get("dbConfig"), {
    useUnifiedTopology: true,
  });
  console.log("Successfully connected to the mongoDB..");
};
