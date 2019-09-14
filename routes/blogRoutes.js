const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache =  require("../middlewares/cleanCache")

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });
 // get user post
  app.get('/api/blogs', requireLogin, async (req, res) => {
    let newBlogs = await Blog.find({ _user: req.user.id })
    .cache({key: req.user.id});
    return res.send(newBlogs)
  });

  // create a new blog 
  app.post('/api/blogs', requireLogin, cleanCache,  async (req, res) => {
    const { title, content } = req.body;
    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });
   if (!title|| !content) return res.send(400, {error: "Please put all the parameter"})
    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
