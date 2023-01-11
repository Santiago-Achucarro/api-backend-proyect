const controller = [];
const { hashPassword } = require("./config/hashPass");
const User = require("./userMd");

controller.getAlluser = (req, res, next) => {
  User.find()
    .then((data) => {
      data.length ? res.json(data).status(200) : next();
    })
    .catch((error) => {
      error.status = 500;
      next(error);
    });
};

controller.addUser = async (req, res, next) => {
  const { fullName, userName, email, profilePic, password } = req.body;
  const hashingPassword = await hashPassword(password);
  const userDtaNew = {
    fullName,
    userName,
    email,
    profilePic,
    password: hashingPassword,
  };
  const newUser = new User(userDtaNew);
  await newUser.save((error) => {
    if (error) {
      error.status = 500;
      next(error);
    } else {
      res.status(200).json(newUser);
    }
  });
};

controller.updateUser = async (req, res, next) => {
  try {
    const userUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // Adicionando el true en la peticion, nos devuelve el cambio, sin el mismo nos retorna el valor del usuario antes del cambios
    res.status(200).json(userUpdate);
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

controller.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ user: user.id, status: 200 });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

module.exports = controller;
