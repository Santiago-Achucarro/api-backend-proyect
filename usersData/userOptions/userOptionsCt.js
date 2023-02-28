const controller = [];
const User = require("../userSchema/userSchema");
const fs = require("fs");
const { tokenSign } = require("../config/handleJWT");

controller.getAllUser = (req, res, next) => {
  User.find()
    .then((data) => {
      data.length ? res.status(200).json(data) : next();
    })
    .catch((error) => {
      error.status = 500;
      next(error);
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
    console.log(user.profilePic);
    //http://localhost:3000/public/storage/usrPic_1677512005460.jpg como me llega el path desde la base de datos

    function obtenerSubcadena(str) {
      // esta funcion solo me devuelve a partir de public en adelante
      var index = str.indexOf("public");
      if (index != -1) {
        return str.substring(index);
      } else {
        return "Not pic found";
      }
    }

    if (user.profilePic) {
      const pathPic = `public/${obtenerSubcadena(user.profilePic)}`;
      fs.unlink(pathPic, (err) => {
        if (err) throw err;
        console.log("user picture deleted");
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    res.status(200).json({ user: user.id, status: 200 });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

controller.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userData = {
    id: user[0].id,
    email: user[0].email,
    username: user[0].userName,
  };
  const token = await tokenSign(userData, "10m");

  const url = `${process.env.url_dev}/api/users/reset/${token}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: ${url}`;

  const mailDetails = {
    from: "AsistUser@mail.com",
    to: userData.email,
    subject: "Password recovery magic link",
    html: message,
  };
};

controller.resetPassword = async (req, res) => {};

module.exports = controller;
