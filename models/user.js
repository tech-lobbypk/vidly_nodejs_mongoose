const mongoose = require("mongoose");
const joi = require("joi");

const config = require("config");
const jwt = require("jsonwebtoken");
const { join } = require("lodash");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLenght: 5,
    maxLength: 10,
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
  isAdmin: Boolean,
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
module.exports.User = User;
module.exports.validate = validate;
module.exports.validateLogin = validateLogin;
