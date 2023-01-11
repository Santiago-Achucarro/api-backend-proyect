const bcrypt = require("bcrypt");
const saltRounds = 10;

const functionsForHash = []

functionsForHash.hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

functionsForHash.checkPassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};


module.exports = functionsForHash