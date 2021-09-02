const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const noway = require('./middlewares/noway');
const { limiter } = require('./middlewares/limiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { prodPort, prodFront, prodMongo } = require('./utils/constants');

const { PORT = prodPort, FRONT_URL = prodFront, MONGO_URL = prodMongo } = process.env;

const app = express();

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

app.use(require('./routes/auth'));

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use('*', noway);

app.use(errorLogger);

app.use(error);

app.listen(PORT, () => {});
