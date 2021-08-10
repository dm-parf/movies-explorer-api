const { prodFront } = require('../utils/constants');

const allowedCors = [
  prodFront,
];

const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

module.exports = function cors(req, res, next) {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'origin, X-requested-With, Content-Type, Accept, X-Auth-Token');
  }

  next();
};
