const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  username: String,
  text: String,
  imageUrl: String,
  likes: [String],
  comments: [
    {
      username: String,
      text: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
