const express = require("express");
const app = express();
// execute export DEBUG=app:log to see log messages on console
const debug = require("debug")("app:log");

const error = require("./middlewares/error");

require("./startup/config")();
require("./startup/db")();
require("./startup/log");
require("./startup/route")(app);
require("./startup/prod")(app);
// The Error middleware should be the last middleware added to the app to catch all errors thrown in earlier middlewares
app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (!err) debug(`Server started on port ${PORT}`);
  else throw err;
});
