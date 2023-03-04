const controller = [];
const User = require("../userSchema/userSchema");
const fs = require("fs");
const { tokenSign, verifyToken } = require("../config/handleJWT");
const transport = require("../config/handleMailtrap");
const { hashPassword } = require("../config/hashPass");

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
      const pathPic = obtenerSubcadena(user.profilePic);
      fs.unlink(pathPic, (err) => {
        if (err) throw err;
        console.log("user picture deleted");
      });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user.id, status: 200 });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

controller.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userData = {
    id: user._id,
    email: user.email,
    username: user.userName,
  };
  const token = await tokenSign(userData, "10m");

  const url = `${process.env.url_dev}/api/users/reset/${token}`;

  const message = `<h1> You are receiving this email because you (or someone else) has requested the reset of a password. </h1> Please make a PUT request to: <a href=${url}> Reset Password </a> <br> <h3>NOTE:<h3> <br> <h4>This link expires in 10 minutes </h4>`;

  const mailForUser = {
    from: "AsistUser@mail.com",
    to: userData.email,
    subject: "Password recovery magic link",
    html: message,
  };

  transport.sendMail(mailForUser, (error, data) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ message: `Email sent for ${userData.username}` });
    }
  });
};

controller.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await verifyToken(token);

  if (tokenStatus instanceof Error) {
    const error = new Error(
      "Token expired or is invalid, please retry later or request other password recovery"
    );
    error.status = 500;
    return res.render("resetPass", { errStatus: true, errMsg: error.message });
  }

  res.render("resetPass", {
    token,
    tokenStatus,
    errStatus: false,
  });
};

controller.saveNewPass = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await verifyToken(token);

  if (tokenStatus instanceof Error) {
    return next(tokenStatus);
  }

  const { password, confirmPassword } = req.body;

  console.log(req.body);
  if (password !== confirmPassword) {
    const error = new Error("Passwords do not match");
    error.status = 500;
    return res.render("resetPass", { errStatus: false, errMsg: error.message });
  }

  const newPass = await hashPassword(password);

  try {
    const user = await User.findByIdAndUpdate(
      tokenStatus.id,
      { password: newPass },
      { new: true }
    );
    res.status(200).json({
      message: `Password changed successfully for user ${tokenStatus.userName}`,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

module.exports = controller;
