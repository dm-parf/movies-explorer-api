const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { NotValidEmail, NotValidUserData } = require('../utils/err-messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (val) => isEmail(val),
      message: NotValidEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(NotValidUserData));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(NotValidUserData));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
