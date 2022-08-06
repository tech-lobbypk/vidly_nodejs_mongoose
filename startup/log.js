const winston = require("winston");
const config = require("config");
require("winston-mongodb");

winston.exceptions.handle(
  new winston.transports.File({ filename: "logs/exceptions.log" }),
  new winston.transports.Console({ colorize: true, prettyPrint: true })
);
//winston.rejections.handle();
/*process.on("uncaughtException", (ex) => {
  winston.error(ex);
});*/

process.on("unhandledRejection", (ex) => {
  throw ex;
});

winston.add(new winston.transports.File({ filename: "logs/errors.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb+srv://dbadmin:12345@cluster0.jbhnw.mongodb.net/?retryWrites=true&w=majority",
    // There are 6 levels: error,warn, info, verbose, debug, silly. Setting level to "info" will log message till "info" which includes "error" and "warn"
    // Lower levels will be ignored while storing logs to the mongoDB
    level: "info",
    options: {
      useUnifiedTopology: true,
    },
  })
);
