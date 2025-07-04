const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const { User, Blog, ReadingList, Session } = require('../models');

usersRouter.get('/', async (request, response) => {
  const users = await User.findAll({
    include: { model: Blog, attributes: { exclude: ['userId'] } },
  });

  response.json(users);
});

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findByPk(request.params.id, {
    include: {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId'] },
      through: { attributes: [] },
      include: {
        model: ReadingList,
        attributes: ['read', 'id'],
        where: { read: request.query.read },
      },
    },
  });

  if (!user) {
    return response.status(404).json({ error: 'user not found' });
  }

  response.json(user);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ username, name, passwordHash });
  response.status(201).json(user);
});

usersRouter.put('/:username', async (request, response) => {
  const user = await User.findOne({
    where: { username: request.params.username },
  });

  if (!user) {
    return response.status(404).json({ error: 'user not found' });
  }

  const usernameExists = await User.findOne({
    where: { username: request.body.newUsername },
  });

  if (usernameExists) {
    return response.status(400).json({ error: 'username already exists' });
  }

  user.username = request.body.newUsername;
  await user.save();
  response.json(user);
});

usersRouter.put('/:id/disable', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const user = await User.findByPk(request.params.id);

  if (!user) {
    return response.status(404).json({ error: 'user not found' });
  }

  const session = await Session.findOne({ where: { token: request.token } });

  if (session) {
    session.destroy();
  }

  user.disabled = request.body.disabled;
  await user.save();
  response.json(user);
});

module.exports = usersRouter;
