const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const urlcheck = (value) => {
  if (!isURL(value)) { throw new Error('URL validation err'); } else { return value; }
};

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlcheck),
    trailer: Joi.string().required().custom(urlcheck),
    thumbnail: Joi.string().required().custom(urlcheck),
    movieid: Joi.string().required(),
    nameru: Joi.string().required(),
    nameen: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
