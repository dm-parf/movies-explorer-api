const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Unauthorized = require('../errors/unauthorized');
const Conflict = require('../errors/conflict');
const { devSKey } = require('../utils/constants');
const {
  BadRequestMess,
  NotFoundUser,
  ConflictMess,
  SuccessEnter,
  SuccessExit,
  BadRequestMessUserCreate,
  BadRequestMessUserUpd,
} = require('../utils/err-messages');

let S_KEY = '';

if (process.env.NODE_ENV !== 'production') { S_KEY = devSKey; } else { S_KEY = process.env.SECRET_KEY; }

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) { throw new NotFoundError(NotFoundUser); }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new BadRequest(BadRequestMess); } else next(err);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, userpassword,
  } = req.body;
  bcrypt.hash(userpassword, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const { password, ...result } = user.toJSON();
      res.send(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new BadRequest(BadRequestMessUserCreate); }
      if (err.name === 'MongoError' && err.code === 11000) { throw new Conflict(ConflictMess); } else next(err);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (!user) { throw new NotFoundError(NotFoundUser); }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') { throw new BadRequest(BadRequestMessUserUpd); }
      if (err.name === 'MongoError' && err.code === 11000) { throw new Conflict(ConflictMess); } else next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, S_KEY, { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: SuccessEnter });
    })
    .catch((err) => {
      throw new Unauthorized(err.message);
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).send(SuccessExit); // .redirect(/signin)
};
