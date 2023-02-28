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
  const { userName, fullName, content } = req.body;
  const user = await User.find().where(userName);
  let error = new Error("Usuario no encontrado");

  console.log("este es el log del user => ", user[0]);
  if (!user.length) {
    error.status = 401;
    return next(error);
  }

  const newPost = new Post({
    userName,
    fullName,
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
};

controller.deletePost = async (req, res, next) => {
  try {
    const deletedUser = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: deletedUser, status: 200 });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

module.exports = controller;
