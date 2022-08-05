const config = require("config");
const router = require("express").Router();
const { response } = require("express");
const { User, validate, validateLogin } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authentication");
require("express-async-errors");
const errorGenerator = require("../utility/errorGenerator");
const admin = require("../middlewares/admin");

router.post("/register", async (req, res, next) => {
  console.log("Inside /register");
  console.log(req.body);
  const result = validate(req.body);
  console.log(result);
  if (result.error) {
    console.log("Error: " + result);
    next(errorGenerator(result.error, 400, result.error.details[0].message));
  } else {
    console.log("valid object");
    try {
      const newUser = new User(
        _.pick(req.body, ["username", "password", "email", "isAdmin", "phone"])
      );
      const salt = await bcrypt.genSalt(10);
      console.log(salt);
      const hashedPassword = await bcrypt.hash(newUser.password, salt);
      newUser.password = hashedPassword;
      await newUser.save();
      res
        .header("x-auth-token", newUser.generateAuthToken())
        .send(_.pick(newUser, ["username", "email"]));
    } catch (exception) {
      next(errorGenerator(exception, 500, "Internal Error.. try again"));
    }
  }
});

router.post("/login", async (req, res, next) => {
  console.log("Inside login");
  const validationResult = validateLogin(req.body);
  if (validationResult.error)
    next(
      errorGenerator(
        validationResult.error,
        400,
        validationResult.error.details[0].message
      )
    );
  const result = await User.findOne({ username: req.body.username });
  if (!result)
    return next(
      errorGenerator(
        "Invalid Username or password",
        400,
        "Invalid username or password"
      )
    );
  try {
    const compResult = await bcrypt.compare(req.body.password, result.password);
    if (compResult) {
      // set environment variable jwtConfig to a key to run the app
      // export jwtConfig=/* some value */
      return res
        .status(200)
        .header("x-auth-token", result.generateAuthToken())
        .send("Login Successful");
    }
    next(errorGenerator(exception, 400, "Invalid username or password"));
  } catch (exception) {
    return next(errorGenerator(exception, 500, "Internal Error ... try again"));
  }
});

router.get("/", [authMiddleware, admin], async (req, res, next) => {
  try {
    res.send(await User.find().sort({ username: 1 }));
  } catch (ex) {
    return next(
      errorGenerator(exception, 500, "Internal Error ... Could not fetch users")
    );
  }
});

module.exports.usersRouter = router;
