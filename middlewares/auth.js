const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');
const { devSKey } = require('../utils/constants');

module.exports = (req, res, next) => {
  let token = '';
  const S_KEY = process.env.NODE_ENV !== 'production' ? devSKey : process.env.SECRET_KEY;
  if (req.cookies.jwt) { token = req.cookies.jwt.trim(); }
  let payload;
  try {
    payload = jwt.verify(token, S_KEY);
  } catch (err) {
    next(new Unauthorized(err.message));
  }

  req.user = payload;

  return next();
};
