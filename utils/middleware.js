const jwt = require('jsonwebtoken');
const { Session } = require('../models');

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null;
  }

  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET);
    const session = await Session.findOne({ where: { token: request.token } });

    if (!decodedToken.id || !session) {
      return response.status(401).json({ error: 'token invalid' });
    }

    request.user = decodedToken;
  }

  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: error.message });
  }

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    return response
      .status(400)
      .json({ error: error.errors.map((e) => e.message) });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }

  next(error);
};

module.exports = { tokenExtractor, userExtractor, errorHandler };
