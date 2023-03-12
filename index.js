const express = require("express");
const tmplHbs = require("express-handlebars");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv").config();
require("./database/mongo.js");

const {
  routerLogin,
  routerRegister,
  routerOptions,
} = require("./usersData/index");
const server = express();
const docs = require("./public/json/documentation.json");

// middlewares
server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

const hbs = tmplHbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),

  partialsDir: path.join(__dirname, "views/partials"),
  helpers: {
    errBelowInput: function (arrWarnings, inputName) {
      if (!arrWarnings) return null;
      const warning = arrWarnings.find((el) => el.param === inputName);
      if (warning == undefined) {
        return null;
      } else {
        return `
          <p class="text-warning mt-2">
         ${warning.msg}
          </p>
         `;
      }
    },
  },
});

server.set("views", "./views");
server.engine("handlebars", hbs.engine);
server.set("view engine", "handlebars");

//external Middlewars (cors)
server.use(cors());

server.use("/api/users", routerOptions);
server.use("/api/users/login", routerLogin);
server.use("/api/users/register", routerRegister);

server.get("/", (req, res) => {
  res.render("homePage", { docs });
});

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
  if (error.status == 404) {
    return res.render("NotFound", { errorMsg: error.message });
  }
  res
    .status(error.status)
    .json({ message: error.message, error: error.status });
});
