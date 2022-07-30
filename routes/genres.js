const express = require("express");
const router = express.Router();

const admin = require("../middlewares/admin");

const routeHandler = require("../middlewares/routeHandler");
const authMiddleware = require("../middlewares/authentication");

const mongoDBHandler = require("../mongoDB/mongoDBHandler");
const joi = require("joi");
const { mongo } = require("mongoose");

const errorGenerator = require("../utility/errorGenerator");

// Defining requirements to match: we need the id with values between 1 to 1000 and its required field
// Title should have minimum 3 characters and maximum 10 chracters. It should be a required field with string value
const schema = joi.object({
  _id: String,
  title: joi.string().min(3).max(10).required(),
});

// Method for validating a given Genre object.
const validateSchema = async (updatedGenre, callback) => {
  const result = await schema.validate(updatedGenre);
  callback(result.error);
};

// endpoint for getting all current Genres
router.get("/", (req, res, next) => {
  console.log("/all");
  mongoDBHandler.findAll(req.params, (result, exception) => {
    return result
      ? res.send(result)
      : next(errorGenerator(exception, 500, "Internal error"));
  });
});

// Endpoint for getting a specific Genre
router.get("/genres/:id", (req, res, next) => {
  console.log("Inside get/:id00000----");
  if (!req.params.id) res.send("Specify the id of the required document ");
  else {
    mongoDBHandler.findOne({ _id: req.params.id }, (result, exception) => {
      return result
        ? res.send(result)
        : next(errorGenerator(exception, 500, "Internal error"));
    });
  }
});

// Endpoint for adding a new genre after validating it against the scheme defined above
// Only the authentic users should be able to add a new genre
// authMiddlware checks the authorization
router.post("/genres/add", authMiddleware, (req, res, next) => {
  console.log("/add endpoint called");
  validateSchema(req.body, (err) => {
    if (err) {
      next(errorGenerator(err, 500, "Invalid Object definition: "));
    } else {
      mongoDBHandler.saveOne(req.body, (result, exception) => {
        return result
          ? res.send(result)
          : next(errorGenerator(exception, 500, "Internal error"));
      });
    }
  });
});

// Endpoint for updating an existing Genre against the given id. The updated values are found in the body of the request object
// Only the authentic users should be able to update a genre
router.put("/genres/update", authMiddleware, (req, res, next) => {
  console.log("/put endpoint called");
  validateSchema(req.body, (err) => {
    if (err) {
      next(errorGenerator(err, 500, "Invalid Object definition: "));
    } else {
      mongoDBHandler.updateOne(req.body, (result, exception) => {
        console.log(result);
        return result
          ? res.send(result)
          : next(errorGenerator(exception, 500, "Internal error"));
      });
    }
  });
});

//Endpoint for deleting a genre against the given id
// Only the authorized Admins should be able to delete the genre
// authMiddleware and admin are making sure the authorizationa and authentication
router.delete("/genres/delete", [authMiddleware, admin], (req, res, next) => {
  console.log("/delete endpoint called");
  if (!req.body._id) next(errorGenerator(err, 500, "_id cannot be undefined"));
  else
    mongoDBHandler.deleteOne(req.body, (result, exception) => {
      return result
        ? res.send(result)
        : next(errorGenerator(exception, 500, "Internal error"));
    });
});

module.exports = router;
