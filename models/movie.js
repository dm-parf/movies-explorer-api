const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const { NotValidURL } = require('../utils/err-messages');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (val) => isURL(val),
      message: NotValidURL,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (val) => isURL(val),
      message: NotValidURL,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (val) => isURL(val),
      message: NotValidURL,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieid: {
    type: String,
    required: true,
  },
  nameru: {
    type: String,
    required: true,
  },
  nameen: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
