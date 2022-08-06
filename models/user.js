const mongoose = require("mongoose");
const joi = require("joi");

const config = require("config");

const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorGenerator = require("../utility/errorGenerator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLenght: 5,
    maxLength: 10,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLenght: 5,
    maxLength: 255,
  },
  email: {
    type: String,
    required: true,
    minLenght: 15,
    unique: true,
  },
  isAdmin: { type: Boolean, default: false },
  phone: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 20,
  },
});
// Method used to generate authentication token using username and isAdmin property
userSchema.methods.generateAuthToken = function authToken() {
  console.log("Inside generateAuthTOoken");
  return jwt.sign(
    { usesrname: this.username, isAdmin: this.isAdmin },
    config.get("jwtConfig")
  );
};

const User = new mongoose.model("User", userSchema);

// Schema required for registering a user
const joiSchema = joi.object({
  username: joi.string().min(5).max(10).required(),
  password: joi.string().min(5).max(255).required(),
  email: joi.string().min(15).required().email(),
  isAdmin: joi.boolean(),
  phone: joi.string().min(8).max(20).required(),
});

// Schema required for login
const joiSchemaLogin = joi.object({
  username: joi.string().min(5).max(10).required(),
  password: joi.string().min(5).max(255).required(),
});

function validate(obj) {
  return joiSchema.validate(obj);
}

function validateLogin(obj) {
  return joiSchemaLogin.validate(obj);
}

const findAllUsers = async (req, next) => {
  const result = await User.find().sort({ username: 1 });
  return result
    ? result
    : next(
        errorGenerator(
          "Could not fetch all users",
          500,
          "Internal Error: Could not fetch all users"
        )
      );
};
const extractUser = async (req, next) => {
  const result = await User.findOne({ username: req.body.username });

  return result
    ? result
    : next(
        errorGenerator(
          "Invalid Username or password",
          400,
          "Invalid username or password"
        )
      );
};

const validateUser = async (req, res, next, user) => {
  const compResult = await bcrypt.compare(req.body.password, user.password);

  if (compResult) {
    // set environment variable jwtConfig to a key to run the app
    // export jwtConfig=/* some value */
    return res
      .status(200)
      .header("x-auth-token", user.generateAuthToken())
      .send("Login Successful");
  }
  return next(
    errorGenerator(
      "Invalid username or password",
      400,
      "Invalid username or password"
    )
  );
};

const createUser = async (req, res, next) => {
  try {
    const newUser = new User(
      _.pick(req.body, ["username", "password", "email", "isAdmin", "phone"])
    );
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;
    await newUser.save();
    res
      .header("x-auth-token", newUser.generateAuthToken())
      .send(_.pick(newUser, ["username", "email"]));
  } catch (exception) {
    if (exception.code == 11000)
      return next(
        errorGenerator(
          exception,
          400,
          `${Object.keys(exception.keyValue)[0]} already taken`
        )
      );
    else
      return next(errorGenerator(exception, 400, "Internal error: Try again"));
  }
};

module.exports = {
  User,
  validate,
  validateLogin,
  createUser,
  validateUser,
  extractUser,
  findAllUsers,
};
