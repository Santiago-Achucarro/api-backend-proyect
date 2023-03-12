const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    fullName: { type: String, require: true },
    userName: { type: String, require: true },
    content: { type: String, require: true },
  },
  { timestamps: true }
);

postSchema.index({ userName: "text" });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
