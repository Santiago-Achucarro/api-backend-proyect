const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const db_uri = process.env.db_uri;

mongoose.set("strictQuery", false);
mongoose.connect(db_uri, (err) => {
  err ? console.log(err) : console.log("database conected");
});
