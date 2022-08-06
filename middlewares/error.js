const winston = require("winston");
const winston_mongodb = require("winston-mongodb");
module.exports = function (err, req, res, next) {
  console.log(err);
  console.log("Exception Caught");
  winston.error("Internal error: " + err.message, err);
  res.status(err.code).send(err.message);
  //next();
};
