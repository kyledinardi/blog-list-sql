const blogsRouter = require('express').Router();
const { Op, fn, col } = require('sequelize');
const { Blog, User } = require('../models');

blogsRouter.get('/', async (request, response) => {
  const { search } = request.query;
  const where = {};

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } },
    ];
  }

  console.log(where);

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: { model: User, attributes: ['name'] },
    where,
    order: [['likes', 'DESC']],
  });

  response.json(blogs);
});

blogsRouter.get('/authors', async (request, response) => {
  const authors = await Blog.findAll({
    group: 'author',
    order: [[fn('SUM', col('likes')), 'DESC']],

    attributes: [
      'author',
      [fn('COUNT', col('title')), 'articles'],
      [fn('SUM', col('likes')), 'likes'],
    ],
  });

  response.json(authors);
});

blogsRouter.post('/', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const blog = await Blog.create({ ...request.body, userId: request.user.id });
  return response.json(blog);
});

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByPk(request.params.id);

  if (blog) {
    blog.likes = request.body.likes;
    await blog.save();
    response.json({ likes: blog.likes });
  } else {
    response.status(404).json({ error: 'blog not found' });
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const blog = await Blog.findByPk(request.params.id);

  if (!blog) {
    return response.status(204).end();
  }

  if (blog.userId !== request.user.id) {
    return response.status(403).json({ error: 'unauthorized' });
  }

  await blog.destroy();
  response.status(204).end();
});

module.exports = blogsRouter;
