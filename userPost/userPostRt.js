const Auth = require("../session/authSession");
const { allPost, createPost, deletePost } = require("./userPostCt");

const Router = require("express").Router();

Router.get("/", allPost);
Router.post("/", Auth, createPost);
Router.delete("/:id",Auth, deletePost);

module.exports = Router;
