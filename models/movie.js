const mongoose = require("mongoose");
const joi = require("joi");
const { genreDBSchema } = require("../models/genre");

// Movie schema for mongoDB documents
const movieDBSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLenght: 5,
    maxLength: 50,
    unique: true,
  },
  dailyRent: {
    type: Number,
    required: true,
    min: 0,
    max: 50,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  genre: {
    type: genreDBSchema,
    required: true,
  },
});

// Movie schema for Joi to validate the user input
const movieSchema = joi.object({
  _id: joi.string(),
  name: joi.string().min(3).max(50).required(),
  dailyRent: joi.number().min(0).max(50).required(),
  stock: joi.number().min(0).max(100).required(),
  _id_genre: joi.string().required(),
});

const validateMovieSchema = (movieObj) => {
  return movieSchema.validate(movieObj);
};

module.exports = { movieDBSchema, validateMovieSchema };
