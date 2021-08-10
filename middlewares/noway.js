const NotFoundError = require('../errors/not-found-err');
const { NotFoundURL } = require('../utils/err-messages');

module.exports = (() => {
  throw new NotFoundError(NotFoundURL);
});
