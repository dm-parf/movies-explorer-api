const { ServerError } = require('../utils/err-messages');

module.exports = ((
  err, req, res, next,
) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? ServerError : message });
  next();
});
