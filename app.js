const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');

require('dotenv').config();

const { createUser, login, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const noway = require('./middlewares/noway');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { prodPort, prodFront, prodMongo } = require('./utils/constants');

const { PORT = prodPort, FRONT_URL = prodFront, MONGO_URL = prodMongo } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

app.use(cors({
  origin: FRONT_URL,
  credentials: true,
}));

const allowedCors = [
  FRONT_URL,
];

const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS';

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'origin, X-requested-With, Content-Type, Accept, X-Auth-Token');

  next();
});

app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/logout', logout);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('*', noway);

app.use(errorLogger);

app.use(error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
