const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');
const { devSKey } = require('../utils/constants');

module.exports = (req, res, next) => {
  let token = '';
  let S_KEY = '';
  if (process.env.NODE_ENV !== 'production') { S_KEY = devSKey; } else { S_KEY = process.env.SECRET_KEY; }
  if (req.cookies.jwt) { token = req.cookies.jwt.trim(); }
  let payload;
  try {
    payload = jwt.verify(token, S_KEY);
  } catch (err) {
    console.log(err.message);
    next(new Unauthorized(err.message));
  }

  req.user = payload;

  return next();
};
