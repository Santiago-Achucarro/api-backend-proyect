const { tokenSign, verifyToken } = require("../config/handleJWT");
const { checkPassword } = require("../config/hashPass");
const User = require("../userSchema/userSchema");

const controller = [];

controller.userLogin = async (req, res, next) => {
  if (req.headers.authorization) {
    // check authorization if the user is has login before the 24hs
    let token = req.headers.authorization.split(" ").pop();
    let validate = await verifyToken(token);
    if (validate instanceof Error) {
      return res.status(500).json({ message: validate });
    }
    const user = await User.find().where(validate.email);
    let error = new Error("Acceso no permitido");

    if (!user.length) {
      error.status = 401;
      return next(error);
    }
    return res.status(200).json({
      validate,
    });
  }

  // if the user is not has login, validate the password and return the token
  let error = new Error("Email o Contraseña incorrectos");
  const { email, password } = req.body;
  const user = await User.find().where({ email });
  if (!user.length) {
    error.status = 401;
    return next(error);
  }
  const isPass = await checkPassword(password, user[0].password);
  if (!isPass) {
    error.status = 401;
    return next(error);
  }
  const userData = {
    email: user[0].email,
    username: user[0].userName,
    fullName: user[0].fullName,
  };
  const tokenForAccess = await tokenSign(userData, "24h");
  return res.status(200).json({
    tokenForAccess,
    userData,
  });
};

module.exports = controller;

//
