const express = require("express");
const router = express.Router();

const _ = require("lodash");
const errorGenerator = require("../utility/errorGenerator");

const { rentalDBSchema, validateRentalSchema } = require("../models/rental");
const movieDBHandler = require("../mongoDB/movieDBHandler");
const rentalDBHandler = require("../mongoDB/rentalDBHandler");
const { User } = require("../models/user");

router.post("/rentOut", async (req, res, next) => {
  // extract information for user
  // extract information for movie
  // save rent date as today
  // Calculate return date based on 15 days from now
  // save data
  const result = validateRentalSchema(req.body);
  if (result.error) {
    console.log("joi validation failed");
    return next(
      errorGenerator(result.error, 400, result.error.details[0].message)
    );
  } else {
    extractMovie(req.body._id_movie, next).then((movieObj) => {
      console.log("movie extracted" + movieObj);
      extractUser(req.body._id_user, next).then((userObj) => {
        saveRental(movieObj, userObj, res, next);
      });
    });
    //rentalDBHandler.saveOne({user:userObj,movie:movieObj,returnDate:new Date()+15}).then().catch()
  }
});

router.get("/", async (req, res, next) => {
  rentalDBHandler
    .findAll()
    .then((rentals) => {
      console.log(rentals);
      const rentals_picked = _.map(
        rentals,
        _.partialRight(_.pick, [
          "_id",
          "user",
          "movie",
          "returnDate",
          "rentStartDate",
        ])
      );
      res.send(rentals_picked);
    })
    .catch((exception) => {
      return next(errorGenerator(exception, 500, "Could not fetch rentals"));
    });
});

const saveRental = async (movieObj, userObj, res, next) => {
  console.log("user extracted" + userObj);
  const rDate = new Date();
  // return date should be 15 days from today
  rDate.setDate(rDate.getDate() + 15);
  rentalDBHandler
    .saveOne({
      user: userObj,
      movie: movieObj,
      returnDate: rDate,
    })
    .then((rentalObj) => {
      console.log("Rental saved");
      res.send(rentalObj);
    })
    .catch((exception) => {
      console.log("exception in saving" + exception);
      return next(errorGenerator(exception, 500, "Could not save rental"));
    });
};

const extractMovie = async (movieID, next) => {
  return new Promise((resolve, reject) => {
    movieDBHandler
      .findProjection({ _id: movieID }, { _id: 1, name: 1, dailyRent: 1 })
      .then((movieObj) => {
        console.log("Movie ....");
        console.log(movieObj);
        resolve(movieObj);
      })
      .catch((exception) => {
        return next(
          errorGenerator(
            exception,
            400,
            "Cannot fetch movie against the provided _id"
          )
        );
      });
  });
};

const extractUser = (userID, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await User.findById(
        { _id: userID },
        { username: 1, phone: 1 }
      );
      resolve(result);
    } catch (exception) {
      return next(
        errorGenerator(
          exception,
          400,
          "Cannot fetch user against the provided _id"
        )
      );
    }
  });
};

module.exports.rentalRouter = router;
