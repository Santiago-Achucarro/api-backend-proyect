const { userLogin } = require("./userLoginCt");

const Router = require("express").Router();

Router.post("/", userLogin);

module.exports = Router