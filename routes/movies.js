const express = require("express");
const router = express.Router();

const _ = require("lodash");
const errorGenerator = require("../utility/errorGenerator");

const { validateMovieSchema } = require("../models/movie");

const movieDBHandler = require("../mongoDB/movieDBHandler");
const genreDBHandler = require("../mongoDB/genreDBHandler");
const admin = require("../middlewares/admin");
const authMiddleware = require("../middlewares/authentication");
const { validate } = require("../models/user");

const validateMovieObj = (req, next) => {
  const result = validateMovieSchema(req.body);
  if (result.error) {
    console.log("joi validation failed");
    next(errorGenerator(result.error, 400, result.error.details[0].message));
    return false;
  }
  return true;
};

function extractGenre(req, next) {
  return new Promise((resolve, reject) => {
    validateMovieObj(req, next);
    let temp_obj = { _id: req.body._id_genre };
    genreDBHandler
      .findOne(temp_obj)
      .then((objGenre) => {
        resolve(objGenre);
      })
      .catch((error) => {
        next(
          errorGenerator(
            error,
            400,
            "Could not fetch genre against the given _id"
          )
        );
        reject(error);
      });
  });
}

router.post("/add", authMiddleware, async (req, res, next) => {
  if (validateMovieObj(req, next)) {
    extractGenre(req, next).then((objGenre) => {
      console.log("In then ----------");
      let objMovie = _.pick(req.body, ["name", "dailyRent", "stock"]);
      objMovie.genre = _.pick(objGenre, ["_id", "title"]);
      saveMovie(objMovie, res, next);
    });
  }
});

function saveMovie(objMovie, res, next) {
  movieDBHandler
    .saveOne(objMovie)
    .then((result) => {
      res.send(_.pick(result, ["name", "dailyRent", "stock", "genre"]));
    })
    .catch((exception) => {
      return next(
        errorGenerator(exception, 400, "Could not save movie.. try again")
      );
    });
}

router.get("/", async (req, res, next) => {
  movieDBHandler
    .findAll()
    .then((result) => {
      return res.send(
        _.map(
          result,
          _.partialRight(_.pick, ["_id", "name", "stock", "dailyRent", "genre"])
        )
      );
    })
    .catch((exception) => {
      return next(errorGenerator(exception, 500, "Internal error"));
    });
});

router.get("/:id", async (req, res, next) => {
  movieDBHandler
    .findOne({ _id: req.params.id })
    .then((result) => {
      return res.send(
        _.pick(result, ["_id", "name", "stock", "dailyRent", "genre"])
      );
    })
    .catch((exception) => {
      return next(errorGenerator(exception, 500, "Internal error"));
    });
});

router.put("/update", authMiddleware, (req, res, next) => {
  console.log("Movies /put endpoint called");
  if (validateMovieObj(req, next)) {
    extractGenre(req, next).then((objGenre) => {
      req.body.genre = objGenre;
      updateMovie(req, res, next);
    });
  }
});

function updateMovie(req, res, next) {
  movieDBHandler
    .updateOne(req.body)
    .then((result) => {
      res.send(_.pick(result, ["_id", "name", "stock", "dailyRent", "genre"]));
    })
    .catch((exception) => {
      return next(errorGenerator(exception, 500, "Internal error"));
    });
}

router.delete("/delete", [authMiddleware, admin], (req, res, next) => {
  console.log("Movie /delete endpoint called");
  if (!req.body._id)
    next(errorGenerator("_id not defined", 500, "_id cannot be undefined"));
  else
    movieDBHandler
      .deleteOne(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((exception) => {
        return next(errorGenerator(exception, 500, "Internal error"));
      });
});
module.exports.moviesRouter = router;
