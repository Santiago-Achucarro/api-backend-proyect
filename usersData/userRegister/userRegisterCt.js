const User = require("../userSchema/userSchema");
const fs = require("fs");
const { hashPassword } = require("../config/hashPass");
const controller = [];
const url = process.env.url_dev;

controller.addUser = async (req, res, next) => {
  const { password } = req.body;
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
      function obtenerSubcadena(str) {
        var index = str.indexOf("public");
        if (index != -1) {
          return str.substring(index);
        } else {
          return "Not pic found";
        }
      }

      if (req.file) {
        const pathPic = obtenerSubcadena(req.file.path);
        fs.unlink(pathPic, (err) => {
          if (err) throw err;
          console.log("user picture deleted");
        });
      }

      next(error);
    } else {
      res
        .status(200)
        .json({ message: "Usuario Creado Exitosamente", status: 200 });
    }
  });
};

module.exports = controller;
