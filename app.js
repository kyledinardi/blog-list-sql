const express = require('express');
require('express-async-errors');
const cors = require('cors');
// const testingRouter = require('./controllers/testing');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const usersRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');
const readingListsRouter = require('./controllers/readingLists');
const middleware = require('./utils/middleware');

const app = express();
app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/login', loginRouter);
app.use('/api/logout', middleware.userExtractor, logoutRouter);
app.use('/api/users', middleware.userExtractor, usersRouter);
app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/readinglists', middleware.userExtractor, readingListsRouter);

// if (process.env.NODE_ENV === 'test') {
//   app.use('/api/testing', testingRouter);
// }

app.use(middleware.errorHandler);
module.exports = app;
