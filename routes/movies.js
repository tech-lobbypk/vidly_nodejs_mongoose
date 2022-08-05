const express = require("express");
const router = express.Router();

const _ = require("lodash");
const errorGenerator = require("../utility/errorGenerator");

const { validateMovieSchema } = require("../models/movie");

const movieDBHandler = require("../mongoDB/movieDBHandler");
const genreDBHandler = require("../mongoDB/genreDBHandler");

function extractGenre(req, next) {
  return new Promise((resolve, reject) => {
    const result = validateMovieSchema(req.body);
    if (result.error) {
      return next(
        errorGenerator(result.error, 400, result.error.details[0].message)
      );
    }
    let temp_obj = { _id: req.body._id_genre };
    genreDBHandler.findOne(temp_obj, (objGenre, error) => {
      if (error) {
        return next(
          errorGenerator(
            error,
            400,
            "Could not fetch genre against the given _id"
          )
        );
      }
      resolve(objGenre);
    });
  });
}

router.post("/add", async (req, res, next) => {
  extractGenre(req, next).then((objGenre) => {
    let objMovie = _.pick(req.body, ["name", "dailyRent", "stock"]);
    objMovie.genre = _.pick(objGenre, ["_id", "title"]);
    saveMovie(objMovie, res);
  });
});

function saveMovie(objMovie, res) {
  movieDBHandler.saveOne(objMovie, (result, error) => {
    return result
      ? res.send(_.pick(result, ["name", "dailyRent", "stock", "genre"]))
      : next(errorGenerator(error, 400, "Could not save movie.. try again"));
  });
}

router.get("/", async (req, res, next) => {
  movieDBHandler.findAll((result, exception) => {
    return result
      ? res.send(result)
      : next(errorGenerator(exception, 500, "Internal error"));
  });
});

router.put("/update", (req, res, next) => {
  console.log("Movies /put endpoint called");
  extractGenre(req, next).then((objGenre) => {
    req.body.genre = objGenre;
    updateMovie(req, res, next);
  });
});

function updateMovie(req, res, next) {
  movieDBHandler.updateOne(req.body, (result, exception) => {
    console.log(result);
    return result
      ? res.send(result)
      : next(errorGenerator(exception, 500, "Internal error"));
  });
}

router.delete("/delete", (req, res, next) => {
  console.log("Movie /delete endpoint called");
  if (!req.body._id) next(errorGenerator(err, 500, "_id cannot be undefined"));
  else
    movieDBHandler.deleteOne(req.body, (result, exception) => {
      return result
        ? res.send(result)
        : next(errorGenerator(exception, 500, "Internal error"));
    });
});
module.exports.moviesRouter = router;
