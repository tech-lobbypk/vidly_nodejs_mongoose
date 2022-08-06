const express = require("express");
const router = express.Router();

const _ = require("lodash");

const admin = require("../middlewares/admin");
const authMiddleware = require("../middlewares/authentication");

const routeHandler = require("../middlewares/routeHandler");

const genreDBHandler = require("../mongoDB/genreDBHandler");

const errorGenerator = require("../utility/errorGenerator");

const { validateGenreSchema } = require("../models/genre");

// endpoint for getting all current Genres
router.get("/", (req, res, next) => {
  console.log("Inside /all");
  genreDBHandler
    .findAll()
    .then((result) => {
      return res.send(_.map(result, _.partialRight(_.pick, ["_id", "title"])));
    })
    .catch((exception) => {
      return next(errorGenerator(exception, 500, "Internal error"));
    });
});

// Endpoint for getting a specific Genre
router.get("/genres/:id", (req, res, next) => {
  console.log("Genres /get endpoint called");
  if (!req.params.id) res.send("Specify the id of the required document ");
  else {
    genreDBHandler
      .findOne({ _id: req.params.id })
      .then((result) => {
        return res.send(_.pick(result, ["_id", "title"]));
      })
      .catch((exception) => {
        return next(errorGenerator(exception, 500, "Internal error"));
      });
  }
});

// Endpoint for adding a new genre after validating it against the scheme defined above
// Only the authentic users should be able to add a new genre
// authMiddlware checks the authorization
router.post("/genres/add", authMiddleware, (req, res, next) => {
  console.log("/add endpoint called");
  validateGenreSchema(req.body, (err) => {
    if (err) {
      next(errorGenerator(err, 500, "Invalid Object definition: "));
    } else {
      genreDBHandler
        .saveOne(req.body)
        .then((newObj) => {
          return res.send(_.pick(newObj, ["_id", "title"]));
        })
        .catch((exception) => {
          next(errorGenerator(exception, 500, "Internal error"));
        });
    }
  });
});

// Endpoint for updating an existing Genre against the given id. The updated values are found in the body of the request object
// Only the authentic users should be able to update a genre
router.put("/genres/update", authMiddleware, (req, res, next) => {
  console.log("/put endpoint called");
  console.log(req.body);
  validateGenreSchema(req.body, (err) => {
    if (err) {
      return next(errorGenerator(err, 400, "Invalid Object definition: "));
    } else {
      console.log(req.body);
      genreDBHandler
        .updateOne(req.body)
        .then((updatedObj) => {
          return !updatedObj
            ? next(errorGenerator(err, 400, "Provide valid _id"))
            : res.send(_.pick(updatedObj, ["_id", "title"]));
        })
        .catch((exception) => {
          return next(
            errorGenerator(
              exception,
              500,
              "Could not update genre against the given _id"
            )
          );
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
    genreDBHandler
      .deleteOne(req.body)
      .then((deletedObj) => {
        res.send(_.pick(deletedObj, ["_id", "_title"]));
      })
      .catch((exception) => {
        return next(
          errorGenerator(
            exception,
            500,
            "Could not delete genre against the given _id"
          )
        );
      });
});

module.exports = router;
