const express = require('express');
const bodyParser = require("body-parser");

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const uploadProfile = multer({
  dest: '../front-end/public/profiles/',
  limits: {
    fileSize: 10000000
  }
});
const uploadImage = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// Schema for users
const userSchema = new mongoose.Schema({
  username: String,
  bio: String,
  profile: String,
});

// Model for users
const User = mongoose.model('User', userSchema);

// Schema for comments
const commentSchema = new mongoose.Schema({
  username: String,
  text: String,
  date: Date,
  children: [mongoose.Schema.Types.ObjectId],
});

// Model for comments
const Comment = mongoose.model('Comment', commentSchema);

// Schema for posts
const postSchema = new mongoose.Schema({
  username: String,
  title: String,
  image: String,
  text: String,
  date: Date,
  children: [mongoose.Schema.Types.ObjectId],
});

// Model for posts
const Post = mongoose.model('Post', postSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/profilepic', uploadProfile.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/profiles/" + req.file.filename
  });
});

// Uploads an image for a post.
app.post('/api/image', uploadImage.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// connect to the database
mongoose.connect('mongodb://localhost:27017/socialmedia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a new user in database.
app.post('/api/profiles', async (req, res) => {
  let user;
  try {
    user = await User.findOne({ username: req.body.username })
    console.log("User already exists: " + user.username);
    res.send(user);
  } catch (error) {
    user = new User({
      username: req.body.username,
      bio: req.body.bio,
      profile: req.body.profile,
    });
    try {
      await user.save();
      console.log("Created user: " + user.username);
      res.send(user);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
});

app.put('/api/profiles/:id', async (req, res) => {
  try {
    user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    console.log("Editing " + user.username);
    user.profile = req.body.profile;
    user.bio = req.body.bio;
    user.save();
    console.log("Done!");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

// List of comments from a particular user.
app.get('/api/user/comments/:id', async (req, res) => {
  try {
    user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    const username = user.username;
    console.log("Loading comments for " + username + "...");
    comments = await Comment.find({ username: username });
    console.log("Done!");
    res.send(comments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// List of posts from a particular user.
app.get('/api/user/posts/:id', async (req, res) => {
  try {
    user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    const username = user.username;
    console.log("Loading posts for " + username + "...");
    posts = await Post.find({ username: username });
    console.log("Done!");
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Upload a post.
app.post('/api/posts', async (req, res) => {
  post = new Post({
    username: req.body.username,
    title: req.body.title,
    image: req.body.image,
    text: req.body.text,
    date: new Date(),
  });
  try {
    await post.save();
    console.log("Created post: " + post.title);
    res.send(post);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    posts = await Post.find();
    posts.forEach(function(post) {
      ids = post.children.map(id => mongoose.Types.ObjectId(id));
      comments = Comment.find({ _id: { $in: ids } });
      post.comments = comments;
    });
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

// Gets one specific post
app.get('/api/posts/:id', async (req, res) => {
  try {
    post = await Post.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    ids = post.children.map(id => mongoose.Types.ObjectId(id));
    comments = await Comment.find({ _id: { $in: ids } });
    data = {
      username: post.username,
      title: post.title,
      image: post.image,
      text: post.text,
      date: post.date,
      comments: comments,
      _id: post._id,
    }
    console.log("Sending post: " + req.params.id);
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

// Deletes a post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
    console.log("Deleted post: " + req.params.id)
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

// Adds a comment to a post
app.post('/api/comment', async (req, res) => {
  comment = new Comment({
    username: req.body.username,
    text: req.body.text,
    date: new Date(),
  });
  try {
    await comment.save();
    post = await Post.findOne({ _id: mongoose.Types.ObjectId(req.body.id) });
    console.log(post);
    console.log(req.body.id);
    post.children.push(mongoose.Types.ObjectId(comment._id))
    post.save()
    console.log("This user commented: " + comment.username);
    res.send(post);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete an item.
app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
    console.log("Deleted " + req.params.id)
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.put('/api/items/:id', async (req, res) => {
  try {
    item = await Item.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    console.log("Editing " + item._id);
    if (item.title !== req.body.title) {
      console.log("Changing title from " + item.title + " to " + req.body.title);
    }
    if (item.description !== req.body.description) {
      console.log("Changing description from " + item.description + " to " + req.body.description);
    }
    item.title = req.body.title;
    item.description = req.body.description;
    item.save();
    console.log("Done!");
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.listen(3000, () => console.log('Server listening on port 3000!'));