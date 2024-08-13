const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  try {
    const saltPassword = 10;
    const hashedPassword = await bcrypt.hash(password, saltPassword);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const authCheck = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      status: "false",
      message: "a token is required for auth",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    return res.status(401).send({
      status: false,
      message: "invalid token",
    });
  }
  return next();
};

module.exports = {
  hashPassword,
  comparePassword,
  authCheck,
};
