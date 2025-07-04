const app = require('./app');
const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');
const logger = require('./utils/logger');

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
};

start();
