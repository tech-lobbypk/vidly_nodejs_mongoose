const joi = require("joi");
const { mongoose } = require("mongoose");

// Defining requirements to match: we need the id with values between 1 to 1000 and its required field
// Title should have minimum 3 characters and maximum 10 chracters. It should be a required field with string value
const genreSchema = joi.object({
  _id: String,
  title: joi.string().min(3).max(10).required(),
});

// Definign schema for the mongoDB document
// title should be string and is required
const genreDBSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { strict: false }
);
// Method for validating a given Genre object.
const validateGenreSchema = async (updatedGenre, callback) => {
  const result = await genreSchema.validate(updatedGenre);
  callback(result.error);
};

module.exports.genreScheme = genreSchema;
module.exports.genreDBSchema = genreDBSchema;
module.exports.validateGenreSchema = validateGenreSchema;
