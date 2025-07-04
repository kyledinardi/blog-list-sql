const readingListsRouter = require('express').Router();
const { ReadingList } = require('../models');

readingListsRouter.post('/', async (request, response) => {
  try {
    const readingList = await ReadingList.create(request.body);
    response.json(readingList);
  } catch (error) {
    response.status(400).json({ error });
  }
});

readingListsRouter.put('/:id', async (request, response) => {
  const readingList = await ReadingList.findByPk(request.params.id);

  if (!readingList) {
    return response.status(404).json({ error: 'reading list not found' });
  }

  if (readingList.userId !== request.user.id) {
    return response.status(403).json({ error: 'unauthorized' });
  }

  readingList.read = request.body.read;
  await readingList.save();
  response.json(readingList);
});

module.exports = readingListsRouter;
