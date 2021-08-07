const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  createUser, login, logout,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().not(''),
  }),
}), login);
router.post('/logout', logout);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().not(''),
    email: Joi.string().required().email(),
    userpassword: Joi.string().required().not(''),
  }),
}), createUser);

router.use(errors());

module.exports = router;
