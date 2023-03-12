const { verifyToken } = require("../usersData/config/handleJWT");
const User = require("../usersData/userSchema/userSchema");
const Post = require("./userPostMd");
const controller = [];

controller.allPost = (req, res, next) => {
  Post.find()
    .then((data) => {
      data.length ? res.status(200).json(data) : res.status(200).json(data);
    })
    .catch((error) => {
      error.status = 500;
      next(error);
    });
};

controller.createPost = async (req, res, next) => {
  if (req.headers.authorization) {
    const { content } = req.body;
    let token = req.headers.authorization.split(" ").pop();
    let validate = await verifyToken(token);

    if (validate instanceof Error) {
      return res.status(403).json({ message: validate });
    }

    const user = await User.find().where(validate.username);
    let error = new Error("Usuario no encontrado");

    if (!user.length) {
      error.status = 401;
      return next(error);
    }

    const newPost = new Post({
      userName: validate.username,
      fullName: validate.fullName,
      content,
    });

    await newPost.save((error) => {
      if (error) {
        error.status = 500;
        next(error);
      } else {
        res.status(200).json(newPost);
      }
    });
  } else {
    res.status(500).json({ message: "Invalid or not found token" });
  }
};

controller.deletePost = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ").pop();
      let validate = await verifyToken(token);

      if (validate instanceof Error) {
        return res.status(403).json({ message: validate });
      }

      const PostUser = await Post.findById(req.params.id);
      if (!PostUser) {
        return res.status(404).json({ message: "Post not found " });
      }

      if (PostUser.userName == validate.username) {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: deletedPost, status: 200 });
      }
      return res
        .status(500)
        .json({ message: "This post does not belong to the user" });
    } else {
      res.status(500).json({ message: "Invalid or not found token" });
    }
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

module.exports = controller;
