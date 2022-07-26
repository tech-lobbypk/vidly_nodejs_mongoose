const mongoose = require("mongoose");
const config = require("config");
module.exports = async function () {
  await mongoose.connect(config.get("dbConfig"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Successfully connected to the mongoDB..");
};

/*(callback) => {
  mongoose.connect("mongodb://localhost:27017/vidly", (err) => {
    if (err) {
      callback(err);
    }
    initializeDatabase((err) => {
      if (err) {
        callback(err);
      }
      console.log("Successfully initialized database to 3 documents");
      callback();
    });
  });

const mongoDBHandler = require("../mongoDB/mongoDBHandler");
mongoDBHandler.connect((err) => {
  if (err) {
    console.log("Database Error: " + err);
  }
});*/
