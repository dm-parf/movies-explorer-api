const NotFoundError = require('../errors/not-found-err');

module.exports = ((
  // eslint-disable-next-line no-unused-vars
  req, res,
) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
