const User = require("../userSchema/userSchema");
const { hashPassword } = require("../config/hashPass");
const controller = [];
const url = process.env.url_dev;

controller.addUser = async (req, res, next) => {
  const { fullName, userName, email, password } = req.body;
  console.log(req.body);
  console.log(req.file);
  const hashingPassword = await hashPassword(password);
  let profilePic = "";
  if (req.file) {
    profilePic = `${url}/public/storage/${req.file.filename}`;
  }

  const newUser = new User({
    ...req.body,
    profilePic,
    password: hashingPassword,
  });

  await newUser.save((error) => {
    if (error) {
      error.status = 500;
      next(error);
    } else {
      res.status(200).json({ message: "Usuario existente", status: 200 });
    }
  });
};

module.exports = controller;
