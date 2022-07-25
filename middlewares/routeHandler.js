module.exports = (handlerFunction) => {
  return async (req, res, next) => {
    try {
      console.log("TTTTTTTT--------");
      await handlerFunction(req, res);
    } catch (ex) {
      console.log("QQQQQQ------");
      next(ex);
    }
  };
};
