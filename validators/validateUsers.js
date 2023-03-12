const { check, validationResult } = require("express-validator");
const controller = [];

controller.ValidateUser = [
  check("fullName").trim().notEmpty().withMessage("This field cannot be empty"),
  check("userName")
    .trim()
    .notEmpty()
    .withMessage("This field cannot be empty")
    .isLength({ min: 3, max: 30 })
    .withMessage("Character count is not correct"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("This field cannot be empty")
    .isLength({ min: 3, max: 30 })
    .withMessage("Character count is not correct"),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("This field cannot be empty")
    .isEmail()
    .withMessage("This is not a email"),
  (req, res, next) => {
    const err = validationResult(req);
    console.log(req.body);
    if (!err.isEmpty()) {
      return res.status(400).json({
        status: 400,
        error: err.array(),
      });
    } else {
      return next();
    }
  },
];

controller.ValidatePassword = [
  check("password").trim().notEmpty().withMessage("This field cannot be empty"),
  check("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("This field cannot be empty"),
  (req, res, next) => {
    const { token } = req.params;
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.render("resetPass", {
        token,
        errStatus: false,
        errArr: err.array(),
      });
    } else {
      return next();
    }
  },
];

module.exports = controller;
