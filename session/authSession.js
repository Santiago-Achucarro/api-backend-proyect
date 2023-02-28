const { verifyToken } = require("../usersData/config/handleJWT");

const Auth = async (req, res, next) => {
  let error = new Error("Invalid Token");

  if (!req.headers.authorization) {
    let error = new Error("No find token");
    error.status = 403;
    return next(error);
  }
  const token = req.headers.authorization.split(" ").pop();

  const isVerified = await verifyToken(token, (err, authData) => {
    if (err) {
      return false;
    }
  });

  if (!isVerified) {
    error.status = 401;
    return next(error);
  }
  next();
};

module.exports = Auth;
