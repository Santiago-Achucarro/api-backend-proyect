const controller = [];
const User = require("../userSchema/userSchema");
const fs = require("fs");
const { tokenSign, verifyToken } = require("../config/handleJWT");
const transport = require("../config/handleMailtrap");
const { hashPassword, checkPassword } = require("../config/hashPass");

controller.getAllUser = (req, res, next) => {
  User.find()
    .then((data) => {
      data.length
        ? res.status(200).json(data)
        : res.status(200).json({ message: "Not have any users yet" });
    })
    .catch((error) => {
      error.status = 500;
      next(error);
    });
};

controller.updateUser = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      // check authorization if the user is has login before the 24hs
      let token = req.headers.authorization.split(" ").pop();
      validate = await verifyToken(token);

      if (validate instanceof Error) {
        return res.status(500).json({ message: validate });
      }
      const userUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res.status(200).json(userUpdate);
    }
    return res.status(404).json({ message: "Token not found" });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

controller.deleteUser = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ").pop();
      let validate = await verifyToken(token);

      if (validate instanceof Error) {
        return res.status(403).json({ message: validate });
      }

      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }

      function obtenerSubcadena(str) {
        // esta funcion solo me devuelve a partir de public en adelante
        var index = str.indexOf("public");
        if (index != -1) {
          return str.substring(index);
        } else {
          return "Not pic found";
        }
      }

      if (user?.profilePic) {
        const pathPic = obtenerSubcadena(user.profilePic);
        fs.unlink(pathPic, (err) => {
          if (err) throw err;
          console.log("user picture deleted");
        });
      }

      return res
        .status(200)
        .json({ user: user.id, status: 200, message: "User eliminated" });
    }
    return res.status(404).json({ message: "Token not found" });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

controller.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userData = {
    id: user._id,
    email: user.email,
    username: user.userName,
  };
  const token = await tokenSign(userData, "10m");
  const tokenHash = await hashPassword(token);

  const userWithToken = await User.findByIdAndUpdate(userData.id, {
    tokenForgot: token,
    tokenHash: tokenHash,
  });

  const url = `${process.env.url_dev}/api/users/reset/${encodeURIComponent(
    tokenHash.replace(/\//g, "-")
  )}`;

  const message = `<h1> You are receiving this email because you (or someone else) has requested the reset of a password. </h1> Please make a PUT request to: <a href=${url}> Reset Password </a> <br> <h3>NOTE:<h3> <h4>This link expires in 10 minutes </h4>`;

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

controller.resetPassword = async (req, res) => {
  const { token } = req.params;
  const tokenDecode = decodeURIComponent(token.replace(/-/g, "/"));
  const user = await User.findOne({ tokenHash: tokenDecode });

  if (!user) {
    const error = new Error(
      "Link expired or is invalid, please retry later or request other password recovery"
    );
    error.status = 500;
    return res.render("resetPass", { Status: true, StatusMsg: error.message });
  }

  const tokenVerify = await checkPassword(user.tokenForgot, tokenDecode);

  if (tokenVerify instanceof Error) {
    const error = new Error(
      "Link expired or is invalid, please retry later or request other password recovery"
    );
    error.status = 500;
    return res.render("resetPass", { Status: true, StatusMsg: error.message });
  }

  const tokenStatus = await verifyToken(user.tokenForgot);
  if (tokenStatus instanceof Error) {
    const error = new Error(
      "Link expired or is invalid, please retry later or request other password recovery"
    );
    error.status = 500;
    return res.render("resetPass", { Status: true, StatusMsg: error.message });
  }

  res.render("resetPass", {
    token,
    Status: false,
  });
};

controller.saveNewPass = async (req, res, next) => {
  const { token } = req.params;
  const tokenDecode = decodeURIComponent(token.replace(/-/g, "/"));
  const user = await User.findOne({ tokenHash: tokenDecode });

  if (!user) {
    const error = new Error(
      "Link expired or is invalid, please retry later or request other password recovery"
    );
    error.status = 500;
    return res.render("resetPass", { Status: true, StatusMsg: error.message });
  }

  const tokenVerify = await checkPassword(user.tokenForgot, tokenDecode);
  if (tokenVerify instanceof Error) {
    const error = new Error(
      "Link expired or is invalid, please retry later or request other password recovery"
    );
    error.status = 500;
    return res.render("resetPass", { Status: true, StatusMsg: error.message });
  }
  const tokenStatus = await verifyToken(user.tokenForgot);

  if (tokenStatus instanceof Error) {
    const error = new Error(
      "Link expired or is invalid, please retry later or request other password recovery"
    );
    error.status = 500;
    return res.render("resetPass", { Status: true, StatusMsg: error.message });
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    const error = new Error("Passwords do not match");
    error.status = 500;
    return res.render("resetPass", {
      token,
      Status: false,
      StatusMsg: error.message,
    });
  }

  const newPass = await hashPassword(password);
  try {
    const user = await User.findByIdAndUpdate(
      tokenStatus.id,
      { password: newPass, tokenHash: "" },
      { new: true }
    );

    await User.findByIdAndUpdate(
      tokenStatus.id,
      { tokenForgot: "" },
      { new: true }
    );

    if (!user) {
      return res.render("resetPass", {
        token,
        Status: true,
        StatusMsg: `Token no encontrado`,
      });
    } else {
      return res.render("resetPass", {
        token,
        Status: true,
        SuccessMsg: `Password changed successfully for user ${user.userName}`,
      });
    }
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

module.exports = controller;
