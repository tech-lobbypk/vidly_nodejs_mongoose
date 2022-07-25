const express = require("express");
const genresRouter = require("../routes/genres");
const { usersRouter } = require("../routes/users");

module.exports = function (app) {
  app.use(express.json());
  app.use("/genres", genresRouter);
  app.use("/users", usersRouter);
};
