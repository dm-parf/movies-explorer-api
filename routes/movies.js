const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const isURL = require('validator/lib/isURL');
const { NotValidURL } = require('../utils/err-messages');
const BadRequest = require('../errors/bad-request');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const urlcheck = (value) => {
  if (!isURL(value)) { throw new BadRequest(NotValidURL); } else { return value; }
};

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlcheck),
    trailer: Joi.string().required().custom(urlcheck),
    thumbnail: Joi.string().required().custom(urlcheck),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

router.use(errors());

module.exports = router;
