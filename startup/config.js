const config = require("config");
module.exports = function () {
  if (!config.get("jwtConfig")) {
    throw new Error(
      "Environment variable vidly_jwtConfig not defined. Terminating"
    );
  }
  if (!config.get("dbConfig")) {
    console.log("Testing");
    throw new Error(
      "Environment variable dbConnString not defined. Terminating"
    );
  }
};
