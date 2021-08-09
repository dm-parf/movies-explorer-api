const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  updateUser, getMe,
} = require('../controllers/users');

router.get('/users/me', getMe);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

router.use(errors());

module.exports = router;
