const mongoose = require("mongoose");
const joi = require("joi");

// Rental schema for mongoDB documents
const rentalDBSchema = new mongoose.Schema({
  user: {
    _id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      minLenght: 5,
      maxLength: 10,
    },
    phone: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 20,
    },
  },
  movie: {
    name: {
      type: String,
      required: true,
      minLenght: 5,
      maxLength: 50,
    },
    dailyRent: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },
  },
  rentStartDate: { type: Date, default: Date.now },
  returnDate: { type: Date, required: true },
});

// Rental schema for Joi to validate the user input
const rentalSchema = joi.object({
  _id_movie: joi.string().required(),
  _id_user: joi.string().required(),
});

const validateRentalSchema = (rentalObj) => {
  return rentalSchema.validate(rentalObj);
};

module.exports = { rentalDBSchema, validateRentalSchema };
