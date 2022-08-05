const express = require("express");
const genresRouter = require("../routes/genres");
const { usersRouter } = require("../routes/users");
const { moviesRouter } = require("../routes/movies");
const { rentalRouter } = require("../routes/rentals");

module.exports = function (app) {
  app.use(express.json());
  app.use("/", genresRouter);
  app.use("/users", usersRouter);
  app.use("/movies", moviesRouter);
  app.use("/rentals", rentalRouter);
};
