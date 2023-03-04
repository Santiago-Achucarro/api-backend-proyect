const jwt = require("jsonwebtoken");
const jwt_secret = process.env.jwt_token_secret;

const jwtFunctions = [];

jwtFunctions.tokenSign = async (user, time) => {
  const sign = jwt.sign(user, jwt_secret, { expiresIn: time });
  return sign;
};

jwtFunctions.verifyToken = async (token) => {
  try {
    // const verify = jwt.verify(token, jwt_secret);
    return jwt.verify(token, jwt_secret);
  } catch (err) {
    return err;
  }
};

module.exports = jwtFunctions;
