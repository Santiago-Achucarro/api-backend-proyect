const Router = require("express").Router();
const uploadPic = require("../config/handleStorage");
const { addUser } = require("./userRegisterCt");

Router.post("/", uploadPic.single("profilePic"), addUser);

module.exports = Router;

