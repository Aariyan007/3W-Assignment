const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// Create post
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

// Get all posts
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Like post
router.post("/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.body.username)) {
    post.likes.push(req.body.username);
    await post.save();
  }
  res.json(post);
});

// Comment
router.post("/:id/comment", async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push(req.body);
  await post.save();
  res.json(post);
});

module.exports = router;
