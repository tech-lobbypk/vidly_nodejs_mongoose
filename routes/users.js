const config = require("config");
const router = require("express").Router();
const { response } = require("express");
const { User, validate, validateLogin } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authentication");

router.post("/register", async (req, res) => {
  const result = validate(req.body);
  if (result.error) {
    console.log("Error: " + result.error);
    res.send(result.error.details[0].message);
  } else {
    console.log("valid object");
    const newUser = new User(
      _.pick(req.body, ["username", "password", "email", "isAdmin"])
    );
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;
    await newUser.save();
    res
      .header("x-auth-token", newUser.generateAuthToken())
      .send(_.pick(newUser, ["username", "email"]));
  }
});

router.post("/login", async (req, res) => {
  const validationResult = validateLogin(req.body);
  if (validationResult.error)
    return res.status(400).send(validationResult.error.details[0].message);
  const result = await User.findOne({ username: req.body.username });
  if (!result) return res.status(400).send("Invalid username or password");
  const compResult = await bcrypt.compare(req.body.password, result.password);
  if (compResult) {
    // set environment variable jwtConfig to a key to run the app
    // export jwtConfig=/* some value */
    return res
      .status(200)
      .header("x-auth-token", result.generateAuthToken())
      .send("Login Successful");
  }
  return res.status(400).send("Invalid username or password");
});

module.exports.usersRouter = router;
