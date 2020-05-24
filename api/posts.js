const express = require("express");
const postsRouter = express.Router();
const { getAllPosts, createPost, getPostById, updatePost } = require('../db/index');

const { requireUser } = require('./utils');


postsRouter.use((req, res, next) => {
  console.log("A request is being made to /api/posts");

  next();
});

  
    postsRouter.get('/', async (req, res, next) => {
        try {
          const allPosts = await getAllPosts();
      
          const posts = allPosts.filter(post => {
              if (post.active === true || (req.user !== undefined && req.user.id === post.author.id) ) {
                  return true
              } 
            // keep a post if it is either active, or if it belongs to the current user
          });
      
          res.send({
            posts
          });
        } catch ({ name, message }) {
          next({ name, message });
        }
      });
 

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {};
  console.log(tagArr)
  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
      postData.authorId = req.user.id
      postData.title = title
      postData.content = content
    // add authorId, title, content to postData object
    const post = await createPost(postData);
    // this will create the post and the tags for us
    res.send({ post });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
      const post = await getPostById(req.params.postId);
  
      if (post && post.author.id === req.user.id) {
        const updatedPost = await updatePost(post.id, { active: false });
  
        res.send({ post: updatedPost });
      } else {
        // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
        next(post ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a post which is not yours"
        } : {
          name: "PostNotFoundError",
          message: "That post does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalPost = await getPostById(postId);
  
      if (originalPost.author.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);
        res.send({ post: updatedPost })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  module.exports = postsRouter
