const express = require("express");
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require("../db/index");

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags,
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const { tagName } = req.params;
  try {
    const response = await getPostsByTagName(tagName);
    const posts = response.filter(post => {
        if (post.active === true || (req.user !== undefined && req.user.id === post.author.id) ) {
            return true
        } 
      // keep a post if it is either active, or if it belongs to the current user
    });
    res.send({ posts: posts });
    // send out an object to the client { posts: // the posts }
  } catch ({ name, message }) {
    next({ name: name, message: message });
    // forward the name and message to the error handler
  }
});

module.exports = tagsRouter;
