module.exports = function (exception, code, message) {
  return {
    exception: exception,
    code: code,
    message: message,
  };
};
