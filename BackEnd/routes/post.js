const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

// Create post
router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike post (Toggle)
router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const username = req.body.username;
    const likeIndex = post.likes.indexOf(username);

    if (likeIndex > -1) {
      // User already liked, so unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked, so like
      post.likes.push(username);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comment
router.post("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push(req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;