const express = require("express");
const cors = require("cors");
require("./database/mongo.js");
const {
  routerLogin,
  routerRegister,
  routerOptions,
} = require("./usersData/index");
const server = express();

// middlewares
server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

//external Middlewars (cors)
server.use(cors()); 

server.use("/api/users", routerOptions);
server.use("/api/users/login", routerLogin);
server.use("/api/users/register", routerRegister);

server.use("/api/post", require("./userPost/userPostRt"));

server.listen(5000, (err) => {
  err
    ? console.log(err.code)
    : console.log("server init in http://localhost:5000/");
});

server.use((req, res, next) => {
  const error = new Error("Resource Not Found");
  error.status = 404;
  next(error);
});

server.use((error, req, res, next) => {
  res
    .status(error.status)
    .json({ message: error.message, error: error.status });
});
