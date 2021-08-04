const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUser, getMe,
} = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
  }),
}), updateUser);

module.exports = router;
