const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    fullName: { type: String, require },
    userName: { type: String, require },
    content: { type: String, require },
  },
  { timestamps: true }
);

postSchema.index({ userName: "text" });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
  