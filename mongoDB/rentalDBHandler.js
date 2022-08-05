const { object } = require("joi");
const mongoose = require("mongoose");
mongoose.set("debug", true);

const { rentalDBSchema } = require("../models/rental");
const Rental = mongoose.model("Rental", rentalDBSchema);

const saveOne = (rentalObj) => {
  return new Promise(async (resolve, reject) => {
    const newRental = new Rental({
      movie: rentalObj.movie,
      user: rentalObj.user,
      returnDate: rentalObj.returnDate,
    });
    try {
      const newObj = await newRental.save();
      resolve(newObj);
    } catch (ex) {
      reject(ex);
    }
  });
};

const findAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Rental.find().sort({ returnDate: -1 });
      resolve(result);
    } catch (exception) {
      reject(exception);
    }
  });
};

module.exports = { saveOne, findAll };
