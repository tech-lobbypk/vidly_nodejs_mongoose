const mongoose = require("mongoose");
mongoose.set("debug", true);

const { genreDBSchema } = require("../models/genre");

const Genre = mongoose.model("Genre", genreDBSchema);

//return new Promise(async (resolve,reject)=>{})
// Method to save one genre
const saveOne = async (obj, callback) => {
  console.log("Inside saveOne: " + obj._id);
  return new Promise(async (resolve, reject) => {
    const newGenre = new Genre({ title: obj.title });
    try {
      const result = await newGenre.save();
      resolve(result);
    } catch (ex) {
      reject(ex);
    }
  });
};

// Method to search one genre against the given id
const findOne = async (obj, callback) => {
  return new Promise(async (resolve, reject) => {
    console.log("Inside findOne: " + obj._id);
    try {
      const result = await Genre.findById({ _id: obj._id });
      resolve(result);
    } catch (ex) {
      reject(ex);
    }
  });
};

// Method to retrive all records from the database
const findAll = async (callback) => {
  console.log("Inside findAll: ");
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Genre.find().sort({ _id: 1 });
      resolve(result, null);
    } catch (ex) {
      reject(ex);
    }
  });
};

// Method to update one record against the give _id
// using $set operator
const updateOne = async (obj, callback) => {
  console.log("Inside updateOne: ");
  return new Promise(async (resolve, reject) => {
    try {
      const updatedObj = await Genre.findOneAndUpdate(
        { _id: obj._id },
        {
          $set: { _id: obj._id, title: obj.title },
        },
        { upsert: false, strict: false, new: true } // returns the updated object
      );
      console.log(updatedObj);
      resolve(updatedObj);
    } catch (ex) {
      console.log(ex);
      reject(ex);
    }
  });
};

// Method to delete a record against the given _id
const deleteOne = async (obj, callback) => {
  console.log("deleteOne: " + obj._id);
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Genre.findByIdAndRemove({ _id: obj._id });
      resolve(result);
    } catch (ex) {
      reject(ex);
    }
  });
};

module.exports = { saveOne, updateOne, deleteOne, findOne, findAll };
