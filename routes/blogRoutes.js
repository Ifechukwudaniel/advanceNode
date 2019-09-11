const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const util = require("util")
const redis = require("redis")
const redisUrl = "redis://127.0.0.1:6379"
const redisClient = redis.createClient(redisUrl)
redisClient.get=  util.promisify(redisClient.get);




const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const userBlogs = redisClient.get(req.user.id)
     userBlogs.then(async(blogs)=>{
       if(blogs)
          return res.send(JSON.parse(blogs));
       let newBlogs = await Blog.find({ _user: req.user.id });
       redisClient.set(req.user.id,JSON.stringify(newBlogs))
       return res.send(newBlogs)
    })
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
