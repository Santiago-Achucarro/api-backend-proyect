const { allPost, createPost, deletePost } = require("./userPostCt");

const Router = require("express").Router();

Router.get("/", allPost);
Router.post("/",  createPost);
Router.delete("/:id", deletePost);

module.exports = Router;
