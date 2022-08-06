const config = require("config");
const router = require("express").Router();

const userModel = require("../models/user");

const authMiddleware = require("../middlewares/authentication");
const errorGenerator = require("../utility/errorGenerator");
const admin = require("../middlewares/admin");

router.post("/register", (req, res, next) => {
  console.log("Inside /register");
  if (validateParameters(userModel.validate, req, next)) {
    userModel.createUser(req, res, next);
  }
});

router.post("/login", async (req, res, next) => {
  console.log("Inside login");
  if (validateParameters(userModel.validateLogin, req, next)) {
    try {
      const user = await userModel.extractUser(req, next);
      if (user) userModel.validateUser(req, res, next, user);
    } catch (exception) {
      return next(
        errorGenerator(exception, 500, "Internal Error ... try again")
      );
    }
  }
});

router.get("/", [authMiddleware, admin], async (req, res, next) => {
  try {
    res.send(await userModel.findAllUsers());
  } catch (exception) {
    return next(errorGenerator(exception, 500, "Internal Error: Try again"));
  }
});

const validateParameters = (validationMethod, req, next) => {
  const result = validationMethod(req.body);
  if (result.error) {
    next(errorGenerator(result.error, 400, result.error.details[0].message));
  }
  return !result.error;
};

module.exports.usersRouter = router;
