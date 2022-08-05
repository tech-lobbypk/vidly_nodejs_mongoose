const mongoose = require("mongoose");
mongoose.set("debug", true);
const { movieDBSchema } = require("../models/movie");
const { genreDBSchema } = require("../models/genre");

const Movie = mongoose.model("Movie", movieDBSchema);

// Method to save one genre
const saveOne = async (obj, callback) => {
  console.log("Inside Movie saveOne: " + obj._id);
  const newMovie = new Movie({
    name: obj.name,
    dailyRent: obj.dailyRent,
    stock: obj.stock,
    genre: obj.genre,
  });
  try {
    const result = await newMovie.save();
    callback(result);
  } catch (ex) {
    callback(undefined, ex);
  }
};

// Method to search one genre against the given id
const findOne = async (obj, callback) => {
  console.log("Inside movie findOne: " + obj._id);
  try {
    const result = await Movie.findById({ _id: obj._id });
    callback(result);
  } catch (ex) {
    callback(undefined, ex);
  }
};

const findProjection = (obj, projection) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Movie.findById({ _id: obj._id }, projection);
      resolve(result);
    } catch (ex) {
      reject(ex);
    }
  });
};

// Method to retrive all records from the database
const findAll = async (callback) => {
  console.log("Inside Movie findAll: ");
  try {
    const result = await Movie.find().sort({ _id: 1 });
    callback(result, null);
  } catch (ex) {
    callback(undefined, ex);
  }
};

// Method to update one record against the give _id
// using $set operator
const updateOne = async (obj, callback) => {
  console.log("Inside Movie updateOne: ");
  console.log(obj);
  try {
    const updatedObj = await Movie.findOneAndUpdate(
      { _id: obj._id },
      {
        $set: {
          _id: obj._id,
          name: obj.name,
          dailyRent: obj.dailyRent,
          stock: obj.stock,
          genre: obj.genre,
        },
      },
      { upsert: true, strict: false, new: true } // returns the updated object
    );
    console.log(updatedObj);
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
    const result = await Movie.findByIdAndRemove({ _id: obj._id });
    callback(result);
  } catch (ex) {
    callback(undefined, ex);
  }
};

module.exports = {
  saveOne,
  updateOne,
  deleteOne,
  findOne,
  findAll,
  findProjection,
};
