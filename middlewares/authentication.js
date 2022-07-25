const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function (req, res, next) {
  console.log("Inside authentication");
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send("Access denied. Authentication token not provided");

  console.log("In authentication");
  console.log(token);
  //verify method will return the object that was used to generate the JWT
  // The properties of that object are preserved in the jwt, hence, they are reverse engineered to be used
  // by the next middlewares/endpoints
  const result = jwt.verify(token, config.get("jwtConfig"));
  // Here we are setting the user object to be used by the later middlewares e.g. Admin middleware
  req.user = result;

  console.log("Authentication Completed");
  console.log(req.user);
  next();
};
