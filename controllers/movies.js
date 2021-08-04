const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');
const { BadRequestMess, NotFoundMovie, ForbiddenMess } = require('../utils/err-messages');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieid,
    nameru,
    nameen,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieid,
    nameru,
    nameen,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') { throw new BadRequest(BadRequestMess.concat(' при обновлении фильма')); } else next(err);
    })
    .catch(next);
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) { throw new NotFoundError(NotFoundMovie); }
      if (!(req.user._id === movie.owner.toString())) { throw new Forbidden(ForbiddenMess); }
      return movie.remove()
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new BadRequest(BadRequestMess); } else next(err);
    })
    .catch(next);
};
