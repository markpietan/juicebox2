const express = require('express');
const apiRouter = express.Router();

const usersRouter = require('./users.js');
const postsRouter = require('./posts.js');
const tagsRouter = require('./tags.js');

const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
// const { JWT_SECRET } = process.env;

// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  console.log(auth)


  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    console.log(token)
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
       console.log(id)
      if (id) {
        req.user = await getUserById(id);
        console.log("user is "+req.user)
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});
apiRouter.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
  
    next();
  });
  
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);

apiRouter.use((error, req, res, next) => {
    res.send(error);
  });



module.exports = apiRouter;

