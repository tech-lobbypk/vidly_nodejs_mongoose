const mongoose = require("mongoose");
mongoose.set("debug", true);

// Definign schema for the mongoDB document
// title should be string and is required
const genreSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { strict: false }
);

const Genre = mongoose.model("Genre", genreSchema);

//The following method initializes the database to 3 documents
const initializeDatabase = async (callback) => {
  console.log("inside initializeDatabase");
  try {
    const horror = new Genre({ title: "Horror" });
    await horror.save();
    const action = new Genre({ title: "action" });
    await action.save();
    const comedy = new Genre({ title: "Comedy" });
    await comedy.save();
  } catch (ex) {
    callback(undefined, ex);
  }
};

//initializeDatabase();

// Method to save one genre
const saveOne = async (obj, callback) => {
  console.log("Inside saveOne: " + obj._id);
  const newGenre = new Genre({ title: obj.title });
  try {
    const result = await newGenre.save();
    callback(result);
  } catch (ex) {
    callback(undefined, ex);
  }
};

// Method to search one genre against the given id
const findOne = async (obj, callback) => {
  console.log("Inside findOne: " + obj._id);
  try {
    const result = await Genre.findById({ _id: obj._id });
    callback(result);
  } catch (ex) {
    callback(undefined, ex);
  }
};

// Method to retrive all records from the database
const findAll = async (obj, callback) => {
  console.log("Inside findAll: ");
  try {
    const result = await Genre.find().sort({ _id: 1 });
    callback(result, null);
  } catch (ex) {
    callback(undefined, ex);
  }
};

// Method to update one record against the give _id
// using $set operator
const updateOne = async (obj, callback) => {
  console.log("updateOne: ");
  console.log(obj);
  try {
    const updatedObj = await Genre.findOneAndUpdate(
      { _id: obj._id },
      {
        $set: { _id: obj._id, title: obj.title },
      },
      { upsert: true, strict: false, new: true } // returns the updated object
    );
    console.log(updatedObj);
    console.log("0990090909090909");
    callback(updatedObj);
  } catch (ex) {
    console.log(ex);
    callback(undefined, ex);
  }
};

// Method to delete a record against the given _id
const deleteOne = async (obj, callback) => {
  console.log("deleteOne: " + obj._id);
  try {
    const result = await Genre.findByIdAndRemove({ _id: obj._id });
    callback(result);
  } catch (ex) {
    callback(undefined, ex);
  }
};

module.exports = { saveOne, updateOne, deleteOne, findOne, findAll };
