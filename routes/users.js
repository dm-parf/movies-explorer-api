const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  updateUser, getMe,
} = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().not(''),
    email: Joi.string().required().email(),
  }),
}), updateUser);

router.use(errors());

module.exports = router;
