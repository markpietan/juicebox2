const express = require('express');
const apiRouter = express.Router();

const usersRouter = require('./users.js');
const postsRouter = require('./posts.js');
const tagsRouter = require('./tags.js');
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);

module.exports = apiRouter;