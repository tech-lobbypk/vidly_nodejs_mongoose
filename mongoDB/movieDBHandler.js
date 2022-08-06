const mongoose = require("mongoose");
mongoose.set("debug", true);
const { movieDBSchema } = require("../models/movie");
const { genreDBSchema } = require("../models/genre");

const Movie = mongoose.model("Movie", movieDBSchema);

// Method to save one genre
const saveOne = async (obj) => {
  console.log("Inside Movie saveOne: ");
  const newMovie = new Movie({
    name: obj.name,
    dailyRent: obj.dailyRent,
    stock: obj.stock,
    genre: obj.genre,
  });
  return new Promise(async (resolve, reject) => {
    try {
      const result = await newMovie.save();
      resolve(result);
    } catch (ex) {
      reject(ex);
    }
  });
};

// Method to search one genre against the given id
const findOne = (obj) => {
  console.log("Inside movie findOne: " + obj._id);
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Movie.findById({ _id: obj._id });
      resolve(result);
    } catch (ex) {
      reject(ex);
    }
  });
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
const findAll = async () => {
  console.log("Inside Movie findAll: ");
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Movie.find().sort({ _id: 1 });
      resolve(result, null);
    } catch (ex) {
      reject(ex);
    }
  });
};

// Method to update one record against the give _id
// using $set operator
const updateOne = (obj) => {
  console.log("Inside Movie updateOne: ");
  return new Promise(async (resolve, reject) => {
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
      resolve(updatedObj);
    } catch (ex) {
      console.log(ex);
      reject(undefined, ex);
    }
  });
};

// Method to delete a record against the given _id
const deleteOne = async (obj, callback) => {
  console.log("deleteOne: " + obj._id);
  return new Promise(async (resolve, rejection) => {
    try {
      const result = await Movie.findByIdAndRemove({ _id: obj._id });
      resolve(result);
    } catch (ex) {
      rejection(undefined, ex);
    }
  });
};

module.exports = {
  saveOne,
  updateOne,
  deleteOne,
  findOne,
  findAll,
  findProjection,
};
