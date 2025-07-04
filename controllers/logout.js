const { Session } = require('../models');

const logoutRouter = require('express').Router();

logoutRouter.delete('/', async (request, response) => {
  const session = await Session.findOne({ where: { token: request.token } });

  if (session) {
    await session.destroy();
  }

  response.status(204).end();
});

module.exports = logoutRouter;
